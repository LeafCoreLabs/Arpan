import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, dashboard, needs, map, volunteers, tasks, ai, notifications, reports, events, profile

app = FastAPI(title="Arpan Backend API", version="1.0.0")

# Setup CORS for the frontend
cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
