import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Alert, Notification, User
from .auth import get_current_user

router = APIRouter()

# ── Legacy alerts (for coordinator dashboard) ──
@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).limit(50).all()
    return [{"id": a.id, "type": a.type, "message": a.message, "location": a.location, "time": a.time} for a in alerts]

# ── User notifications ──
@router.get("")
def get_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notifs = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).limit(50).all()
    return [{
        "id": n.id, "title": n.title, "message": n.message, "type": n.type,
        "isRead": n.is_read, "createdAt": str(n.created_at) if n.created_at else ""
    } for n in notifs]

@router.put("/{notif_id}/read")
def mark_read(notif_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    n = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == current_user.id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"message": "Marked as read"}

@router.post("/{notif_id}/read")
def mark_read_post(notif_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    n = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == current_user.id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"message": "Marked as read"}

@router.put("/read-all")
def mark_all_read(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"message": "All marked as read"}

@router.get("/unread-count")
def unread_count(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    count = db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).count()
    return {"count": count}
