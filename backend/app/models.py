import enum
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class UserRole(str, enum.Enum):
    USER = "USER"
    VOLUNTEER = "VOLUNTEER"
    COORDINATOR = "COORDINATOR"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, default="")
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    is_approved = Column(Boolean, default=True)  # Volunteers start as False until coordinator approves
    created_at = Column(DateTime, default=datetime.utcnow)

    volunteer_profile = relationship("Volunteer", back_populates="user", uselist=False)


class NeedSeverity(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    RESOLVED = "resolved"

class NeedStatus(str, enum.Enum):
    UNASSIGNED = "unassigned"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in-progress"
    RESOLVED = "resolved"

class CommunityNeed(Base):
    __tablename__ = "needs"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    lat = Column(Float)
    lng = Column(Float)
    severity = Column(Enum(NeedSeverity))
    status = Column(Enum(NeedStatus), default=NeedStatus.UNASSIGNED)
    priority = Column(Integer, default=3)
    issueType = Column(String)
    peopleAffected = Column(Integer, default=1)
    timeReported = Column(String, default="just now")
    location = Column(String)
    reported_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("User", foreign_keys=[reported_by])
    tasks = relationship("Task", back_populates="need")

class VolunteerStatus(str, enum.Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    OFFLINE = "offline"

class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String)
    initials = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    status = Column(Enum(VolunteerStatus), default=VolunteerStatus.OFFLINE)
    skills = Column(String)  # Stored as comma-separated string
    rating = Column(Float, default=0.0)
    completedTasks = Column(Integer, default=0)
    region = Column(String)
    responseTime = Column(String)

    user = relationship("User", back_populates="volunteer_profile")
    tasks = relationship("Task", back_populates="volunteer")

class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    DELAYED = "delayed"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    needId = Column(String, ForeignKey("needs.id"))
    volunteerId = Column(String, ForeignKey("volunteers.id"))
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)
    assignedAt = Column(String)
    eta = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    need = relationship("CommunityNeed", back_populates="tasks")
    volunteer = relationship("Volunteer", back_populates="tasks")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    type = Column(String)  # 'info', 'warning', 'critical'
    message = Column(String)
    location = Column(String, default="")
    time = Column(String)
    needId = Column(String, ForeignKey("needs.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True, index=True)
    kind = Column(String)  # 'success', 'alert', 'user'
    text = Column(String)
    time = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    date = Column(String)
    time = Column(String, default="10:00 AM")
    location = Column(String)
    lat = Column(Float, default=28.6139)
    lng = Column(Float, default=77.2090)
    category = Column(String, default="general")  # cleanup, awareness, distribution, training
    spots = Column(Integer, default=50)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    registrations = relationship("EventRegistration", back_populates="event")


class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(String, primary_key=True, index=True)
    event_id = Column(String, ForeignKey("events.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    registered_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="registrations")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    type = Column(String, default="info")  # info, success, warning, task, event
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
