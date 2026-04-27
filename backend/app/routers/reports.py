from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import CommunityNeed, Volunteer, Task, NeedStatus, TaskStatus
from ..schemas import UserResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/summary")
async def get_report_summary(db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    total_needs = db.query(CommunityNeed).count()
    resolved_needs = db.query(CommunityNeed).filter(CommunityNeed.status == NeedStatus.RESOLVED).count()
    total_volunteers = db.query(Volunteer).count()
    active_tasks = db.query(Task).filter(Task.status != TaskStatus.COMPLETED).count()
    
    # Needs by type
    needs_by_type = db.query(CommunityNeed.issueType, func.count(CommunityNeed.id)).group_by(CommunityNeed.issueType).all()
    type_distribution = {t: c for t, c in needs_by_type}

    return {
        "stats": [
            {"label": "Total Incidents", "value": total_needs, "trend": "+12%"},
            {"label": "Resolved Needs", "value": resolved_needs, "trend": "+5%"},
            {"label": "Active Volunteers", "value": total_volunteers, "trend": "+2"},
            {"label": "Pending Tasks", "value": active_tasks, "trend": "-3%"}
        ],
        "typeDistribution": type_distribution
    }
