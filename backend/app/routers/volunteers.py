import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import Volunteer, VolunteerStatus, Task, User, UserRole
from ..core.cache import cache_get, cache_set, cache_delete
from .auth import get_current_user

router = APIRouter()

class VolunteerCreate(BaseModel):
    name: str
    skills: str = ""
    region: str = ""
    lat: float = 0.0
    lng: float = 0.0

class StatusUpdate(BaseModel):
    status: str

@router.get("")
def get_volunteers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cached = cache_get("volunteers:all")
    if cached:
        return cached

    volunteers = db.query(Volunteer).all()
    result = [{
        "id": v.id, "name": v.name, "initials": v.initials,
        "lat": v.lat, "lng": v.lng, "status": v.status.value if v.status else "offline",
        "skills": v.skills.split(",") if v.skills else [],
        "rating": v.rating, "completedTasks": v.completedTasks,
        "region": v.region, "responseTime": v.responseTime, "userId": v.user_id,
    } for v in volunteers]
    cache_set("volunteers:all", result, ttl=60)
    return result

@router.post("")
def create_volunteer(vol: VolunteerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Volunteer profile already exists")
    vol_id = f"vol-{current_user.id}"
    initials = "".join([w[0].upper() for w in vol.name.split()[:2]]) if vol.name else "V"
    new_vol = Volunteer(id=vol_id, user_id=current_user.id, name=vol.name, initials=initials, lat=vol.lat, lng=vol.lng, status=VolunteerStatus.AVAILABLE, skills=vol.skills, rating=0.0, completedTasks=0, region=vol.region, responseTime="N/A")
    db.add(new_vol)
    if current_user.role == UserRole.USER:
        current_user.role = UserRole.VOLUNTEER
    db.commit()
    cache_delete("volunteers:all", "dashboard:summary")
    return {"message": "Volunteer profile created", "id": vol_id}

@router.put("/{vol_id}/status")
def update_volunteer_status(vol_id: str, body: StatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vol = db.query(Volunteer).filter(Volunteer.id == vol_id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    status_map = {"available": VolunteerStatus.AVAILABLE, "busy": VolunteerStatus.BUSY, "offline": VolunteerStatus.OFFLINE}
    vol.status = status_map.get(body.status, VolunteerStatus.OFFLINE)
    db.commit()
    cache_delete("volunteers:all", "dashboard:summary", "ai:suggestions")
    return {"message": "Status updated"}

@router.get("/{vol_id}/tasks")
def get_volunteer_tasks(vol_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cached = cache_get(f"volunteers:{vol_id}:tasks")
    if cached:
        return cached

    tasks = (
        db.query(Task)
        .options(joinedload(Task.need))
        .filter(Task.volunteerId == vol_id)
        .all()
    )
    result = [{
        "id": t.id, "needId": t.needId,
        "status": t.status.value if t.status else "pending",
        "assignedAt": t.assignedAt, "eta": t.eta,
        "needTitle": t.need.title if t.need else "Unknown",
        "needLocation": t.need.location if t.need else "",
        "needSeverity": t.need.severity.value if t.need and t.need.severity else "medium",
    } for t in tasks]
    cache_set(f"volunteers:{vol_id}:tasks", result, ttl=60)
    return result
