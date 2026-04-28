import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from jose import JWTError, jwt
from ..database import get_db
from ..models import User, UserRole, Volunteer, VolunteerStatus
from ..schemas import Token, TokenData
from ..core.security import verify_password, create_access_token, get_password_hash, ALGORITHM, SECRET_KEY

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# ── Pydantic models for signup ──
class UserSignup(BaseModel):
    email: str
    password: str
    full_name: str

class VolunteerSignup(BaseModel):
    email: str
    password: str
    full_name: str
    skills: str = ""
    region: str = ""
    lat: float = 28.6139
    lng: float = 77.2090

# ── Dependency: get current user from JWT ──
async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# ── Login ──
@router.post("/login")
def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Check if volunteer is approved
    if user.role == UserRole.VOLUNTEER and not user.is_approved:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your volunteer account is pending approval by a coordinator.",
        )

    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.full_name or user.email.split("@")[0],
            "role": user.role.value
        }
    }

# ── Get current user profile ──
@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.full_name or current_user.email.split("@")[0],
        "role": current_user.role.value,
        "is_active": current_user.is_active,
        "is_approved": current_user.is_approved
    }

# ── User Signup (instant access) ──
@router.post("/signup/user")
def signup_user(payload: UserSignup, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        role=UserRole.USER,
        full_name=payload.full_name,
        is_approved=True  # Users get instant access
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email, "role": new_user.role.value})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": new_user.id, "email": new_user.email, "name": new_user.full_name, "role": new_user.role.value}
    }

# ── Volunteer Signup (pending coordinator approval) ──
@router.post("/signup/volunteer")
def signup_volunteer(payload: VolunteerSignup, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        role=UserRole.VOLUNTEER,
        full_name=payload.full_name,
        is_approved=False  # Needs coordinator approval
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create volunteer profile
    initials = "".join([w[0].upper() for w in payload.full_name.split()[:2]]) if payload.full_name else "V"
    vol = Volunteer(
        id=f"vol-{new_user.id}",
        user_id=new_user.id,
        name=payload.full_name,
        initials=initials,
        lat=payload.lat, lng=payload.lng,
        status=VolunteerStatus.OFFLINE,
        skills=payload.skills,
        rating=0.0, completedTasks=0,
        region=payload.region,
        responseTime="N/A"
    )
    db.add(vol)
    db.commit()

    return {"message": "Volunteer registration submitted. Please wait for coordinator approval.", "status": "pending"}

# ── Coordinator: List pending volunteers ──
@router.get("/pending-volunteers")
def list_pending_volunteers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.COORDINATOR:
        raise HTTPException(status_code=403, detail="Only coordinators can view pending volunteers")

    from sqlalchemy.orm import joinedload
    pending = (
        db.query(User)
        .options(joinedload(User.volunteer_profile))
        .filter(User.role == UserRole.VOLUNTEER, User.is_approved == False)
        .all()
    )
    return [{
        "id": u.id, "email": u.email, "name": u.full_name,
        "skills": u.volunteer_profile.skills if u.volunteer_profile else "",
        "region": u.volunteer_profile.region if u.volunteer_profile else "",
        "created_at": str(u.created_at) if u.created_at else "",
    } for u in pending]

# ── Coordinator: Approve a volunteer ──
@router.post("/approve-volunteer/{user_id}")
def approve_volunteer(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.COORDINATOR:
        raise HTTPException(status_code=403, detail="Only coordinators can approve volunteers")

    user = db.query(User).filter(User.id == user_id, User.role == UserRole.VOLUNTEER).first()
    if not user:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    user.is_approved = True
    vol = db.query(Volunteer).filter(Volunteer.user_id == user.id).first()
    if vol:
        vol.status = VolunteerStatus.AVAILABLE

    db.commit()
    return {"message": f"Volunteer {user.full_name} approved successfully"}

# ── Coordinator: Reject a volunteer ──
@router.delete("/reject-volunteer/{user_id}")
def reject_volunteer(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.COORDINATOR:
        raise HTTPException(status_code=403, detail="Only coordinators can reject volunteers")

    user = db.query(User).filter(User.id == user_id, User.role == UserRole.VOLUNTEER, User.is_approved == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    vol = db.query(Volunteer).filter(Volunteer.user_id == user.id).first()
    if vol:
        db.delete(vol)
    db.delete(user)
    db.commit()
    return {"message": "Volunteer registration rejected"}
