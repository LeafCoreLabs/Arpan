from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import CommunityNeed, Volunteer, Task, Activity, Alert, NeedSeverity, NeedStatus, TaskStatus, VolunteerStatus, User
from .auth import get_current_user

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Real metrics from database
    volunteers_count = db.query(Volunteer).count()
    active_volunteers = db.query(Volunteer).filter(Volunteer.status == VolunteerStatus.AVAILABLE).count()
    total_needs = db.query(CommunityNeed).count()
    urgent_count = db.query(CommunityNeed).filter(CommunityNeed.severity == NeedSeverity.CRITICAL).count()
    resolved_count = db.query(CommunityNeed).filter(CommunityNeed.status == NeedStatus.RESOLVED).count()
    active_tasks = db.query(Task).filter(Task.status != TaskStatus.COMPLETED).count()

    metrics = [
        {
            "id": "m-1",
            "label": "Active Volunteers",
            "value": active_volunteers,
            "sublabel": f"{volunteers_count} total registered",
            "trendPositive": True,
            "tone": "success"
        },
        {
            "id": "m-2",
            "label": "Community Needs",
            "value": total_needs,
            "sublabel": f"{resolved_count} resolved",
            "trendPositive": resolved_count > 0,
            "tone": "default"
        },
        {
            "id": "m-3",
            "label": "Urgent Cases",
            "value": urgent_count,
            "sublabel": f"{urgent_count} need attention" if urgent_count > 0 else "All clear",
            "trendPositive": urgent_count == 0,
            "tone": "danger" if urgent_count > 0 else "success"
        },
        {
            "id": "m-4",
            "label": "Active Tasks",
            "value": active_tasks,
            "sublabel": f"{db.query(Task).filter(Task.status == TaskStatus.COMPLETED).count()} completed",
            "trendPositive": True,
            "tone": "success"
        }
    ]

    # 2. AI Match (dynamic — best available volunteer)
    best_vol = db.query(Volunteer).filter(Volunteer.status == VolunteerStatus.AVAILABLE).order_by(Volunteer.rating.desc()).first()
    aiMatch = None
    if best_vol:
        aiMatch = {
            "name": best_vol.name,
            "match": min(best_vol.rating / 5.0, 1.0) if best_vol.rating else 0.5,
            "subtitle": f"{best_vol.status.value} • {best_vol.region}",
            "skills": best_vol.skills.split(",") if best_vol.skills else [],
        }

    # 3. Live activities (last 10)
    activities = db.query(Activity).order_by(Activity.created_at.desc()).limit(10).all()
    liveActivity = [{"id": a.id, "kind": a.kind, "text": a.text, "time": a.time} for a in activities]

    # 4. Needs snapshot (latest 5)
    latest_needs = db.query(CommunityNeed).order_by(CommunityNeed.created_at.desc()).limit(5).all()
    needsSnapshot = []
    for n in latest_needs:
        # Find assigned volunteer if any
        task = db.query(Task).filter(Task.needId == n.id).first()
        assigned = task.volunteer.name if task and task.volunteer else "Unassigned"
        needsSnapshot.append({
            "id": n.id,
            "location": n.location,
            "issueType": n.issueType,
            "severity": n.severity.value if n.severity else "medium",
            "status": n.status.value if n.status else "unassigned",
            "assignedTo": assigned
        })

    return {
        "metrics": metrics,
        "aiMatch": aiMatch,
        "liveActivity": liveActivity,
        "needsSnapshot": needsSnapshot
    }
