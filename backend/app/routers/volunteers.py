import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import Volunteer, VolunteerStatus, Task, User, UserRole
from .auth import get_current_user

router = APIRouter()

class VolunteerCreate(BaseModel):
    name: str
    skills: str = ""
    region: str = ""
    lat: float = 0.0
    lng: float = 0.0

class StatusUpdate(BaseModel):
    status: str  # available, busy, offline

# ── List all volunteers ──
@router.get("/")
def get_volunteers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    volunteers = db.query(Volunteer).all()
    return [{
        "id": v.id, "name": v.name, "initials": v.initials,
        "lat": v.lat, "lng": v.lng, "status": v.status.value if v.status else "offline",
        "skills": v.skills.split(",") if v.skills else [],
        "rating": v.rating, "completedTasks": v.completedTasks,
        "region": v.region, "responseTime": v.responseTime,
        "userId": v.user_id
    } for v in volunteers]

# ── Create a volunteer profile ──
@router.post("/")
def create_volunteer(vol: VolunteerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if user already has a volunteer profile
    existing = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Volunteer profile already exists")

    vol_id = f"vol-{current_user.id}"
    initials = "".join([w[0].upper() for w in vol.name.split()[:2]]) if vol.name else "V"
    
    new_vol = Volunteer(
        id=vol_id,
        user_id=current_user.id,
        name=vol.name,
        initials=initials,
        lat=vol.lat, lng=vol.lng,
        status=VolunteerStatus.AVAILABLE,
        skills=vol.skills,
        rating=0.0,
        completedTasks=0,
        region=vol.region,
        responseTime="N/A"
    )
    db.add(new_vol)
    
    # Update user role to VOLUNTEER if they were USER
    if current_user.role == UserRole.USER:
        current_user.role = UserRole.VOLUNTEER
    
    db.commit()
    return {"message": "Volunteer profile created", "id": vol_id}

# ── Update volunteer status ──
@router.put("/{vol_id}/status")
def update_volunteer_status(vol_id: str, body: StatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vol = db.query(Volunteer).filter(Volunteer.id == vol_id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    status_map = {"available": VolunteerStatus.AVAILABLE, "busy": VolunteerStatus.BUSY, "offline": VolunteerStatus.OFFLINE}
    vol.status = status_map.get(body.status, VolunteerStatus.OFFLINE)
    db.commit()
    return {"message": "Status updated"}

# ── Get tasks for a specific volunteer ──
@router.get("/{vol_id}/tasks")
def get_volunteer_tasks(vol_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks = db.query(Task).filter(Task.volunteerId == vol_id).all()
    return [{
        "id": t.id,
        "needId": t.needId,
        "status": t.status.value if t.status else "pending",
        "assignedAt": t.assignedAt,
        "eta": t.eta,
        "needTitle": t.need.title if t.need else "Unknown",
        "needLocation": t.need.location if t.need else "",
        "needSeverity": t.need.severity.value if t.need and t.need.severity else "medium"
    } for t in tasks]
