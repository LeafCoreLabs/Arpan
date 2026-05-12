"""
WebSocket endpoint for real-time notifications.
Clients connect with their auth token; server pushes events.
"""
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import jwt, JWTError
import os

logger = logging.getLogger(__name__)
router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-me-in-production")
ALGORITHM = "HS256"


class ConnectionManager:
    def __init__(self):
        self.active: dict[int, list[WebSocket]] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active:
            self.active[user_id] = []
        self.active[user_id].append(websocket)
        logger.info("WS connected: user %d (total: %d)", user_id, sum(len(v) for v in self.active.values()))

    def disconnect(self, user_id: int, websocket: WebSocket):
        if user_id in self.active:
            self.active[user_id] = [ws for ws in self.active[user_id] if ws != websocket]
            if not self.active[user_id]:
                del self.active[user_id]

    async def send_to_user(self, user_id: int, data: dict):
        if user_id in self.active:
            dead = []
            for ws in self.active[user_id]:
                try:
                    await ws.send_json(data)
                except Exception:
                    dead.append(ws)
            for ws in dead:
                self.active[user_id].remove(ws)

    async def broadcast(self, data: dict):
        for user_id in list(self.active.keys()):
            await self.send_to_user(user_id, data)


manager = ConnectionManager()


def _verify_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        return int(user_id) if user_id else None
    except (JWTError, ValueError, TypeError):
        return None


@router.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket, token: str = Query(default="")):
    user_id = _verify_token(token)
    if not user_id:
        await websocket.close(code=4001)
        return

    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
    except Exception:
        manager.disconnect(user_id, websocket)
