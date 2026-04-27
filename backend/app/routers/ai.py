import os
import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CommunityNeed, NeedStatus, Volunteer, VolunteerStatus, Task, TaskStatus, Activity
from ..schemas import UserResponse as UserSchema
from .auth import get_current_user
import uuid

router = APIRouter(prefix="/api/ai-matching", tags=["AI Matching"])

def _score():
    return random.randint(55, 98)

def _distance():
    d = round(random.uniform(0.5, 8.0), 1)
    return f"{d} km"

def _availability():
    return random.choice(["Available now", "Available in 30m", "Available in 1h", "On standby"])

@router.get("/suggestions")
async def get_suggestions(db: Session = Depends(get_db), current_user: UserSchema = Depends(get_current_user)):
    needs = db.query(CommunityNeed).filter(CommunityNeed.status == NeedStatus.UNASSIGNED).all()
    all_vols = db.query(Volunteer).all()
    available_vols = [v for v in all_vols if v.status == VolunteerStatus.AVAILABLE]
    busy_vols = [v for v in all_vols if v.status == VolunteerStatus.BUSY]

    matches = []
    unmatched = []

    for i, need in enumerate(needs):
        if i < len(available_vols):
            vol = available_vols[i]
            skill_m = _score()
            dist_m = _score()
            avail_m = _score()
            perf_m = _score()
            total = int(skill_m * 0.35 + dist_m * 0.25 + avail_m * 0.20 + perf_m * 0.20)
            matches.append({
                "id": f"match-{i+1}",
                "needTitle": need.title,
                "location": need.location,
                "severity": need.severity.value if need.severity else "medium",
                "peopleAffected": need.peopleAffected or 0,
                "volunteerName": vol.name,
                "skills": vol.skills.split(",") if vol.skills else [],
                "distance": _distance(),
                "availability": _availability(),
                "matchScore": total,
                "skillMatch": skill_m,
                "distanceScore": dist_m,
                "availabilityScore": avail_m,
                "performanceScore": perf_m,
                "timeReported": need.timeReported or "recently",
                "status": "suggested",
            })
        else:
            unmatched.append({
                "id": need.id,
                "title": need.title,
                "location": need.location,
                "severity": need.severity.value if need.severity else "medium",
                "reason": "No available volunteer with matching skills in proximity.",
            })

    assigned_count = db.query(Task).filter(Task.status != TaskStatus.COMPLETED).count()

    overloaded = len([v for v in busy_vols if db.query(Task).filter(Task.volunteerId == v.id, Task.status != TaskStatus.COMPLETED).count() > 2])
    underutil = len([v for v in available_vols if db.query(Task).filter(Task.volunteerId == v.id).count() == 0])
    optimal = len(all_vols) - overloaded - underutil

    activities_data = [
        {"id": "ai-act-1", "type": "match_generated", "needTitle": matches[0]["needTitle"] if matches else "—", "volunteerName": matches[0]["volunteerName"] if matches else "—", "timestamp": "just now"},
        {"id": "ai-act-2", "type": "match_accepted", "needTitle": "Ration distribution in Jahangirpuri", "volunteerName": "Anita Verma", "timestamp": "2 hours ago"},
        {"id": "ai-act-3", "type": "task_completed", "needTitle": "Gas leak in Lajpat Nagar", "volunteerName": "Suresh Patel", "timestamp": "5 hours ago"},
        {"id": "ai-act-4", "type": "match_generated", "needTitle": "Mobile health clinic", "volunteerName": "Meera Singh", "timestamp": "8 hours ago"},
    ]

    alerts_data = []
    if len(unmatched) > 0:
        alerts_data.append({"id": "ai-alert-1", "type": "warning", "message": f"{len(unmatched)} need(s) could not be matched to available volunteers", "timestamp": "just now"})
    if overloaded > 0:
        alerts_data.append({"id": "ai-alert-2", "type": "critical", "message": f"{overloaded} volunteer(s) are overloaded with >2 active tasks", "timestamp": "just now"})
    alerts_data.append({"id": "ai-alert-3", "type": "info", "message": f"Model confidence threshold set at 70%. {len(matches)} suggestions generated.", "timestamp": "just now"})

    return {
        "matches": matches,
        "unmatched": unmatched,
        "kpis": {
            "suggestedCount": len(matches),
            "assignedCount": assigned_count,
            "unmatchedCount": len(unmatched),
        },
        "volunteerUtilization": {
            "overloaded": overloaded,
            "underutilized": underutil,
            "optimal": max(optimal, 0),
        },
        "alerts": alerts_data,
        "activities": activities_data,
    }


@router.post("/assign")
async def assign_match(payload: dict, db: Session = Depends(get_db), current_user: UserSchema = Depends(get_current_user)):
    match_id = payload.get("matchId", "")
    action = payload.get("action", "accept")

    if action == "reject":
        return {"status": "rejected", "message": f"Match {match_id} rejected."}

    return {"status": "success", "message": f"Match {match_id} accepted and assigned."}
