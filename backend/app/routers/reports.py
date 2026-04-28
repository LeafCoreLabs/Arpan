from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from ..database import get_db
from ..models import CommunityNeed, Volunteer, Task, NeedStatus, TaskStatus
from ..schemas import UserResponse
from ..core.cache import cache_get, cache_set
from .auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/summary")
async def get_report_summary(db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    cached = cache_get("reports:summary")
    if cached:
        return cached

    row = db.query(
        func.count(CommunityNeed.id).label("total"),
        func.count(case((CommunityNeed.status == NeedStatus.RESOLVED, 1))).label("resolved"),
    ).one()
    total_volunteers = db.query(Volunteer).count()
    active_tasks = db.query(Task).filter(Task.status != TaskStatus.COMPLETED).count()

    needs_by_type = db.query(CommunityNeed.issueType, func.count(CommunityNeed.id)).group_by(CommunityNeed.issueType).all()
    type_distribution = {t: c for t, c in needs_by_type}

    result = {
        "stats": [
            {"label": "Total Incidents", "value": row.total, "trend": "+12%"},
            {"label": "Resolved Needs", "value": row.resolved, "trend": "+5%"},
            {"label": "Active Volunteers", "value": total_volunteers, "trend": "+2"},
            {"label": "Pending Tasks", "value": active_tasks, "trend": "-3%"},
        ],
        "typeDistribution": type_distribution,
    }
    cache_set("reports:summary", result, ttl=300)
    return result
