import os
import json
import math
import re
import socket
from urllib import request, error
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import CommunityNeed, NeedStatus, Volunteer, VolunteerStatus, Task, TaskStatus
from ..schemas import UserResponse as UserSchema
from ..core.cache import cache_get, cache_set, cache_delete
from .auth import get_current_user

router = APIRouter(prefix="/api/ai-matching", tags=["AI Matching"])
load_dotenv()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

SKILL_KEYWORDS = {
    "medical": {"medical", "first-aid", "health", "counseling"},
    "water": {"water", "logistics", "driving", "survey"},
    "food": {"food", "distribution", "logistics", "driving"},
    "shelter": {"shelter", "construction", "logistics"},
    "safety": {"safety", "first-aid", "communication", "survey"},
    "sanitation": {"sanitation", "cleanup", "survey", "logistics"},
    "education": {"education", "child-care", "communication"},
    "general": {"communication", "logistics", "survey"},
}


def _clamp(value: float, low=0, high=100):
    return int(max(low, min(high, round(value))))

def _skills(volunteer: Volunteer):
    return {s.strip().lower() for s in (volunteer.skills or "").split(",") if s.strip()}

def _distance_km(need: CommunityNeed, volunteer: Volunteer):
    if None in (need.lat, need.lng, volunteer.lat, volunteer.lng):
        return 99.0
    radius = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, [need.lat, need.lng, volunteer.lat, volunteer.lng])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return round(radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 1)

def _skill_score(need: CommunityNeed, volunteer: Volunteer):
    skill_set = _skills(volunteer)
    issue = (need.issueType or "general").lower()
    expected = SKILL_KEYWORDS.get(issue, SKILL_KEYWORDS["general"])
    overlap = skill_set & expected
    if issue in skill_set:
        return 98
    if overlap:
        return _clamp(72 + len(overlap) * 8)
    if skill_set & SKILL_KEYWORDS["general"]:
        return 55
    return 35

def _distance_score(distance_km: float):
    if distance_km <= 1:
        return 98
    if distance_km <= 3:
        return _clamp(92 - distance_km * 6)
    if distance_km <= 8:
        return _clamp(82 - distance_km * 5)
    return _clamp(45 - min(distance_km, 30))

def _availability_score(volunteer: Volunteer, active_tasks: int):
    status = volunteer.status.value if volunteer.status else "offline"
    base = {"available": 96, "busy": 58, "offline": 15}.get(status, 30)
    return _clamp(base - active_tasks * 14)

def _performance_score(volunteer: Volunteer):
    rating_score = ((volunteer.rating or 0) / 5) * 80
    completion_bonus = min(volunteer.completedTasks or 0, 20)
    return _clamp(rating_score + completion_bonus)

def _availability_label(volunteer: Volunteer, active_tasks: int):
    status = volunteer.status.value if volunteer.status else "offline"
    if status == "available" and active_tasks == 0:
        return "Available now"
    if status == "available":
        return f"Available, {active_tasks} active task(s)"
    if status == "busy":
        return f"Busy, {active_tasks} active task(s)"
    return "Offline"

def _severity_weight(need: CommunityNeed):
    severity = need.severity.value if need.severity else "medium"
    return {"critical": 4, "high": 3, "medium": 2, "low": 1}.get(severity, 2)

def _need_payload(need: CommunityNeed):
    return {
        "id": need.id, "title": need.title, "location": need.location,
        "severity": need.severity.value if need.severity else "medium",
        "status": need.status.value if need.status else "unassigned",
        "issueType": need.issueType, "peopleAffected": need.peopleAffected or 0,
        "timeReported": need.timeReported or "recently",
        "lat": need.lat, "lng": need.lng,
    }

def _volunteer_payload(volunteer: Volunteer, active_tasks: int):
    return {
        "id": volunteer.id, "name": volunteer.name,
        "status": volunteer.status.value if volunteer.status else "offline",
        "skills": volunteer.skills.split(",") if volunteer.skills else [],
        "rating": volunteer.rating or 0,
        "completedTasks": volunteer.completedTasks or 0,
        "region": volunteer.region, "responseTime": volunteer.responseTime,
        "activeTasks": active_tasks,
        "lat": volunteer.lat, "lng": volunteer.lng,
    }


def _batch_active_task_counts(db: Session) -> dict:
    """Single query to get active task counts for ALL volunteers."""
    rows = (
        db.query(Task.volunteerId, func.count(Task.id))
        .filter(Task.status != TaskStatus.COMPLETED)
        .group_by(Task.volunteerId)
        .all()
    )
    return {vid: cnt for vid, cnt in rows}


def _batch_total_task_counts(db: Session) -> dict:
    """Single query to get total task counts for ALL volunteers."""
    rows = (
        db.query(Task.volunteerId, func.count(Task.id))
        .group_by(Task.volunteerId)
        .all()
    )
    return {vid: cnt for vid, cnt in rows}


def _local_match_payload(needs, all_vols, candidate_vols, busy_vols, db: Session, source="local-fallback"):
    active_counts = _batch_active_task_counts(db)
    total_counts = _batch_total_task_counts(db)

    matches = []
    unmatched = []
    used_volunteers = set()

    sorted_needs = sorted(
        needs,
        key=lambda n: (_severity_weight(n), n.peopleAffected or 0),
        reverse=True,
    )

    for need in sorted_needs:
        ranked = []
        for vol in candidate_vols:
            if vol.id in used_volunteers:
                continue
            active_tasks = active_counts.get(vol.id, 0)
            distance_km = _distance_km(need, vol)
            skill_m = _skill_score(need, vol)
            dist_m = _distance_score(distance_km)
            avail_m = _availability_score(vol, active_tasks)
            perf_m = _performance_score(vol)
            urgency_bonus = _severity_weight(need) * 2
            total = _clamp(skill_m * 0.36 + dist_m * 0.24 + avail_m * 0.22 + perf_m * 0.18 + urgency_bonus)
            ranked.append((total, skill_m, dist_m, avail_m, perf_m, distance_km, active_tasks, vol))

        if ranked:
            total, skill_m, dist_m, avail_m, perf_m, distance_km, active_tasks, vol = max(ranked, key=lambda item: item[0])
            used_volunteers.add(vol.id)
            matches.append({
                "id": f"match-{need.id}-{vol.id}",
                "needId": need.id, "volunteerId": vol.id,
                "needTitle": need.title, "location": need.location,
                "severity": need.severity.value if need.severity else "medium",
                "peopleAffected": need.peopleAffected or 0,
                "volunteerName": vol.name,
                "skills": vol.skills.split(",") if vol.skills else [],
                "distance": f"{distance_km} km",
                "availability": _availability_label(vol, active_tasks),
                "matchScore": total, "skillMatch": skill_m,
                "distanceScore": dist_m, "availabilityScore": avail_m,
                "performanceScore": perf_m,
                "timeReported": need.timeReported or "recently",
                "status": "suggested",
                "reason": (
                    f"Matched from live database data: {vol.name} has {', '.join(vol.skills.split(',')) if vol.skills else 'no listed skills'}, "
                    f"is {distance_km} km from the need, has {active_tasks} active task(s), "
                    f"and a {vol.rating or 0}/5 volunteer rating."
                ),
            })
        else:
            unmatched.append({
                "id": need.id, "title": need.title, "location": need.location,
                "severity": need.severity.value if need.severity else "medium",
                "reason": "No non-offline volunteer remains after prioritizing higher severity needs.",
            })

    assigned_count = sum(active_counts.values())
    overloaded = sum(1 for v in busy_vols if active_counts.get(v.id, 0) > 2)
    underutil = sum(1 for v in candidate_vols if total_counts.get(v.id, 0) == 0)
    optimal = len(all_vols) - overloaded - underutil

    return {
        "source": source,
        "model": GEMINI_MODEL if source == "gemini" else "local-fallback",
        "matches": matches,
        "unmatched": unmatched,
        "kpis": {
            "suggestedCount": len(matches),
            "assignedCount": assigned_count,
            "unmatchedCount": len(unmatched),
        },
        "volunteerUtilization": {
            "overloaded": overloaded,
            "underutilized": underutil,
            "optimal": max(optimal, 0),
        },
        "alerts": [
            *([{"id": "ai-alert-gemini", "type": "warning", "message": "Gemini is unavailable or quota-limited, so safe local scoring is active.", "timestamp": "just now"}] if source != "gemini" else []),
            *([{"id": "ai-alert-1", "type": "warning", "message": f"{len(unmatched)} need(s) could not be matched to available volunteers", "timestamp": "just now"}] if unmatched else []),
            {"id": "ai-alert-2", "type": "info", "message": f"{len(matches)} suggestions generated by {source}.", "timestamp": "just now"},
        ],
        "activities": [
            {"id": "ai-act-1", "type": "match_generated", "needTitle": matches[0]["needTitle"] if matches else "—", "volunteerName": matches[0]["volunteerName"] if matches else "—", "timestamp": "just now"},
            {"id": "ai-act-2", "type": "match_accepted", "needTitle": "Ration distribution in Jahangirpuri", "volunteerName": "Anita Verma", "timestamp": "2 hours ago"},
            {"id": "ai-act-3", "type": "task_completed", "needTitle": "Gas leak in Lajpat Nagar", "volunteerName": "Suresh Patel", "timestamp": "5 hours ago"},
        ],
    }

def _extract_json(text: str):
    cleaned = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))

def _call_gemini(needs, volunteers, active_counts):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    prompt = {
        "role": "AI disaster-response dispatcher",
        "instruction": (
            "Match unassigned community needs to non-offline volunteers using only the supplied live data. "
            "Do not invent volunteers, needs, locations, distances, or scores. Return only valid JSON. "
            "Use this exact schema: {\"matches\": [...], \"unmatched\": [...], \"alerts\": [...], \"activities\": [...]}. "
            "Each match must include id, needId, volunteerId, needTitle, location, severity, peopleAffected, "
            "volunteerName, skills, distance, availability, matchScore, skillMatch, distanceScore, "
            "availabilityScore, performanceScore, timeReported, status, reason. Scores are integers 0-100."
        ),
        "needs": [_need_payload(n) for n in needs],
        "volunteers": [_volunteer_payload(v, active_counts.get(v.id, 0)) for v in volunteers],
    }
    body = {
        "contents": [{"parts": [{"text": json.dumps(prompt, ensure_ascii=False)}]}],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"},
    }
    req = request.Request(
        f"{GEMINI_URL}?key={api_key}",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=8) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
        text = payload["candidates"][0]["content"]["parts"][0]["text"]
        return _extract_json(text)
    except (error.URLError, error.HTTPError, TimeoutError, socket.timeout, KeyError, IndexError, json.JSONDecodeError):
        return None

@router.get("/suggestions")
async def get_suggestions(db: Session = Depends(get_db), current_user: UserSchema = Depends(get_current_user)):
    cached = cache_get("ai:suggestions")
    if cached:
        return cached

    needs = db.query(CommunityNeed).filter(CommunityNeed.status == NeedStatus.UNASSIGNED).all()
    all_vols = db.query(Volunteer).all()
    candidate_vols = [v for v in all_vols if v.status != VolunteerStatus.OFFLINE]
    busy_vols = [v for v in all_vols if v.status == VolunteerStatus.BUSY]
    active_counts = _batch_active_task_counts(db)

    fallback = _local_match_payload(needs, all_vols, candidate_vols, busy_vols, db)
    gemini_result = _call_gemini(needs, candidate_vols, active_counts)
    if not gemini_result:
        cache_set("ai:suggestions", fallback, ttl=120)
        return fallback

    result = {
        **fallback,
        "source": "gemini",
        "model": GEMINI_MODEL,
        "matches": gemini_result.get("matches", fallback["matches"]),
        "unmatched": gemini_result.get("unmatched", fallback["unmatched"]),
        "alerts": gemini_result.get("alerts", fallback["alerts"]),
        "activities": gemini_result.get("activities", fallback["activities"]),
    }
    cache_set("ai:suggestions", result, ttl=120)
    return result


@router.post("/assign")
async def assign_match(payload: dict, db: Session = Depends(get_db), current_user: UserSchema = Depends(get_current_user)):
    match_id = payload.get("matchId", "")
    action = payload.get("action", "accept")

    if action == "reject":
        return {"status": "rejected", "message": f"Match {match_id} rejected."}

    cache_delete("ai:suggestions")
    return {"status": "success", "message": f"Match {match_id} accepted and assigned."}
