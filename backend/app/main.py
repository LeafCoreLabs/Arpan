import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .routers import auth, dashboard, needs, map, volunteers, tasks, ai, notifications, reports, events, profile
from .database import SessionLocal
from .models import User, CommunityNeed, Volunteer

app = FastAPI(title="Arpan Backend API", version="1.0.0", redirect_slashes=False)

# Setup CORS for the frontend
cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]
cors_origin_regex = os.getenv(
    "CORS_ORIGIN_REGEX",
    r"https://.*\.vercel\.app|http://localhost:5173|http://127\.0\.0\.1:5173",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(needs.router, prefix="/api/needs", tags=["needs"])
app.include_router(map.router, prefix="/api/map", tags=["map"])
app.include_router(volunteers.router, prefix="/api/volunteers", tags=["volunteers"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(ai.router)
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(reports.router)
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])

@app.get("/")
def read_root():
    return {"message": "Arpan API is running"}

@app.get("/health")
def health_check():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "database": "connected",
            "users": db.query(User).count(),
            "needs": db.query(CommunityNeed).count(),
            "volunteers": db.query(Volunteer).count(),
        }
    finally:
        db.close()
