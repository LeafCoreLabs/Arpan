from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, case
from ..database import get_db
from ..models import CommunityNeed, Volunteer, Task, Activity, Alert, NeedSeverity, NeedStatus, TaskStatus, VolunteerStatus, User
from ..core.cache import cache_get, cache_set
from ..core.escalation import check_and_escalate
from .auth import get_current_user

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_and_escalate(db)

    cached = cache_get("dashboard:summary")
    if cached:
        return cached

    row = db.query(
        func.count(Volunteer.id).label("vol_total"),
        func.count(case((Volunteer.status == VolunteerStatus.AVAILABLE, 1))).label("vol_active"),
    ).one()
    volunteers_count = row.vol_total
    active_volunteers = row.vol_active

    nrow = db.query(
        func.count(CommunityNeed.id).label("total"),
        func.count(case((CommunityNeed.severity == NeedSeverity.CRITICAL, 1))).label("urgent"),
        func.count(case((CommunityNeed.status == NeedStatus.RESOLVED, 1))).label("resolved"),
    ).one()
    total_needs, urgent_count, resolved_count = nrow.total, nrow.urgent, nrow.resolved

    trow = db.query(
        func.count(Task.id).label("total"),
        func.count(case((Task.status != TaskStatus.COMPLETED, 1))).label("active"),
        func.count(case((Task.status == TaskStatus.COMPLETED, 1))).label("completed"),
    ).one()
    active_tasks, completed_tasks = trow.active, trow.completed

    metrics = [
        {"id": "m-1", "label": "Active Volunteers", "value": active_volunteers, "sublabel": f"{volunteers_count} total registered", "trendPositive": True, "tone": "success"},
        {"id": "m-2", "label": "Community Needs", "value": total_needs, "sublabel": f"{resolved_count} resolved", "trendPositive": resolved_count > 0, "tone": "default"},
        {"id": "m-3", "label": "Urgent Cases", "value": urgent_count, "sublabel": f"{urgent_count} need attention" if urgent_count > 0 else "All clear", "trendPositive": urgent_count == 0, "tone": "danger" if urgent_count > 0 else "success"},
        {"id": "m-4", "label": "Active Tasks", "value": active_tasks, "sublabel": f"{completed_tasks} completed", "trendPositive": True, "tone": "success"},
    ]

    best_vol = db.query(Volunteer).filter(Volunteer.status == VolunteerStatus.AVAILABLE).order_by(Volunteer.rating.desc()).first()
    aiMatch = None
    if best_vol:
        aiMatch = {
            "name": best_vol.name,
            "match": min(best_vol.rating / 5.0, 1.0) if best_vol.rating else 0.5,
            "subtitle": f"{best_vol.status.value} • {best_vol.region}",
            "skills": best_vol.skills.split(",") if best_vol.skills else [],
        }

    activities = db.query(Activity).order_by(Activity.created_at.desc()).limit(10).all()
    liveActivity = [{"id": a.id, "kind": a.kind, "text": a.text, "time": a.time} for a in activities]

    latest_needs = (
        db.query(CommunityNeed)
        .options(joinedload(CommunityNeed.tasks).joinedload(Task.volunteer))
        .order_by(CommunityNeed.created_at.desc())
        .limit(5)
        .all()
    )
    needsSnapshot = []
    for n in latest_needs:
        assigned = "Unassigned"
        if n.tasks:
            for t in n.tasks:
                if t.volunteer:
                    assigned = t.volunteer.name
                    break
        needsSnapshot.append({
            "id": n.id, "location": n.location, "issueType": n.issueType,
            "severity": n.severity.value if n.severity else "medium",
            "status": n.status.value if n.status else "unassigned",
            "assignedTo": assigned,
        })

    result = {"metrics": metrics, "aiMatch": aiMatch, "liveActivity": liveActivity, "needsSnapshot": needsSnapshot}
    cache_set("dashboard:summary", result, ttl=30)
    return result


@router.post("/escalation-check")
def run_escalation_check(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    count = check_and_escalate(db)
    return {"escalated": count, "message": f"{count} need(s) escalated"}
