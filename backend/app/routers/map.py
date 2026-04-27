from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CommunityNeed, Volunteer, Task, Alert, User
from .auth import get_current_user

router = APIRouter()

@router.get("/data")
def get_map_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    needs = db.query(CommunityNeed).all()
    volunteers = db.query(Volunteer).all()
    tasks = db.query(Task).all()
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).limit(20).all()

    needs_data = [{
        "id": n.id, "title": n.title, "description": n.description,
        "location": n.location, "lat": n.lat, "lng": n.lng,
        "severity": n.severity.value if n.severity else "medium",
        "peopleAffected": n.peopleAffected,
        "timeReported": n.timeReported, "status": n.status.value if n.status else "unassigned",
        "issueType": n.issueType, "priority": n.priority
    } for n in needs]

    vols_data = [{
        "id": v.id, "name": v.name, "initials": v.initials,
        "lat": v.lat, "lng": v.lng, "status": v.status.value if v.status else "offline",
        "skills": v.skills.split(",") if v.skills else [],
        "rating": v.rating, "completedTasks": v.completedTasks,
        "region": v.region, "responseTime": v.responseTime
    } for v in volunteers]

    tasks_data = [{
        "id": t.id, "title": f"Task {t.id}", "needId": t.needId,
        "volunteerId": t.volunteerId, "status": t.status.value if t.status else "pending",
        "startTime": t.assignedAt, "estimatedCompletion": t.eta,
        "progress": 100 if t.status and t.status.value == "completed" else 50 if t.status and t.status.value == "in-progress" else 0
    } for t in tasks]

    alerts_data = [{
        "id": a.id, "type": a.type, "message": a.message,
        "location": a.location, "time": a.time, "needId": a.needId
    } for a in alerts]

    return {
        "communityNeeds": needs_data,
        "volunteers": vols_data,
        "tasks": tasks_data,
        "alerts": alerts_data,
        "aiSuggestions": []
    }
