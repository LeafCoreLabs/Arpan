from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Volunteer, Task, TaskStatus, User
from ..core.cache import cache_get, cache_set
from .auth import get_current_user

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

BADGE_DEFINITIONS = [
    {"id": "first-task", "name": "First Responder", "icon": "🚀", "desc": "Completed first task", "threshold": 1},
    {"id": "five-tasks", "name": "Helping Hand", "icon": "🤝", "desc": "Completed 5 tasks", "threshold": 5},
    {"id": "ten-tasks", "name": "Community Champion", "icon": "🏆", "desc": "Completed 10 tasks", "threshold": 10},
    {"id": "twenty-tasks", "name": "Aid Hero", "icon": "⭐", "desc": "Completed 20 tasks", "threshold": 20},
    {"id": "high-rated", "name": "Top Performer", "icon": "💎", "desc": "Rating above 4.5", "threshold": None},
    {"id": "speed-demon", "name": "Speed Demon", "icon": "⚡", "desc": "Response time under 15min", "threshold": None},
]


def _get_badges(volunteer):
    badges = []
    completed = volunteer.completedTasks or 0
    rating = volunteer.rating or 0
    response_time = volunteer.responseTime or "30min"

    for b in BADGE_DEFINITIONS:
        if b["id"] == "high-rated" and rating >= 4.5:
            badges.append(b)
        elif b["id"] == "speed-demon" and int(response_time.replace("min", "").strip()) <= 15:
            badges.append(b)
        elif b["threshold"] and completed >= b["threshold"]:
            badges.append(b)
    return badges


@router.get("")
def get_leaderboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cached = cache_get("leaderboard:all")
    if cached:
        return cached

    volunteers = db.query(Volunteer).order_by(
        Volunteer.completedTasks.desc(),
        Volunteer.rating.desc()
    ).all()

    completed_counts = dict(
        db.query(Task.volunteerId, func.count(Task.id))
        .filter(Task.status == TaskStatus.COMPLETED)
        .group_by(Task.volunteerId)
        .all()
    )

    leaderboard = []
    for rank, vol in enumerate(volunteers, 1):
        badges = _get_badges(vol)
        score = (vol.completedTasks or 0) * 10 + (vol.rating or 0) * 20
        leaderboard.append({
            "rank": rank,
            "id": vol.id,
            "name": vol.name,
            "initials": vol.initials or vol.name[:2].upper(),
            "region": vol.region,
            "completedTasks": vol.completedTasks or 0,
            "rating": vol.rating or 0,
            "responseTime": vol.responseTime,
            "score": round(score),
            "badges": badges,
            "dbCompletedTasks": completed_counts.get(vol.id, 0),
        })

    result = {
        "leaderboard": leaderboard,
        "badgeDefinitions": BADGE_DEFINITIONS,
        "totalVolunteers": len(volunteers),
    }
    cache_set("leaderboard:all", result, ttl=120)
    return result
