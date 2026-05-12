import os
import json
import logging
from urllib import request, error
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, CommunityNeed, Volunteer, Task, TaskStatus, NeedStatus
from .auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def _get_context(db: Session, user: User):
    """Build a concise context string about the system state."""
    total_needs = db.query(CommunityNeed).count()
    unassigned = db.query(CommunityNeed).filter(CommunityNeed.status == NeedStatus.UNASSIGNED).count()
    resolved = db.query(CommunityNeed).filter(CommunityNeed.status == NeedStatus.RESOLVED).count()
    total_vols = db.query(Volunteer).count()
    pending_tasks = db.query(Task).filter(Task.status == TaskStatus.PENDING).count()
    active_tasks = db.query(Task).filter(Task.status == TaskStatus.IN_PROGRESS).count()

    return (
        f"Platform: Arpan (NGO disaster response). "
        f"Stats: {total_needs} total needs ({unassigned} unassigned, {resolved} resolved), "
        f"{total_vols} volunteers, {pending_tasks} pending tasks, {active_tasks} active tasks. "
        f"User role: {user.role.value if user.role else 'unknown'}, name: {user.full_name or user.email}."
    )


@router.post("")
async def chat(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    message = payload.get("message", "").strip()
    if not message:
        return {"reply": "Please type a message."}

    context = _get_context(db, current_user)
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        return _local_reply(message, context)

    system_prompt = (
        "You are Arpan AI Assistant — a helpful, concise chatbot for the Arpan NGO platform. "
        "You help coordinators, volunteers, and community users with quick questions about tasks, needs, events, and platform features. "
        "Keep answers brief (2-3 sentences max). Be friendly and helpful. "
        f"Current system context: {context}"
    )

    body = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        "temperature": 0.7,
        "max_tokens": 300,
    }

    try:
        req = request.Request(
            GROQ_URL,
            data=json.dumps(body).encode("utf-8"),
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
            method="POST",
        )
        with request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        reply = data["choices"][0]["message"]["content"]
        return {"reply": reply, "source": "groq"}
    except Exception as e:
        logger.warning("Chatbot Groq call failed: %s", e)
        return _local_reply(message, context)


def _local_reply(message: str, context: str):
    msg_lower = message.lower()
    if any(w in msg_lower for w in ["task", "assignment", "assigned"]):
        return {"reply": "You can view your tasks in the Tasks tab. Pending tasks need your attention — check the dashboard for details.", "source": "local"}
    if any(w in msg_lower for w in ["need", "report", "community"]):
        return {"reply": "Community needs are tracked in the Needs section. Critical needs are prioritized and assigned to volunteers via AI matching.", "source": "local"}
    if any(w in msg_lower for w in ["event", "volunteer", "join"]):
        return {"reply": "Check the Events tab for upcoming community events. You can register directly from the event card.", "source": "local"}
    if any(w in msg_lower for w in ["help", "how", "what"]):
        return {"reply": f"I'm the Arpan AI assistant. {context} How can I help you today?", "source": "local"}
    return {"reply": f"I'm here to help with tasks, needs, events, and platform questions. {context}", "source": "local"}
