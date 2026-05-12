"""
Automated escalation: check for critical/high needs unresolved beyond threshold hours.
Run this on each dashboard/needs fetch or as a periodic check.
"""
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models import CommunityNeed, NeedSeverity, NeedStatus, Notification, User, UserRole

logger = logging.getLogger(__name__)

ESCALATION_HOURS = {"critical": 4, "high": 8}


def check_and_escalate(db: Session):
    """Check unresolved critical/high needs and escalate if overdue."""
    now = datetime.utcnow()
    escalated_count = 0

    for severity_val, hours in ESCALATION_HOURS.items():
        threshold = now - timedelta(hours=hours)
        severity_enum = NeedSeverity.CRITICAL if severity_val == "critical" else NeedSeverity.HIGH

        overdue_needs = (
            db.query(CommunityNeed)
            .filter(
                CommunityNeed.severity == severity_enum,
                CommunityNeed.status.in_([NeedStatus.UNASSIGNED, NeedStatus.ASSIGNED]),
                CommunityNeed.created_at < threshold,
            )
            .all()
        )

        for need in overdue_needs:
            existing = (
                db.query(Notification)
                .filter(
                    Notification.title.contains("Escalation"),
                    Notification.message.contains(need.id),
                )
                .first()
            )
            if existing:
                continue

            hours_open = int((now - need.created_at).total_seconds() / 3600) if need.created_at else hours

            coordinators = db.query(User).filter(User.role == UserRole.COORDINATOR).all()
            for coord in coordinators:
                notif_id = f"esc-{need.id}-{coord.id}"
                db.add(Notification(
                    id=notif_id,
                    user_id=coord.id,
                    title=f"⚠️ Escalation: {need.title}",
                    message=f"Need '{need.id}' ({severity_val}) at {need.location or 'unknown'} unresolved for {hours_open}h. Immediate action required.",
                    type="warning",
                ))
                escalated_count += 1

            if need.priority and need.priority < 5:
                need.priority = min(need.priority + 1, 5)

    if escalated_count > 0:
        db.commit()
        logger.info("Escalated %d notifications for overdue needs", escalated_count)

    return escalated_count
