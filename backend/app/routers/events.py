import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import Event, EventRegistration, User, UserRole, Notification
from ..core.cache import cache_get, cache_set, cache_delete
from .auth import get_current_user

router = APIRouter()

class EventCreate(BaseModel):
    title: str
    description: str = ""
    date: str
    time: str = "10:00 AM"
    location: str
    lat: float = 28.6139
    lng: float = 77.2090
    category: str = "general"
    spots: int = 50

@router.get("")
def list_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cache_key = f"events:all:{current_user.id}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    reg_counts = dict(
        db.query(EventRegistration.event_id, func.count(EventRegistration.id))
        .group_by(EventRegistration.event_id)
        .all()
    )
    my_regs = set(
        r[0] for r in db.query(EventRegistration.event_id)
        .filter(EventRegistration.user_id == current_user.id)
        .all()
    )

    events = db.query(Event).order_by(Event.created_at.desc()).all()
    result = [{
        "id": e.id, "title": e.title, "description": e.description,
        "date": e.date, "time": e.time, "location": e.location,
        "lat": e.lat, "lng": e.lng, "category": e.category,
        "spots": e.spots, "registeredCount": reg_counts.get(e.id, 0),
        "isRegistered": e.id in my_regs,
        "createdAt": str(e.created_at) if e.created_at else "",
    } for e in events]
    cache_set(cache_key, result, ttl=120)
    return result

@router.post("")
def create_event(payload: EventCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.COORDINATOR:
        raise HTTPException(status_code=403, detail="Only coordinators can create events")
    event = Event(
        id=f"evt-{str(uuid.uuid4())[:8]}", title=payload.title, description=payload.description,
        date=payload.date, time=payload.time, location=payload.location,
        lat=payload.lat, lng=payload.lng, category=payload.category,
        spots=payload.spots, created_by=current_user.id,
    )
    db.add(event)
    db.commit()
    cache_delete("events:*")
    return {"message": "Event created", "id": event.id}

@router.post("/{event_id}/register")
def register_for_event(event_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    existing = db.query(EventRegistration).filter(EventRegistration.event_id == event_id, EventRegistration.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered")
    reg_count = db.query(EventRegistration).filter(EventRegistration.event_id == event_id).count()
    if reg_count >= event.spots:
        raise HTTPException(status_code=400, detail="Event is full")
    reg = EventRegistration(id=f"reg-{str(uuid.uuid4())[:8]}", event_id=event_id, user_id=current_user.id)
    db.add(reg)
    notif = Notification(id=f"notif-{str(uuid.uuid4())[:8]}", user_id=current_user.id, title="Event Registration", message=f"You've registered for '{event.title}'", type="event")
    db.add(notif)
    db.commit()
    cache_delete("events:*")
    return {"message": "Registered successfully"}

@router.delete("/{event_id}/unregister")
def unregister_from_event(event_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reg = db.query(EventRegistration).filter(EventRegistration.event_id == event_id, EventRegistration.user_id == current_user.id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    db.delete(reg)
    db.commit()
    cache_delete("events:*")
    return {"message": "Unregistered successfully"}
