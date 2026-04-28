import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import CommunityNeed, NeedStatus, NeedSeverity, User, Alert, Activity
from .auth import get_current_user

router = APIRouter()

class NeedCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    lat: float
    lng: float
    severity: str = "medium"
    issueType: str = "general"
    peopleAffected: int = 1
    location: str

class NeedUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[int] = None

# ── List all needs ──
@router.get("")
def get_needs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    needs = db.query(CommunityNeed).order_by(CommunityNeed.created_at.desc()).all()
    return [{
        "id": n.id, "title": n.title, "description": n.description,
        "location": n.location, "lat": n.lat, "lng": n.lng,
        "severity": n.severity.value if n.severity else "medium",
        "peopleAffected": n.peopleAffected,
        "timeReported": n.timeReported, "status": n.status.value if n.status else "unassigned",
        "issueType": n.issueType, "priority": n.priority,
        "reportedBy": n.reported_by
    } for n in needs]

# ── My reported needs ──
@router.get("/my")
def get_my_needs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    needs = db.query(CommunityNeed).filter(CommunityNeed.reported_by == current_user.id).order_by(CommunityNeed.created_at.desc()).all()
    return [{
        "id": n.id, "title": n.title, "description": n.description,
        "location": n.location, "lat": n.lat, "lng": n.lng,
        "severity": n.severity.value if n.severity else "medium",
        "peopleAffected": n.peopleAffected,
        "timeReported": n.timeReported, "status": n.status.value if n.status else "unassigned",
        "issueType": n.issueType, "priority": n.priority,
        "reportedBy": n.reported_by
    } for n in needs]

# ── Community feed (recent activities) ──
@router.get("/feed")
def get_feed(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    activities = db.query(Activity).order_by(Activity.created_at.desc()).limit(30).all()
    return [{"id": a.id, "kind": a.kind, "text": a.text, "time": a.time, "createdAt": str(a.created_at) if a.created_at else ""} for a in activities]


# ── Create a new need (any authenticated user) ──
@router.post("")
def create_need(need: NeedCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    need_id = f"n-{str(uuid.uuid4())[:8]}"
    severity_map = {"critical": NeedSeverity.CRITICAL, "high": NeedSeverity.HIGH, "medium": NeedSeverity.MEDIUM, "low": NeedSeverity.LOW}
    
    new_need = CommunityNeed(
        id=need_id,
        title=need.title,
        description=need.description,
        lat=need.lat, lng=need.lng,
        severity=severity_map.get(need.severity, NeedSeverity.MEDIUM),
        status=NeedStatus.UNASSIGNED,
        priority={"critical": 5, "high": 4, "medium": 3, "low": 2}.get(need.severity, 3),
        issueType=need.issueType,
        peopleAffected=need.peopleAffected,
        timeReported="just now",
        location=need.location,
        reported_by=current_user.id
    )
    db.add(new_need)

    # Create alert
    alert_id = f"a-{str(uuid.uuid4())[:8]}"
    db.add(Alert(id=alert_id, type="info", message=f"New need reported: {need.title}", location=need.location, time="just now", needId=need_id))

    # Create activity
    act_id = f"act-{str(uuid.uuid4())[:8]}"
    db.add(Activity(id=act_id, kind="user", text=f"{current_user.full_name or current_user.email} reported: {need.title}", time="just now"))

    db.commit()
    return {"message": "Need created successfully", "id": need_id}

# ── Update a need (coordinator only) ──
@router.put("/{need_id}")
def update_need(need_id: str, updates: NeedUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    need = db.query(CommunityNeed).filter(CommunityNeed.id == need_id).first()
    if not need:
        raise HTTPException(status_code=404, detail="Need not found")

    if updates.title is not None:
        need.title = updates.title
    if updates.description is not None:
        need.description = updates.description
    if updates.severity is not None:
        severity_map = {"critical": NeedSeverity.CRITICAL, "high": NeedSeverity.HIGH, "medium": NeedSeverity.MEDIUM, "low": NeedSeverity.LOW}
        need.severity = severity_map.get(updates.severity, need.severity)
    if updates.status is not None:
        status_map = {"unassigned": NeedStatus.UNASSIGNED, "assigned": NeedStatus.ASSIGNED, "in-progress": NeedStatus.IN_PROGRESS, "resolved": NeedStatus.RESOLVED}
        need.status = status_map.get(updates.status, need.status)
    if updates.priority is not None:
        need.priority = updates.priority

    db.commit()
    return {"message": "Need updated successfully"}

# ── Resolve a need ──
@router.put("/{need_id}/resolve")
def resolve_need(need_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    need = db.query(CommunityNeed).filter(CommunityNeed.id == need_id).first()
    if not need:
        raise HTTPException(status_code=404, detail="Need not found")

    need.status = NeedStatus.RESOLVED
    need.severity = NeedSeverity.RESOLVED

    act_id = f"act-{str(uuid.uuid4())[:8]}"
    db.add(Activity(id=act_id, kind="success", text=f"Need '{need.title}' resolved by {current_user.full_name or current_user.email}", time="just now"))

    db.commit()
    return {"message": "Need resolved successfully"}

# ── Delete a need (coordinator only) ──
@router.delete("/{need_id}")
def delete_need(need_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    need = db.query(CommunityNeed).filter(CommunityNeed.id == need_id).first()
    if not need:
        raise HTTPException(status_code=404, detail="Need not found")
    db.delete(need)
    db.commit()
    return {"message": "Need deleted"}
