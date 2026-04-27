from pydantic import BaseModel, EmailStr
from typing import Optional, List
from .models import UserRole, NeedSeverity, NeedStatus, VolunteerStatus, TaskStatus

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None

class CommunityNeedBase(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    lat: float
    lng: float
    severity: NeedSeverity
    status: NeedStatus
    priority: int
    issueType: str
    peopleAffected: int
    timeReported: str
    location: str

class CommunityNeedResponse(CommunityNeedBase):
    class Config:
        from_attributes = True

class VolunteerBase(BaseModel):
    id: str
    name: str
    initials: str
    lat: float
    lng: float
    status: VolunteerStatus
    skills: List[str]
    rating: float
    completedTasks: int
    region: str
    responseTime: str

class VolunteerResponse(VolunteerBase):
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    id: str
    needId: str
    volunteerId: str
    status: TaskStatus
    assignedAt: str
    eta: Optional[str] = None

class TaskResponse(TaskBase):
    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    id: str
    type: str
    message: str
    location: str
    time: str
    needId: Optional[str] = None

class AlertResponse(AlertBase):
    class Config:
        from_attributes = True

class ActivityBase(BaseModel):
    id: str
    kind: str
    text: str
    time: str

class ActivityResponse(ActivityBase):
    class Config:
        from_attributes = True
