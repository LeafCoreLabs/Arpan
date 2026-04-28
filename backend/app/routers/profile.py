from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import User, Volunteer, CommunityNeed, Task, TaskStatus, UserRole
from .auth import get_current_user

router = APIRouter()

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    skills: Optional[str] = None
    region: Optional[str] = None

@router.get("")
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = {
        "id": current_user.id, "email": current_user.email,
        "name": current_user.full_name or "", "role": current_user.role.value,
        "createdAt": str(current_user.created_at) if current_user.created_at else ""
    }
    if current_user.role == UserRole.VOLUNTEER:
        vol = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
        if vol:
            profile.update({
                "skills": vol.skills or "", "region": vol.region or "",
                "rating": vol.rating or 0, "completedTasks": vol.completedTasks or 0,
                "responseTime": vol.responseTime or "N/A", "status": vol.status.value if vol.status else "offline",
                "volunteerId": vol.id
            })
    return profile

@router.put("")
def update_profile(updates: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if updates.full_name is not None:
        current_user.full_name = updates.full_name
    if current_user.role == UserRole.VOLUNTEER:
        vol = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
        if vol:
            if updates.skills is not None:
                vol.skills = updates.skills
            if updates.region is not None:
                vol.region = updates.region
            if updates.full_name is not None:
                vol.name = updates.full_name
    db.commit()
    return {"message": "Profile updated"}

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.VOLUNTEER:
        vol = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
        total_tasks = db.query(Task).filter(Task.volunteerId == vol.id).count() if vol else 0
        completed = db.query(Task).filter(Task.volunteerId == vol.id, Task.status == TaskStatus.COMPLETED).count() if vol else 0
        active = total_tasks - completed
        return {
            "totalTasks": total_tasks, "completedTasks": completed, "activeTasks": active,
            "rating": vol.rating if vol else 0, "responseTime": vol.responseTime if vol else "N/A"
        }
    else:
        total_needs = db.query(CommunityNeed).filter(CommunityNeed.reported_by == current_user.id).count()
        resolved = db.query(CommunityNeed).filter(CommunityNeed.reported_by == current_user.id, CommunityNeed.status == "resolved").count()
        active = total_needs - resolved
        return {"totalNeeds": total_needs, "resolvedNeeds": resolved, "activeNeeds": active}
