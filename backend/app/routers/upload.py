import os
import uuid
import base64
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, CommunityNeed
from .auth import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/need-image/{need_id}")
async def upload_need_image(
    need_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    need = db.query(CommunityNeed).filter(CommunityNeed.id == need_id).first()
    if not need:
        raise HTTPException(status_code=404, detail="Need not found")

    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WebP images allowed")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="Image too large (max 5MB)")

    ext = file.content_type.split("/")[-1].replace("jpeg", "jpg")
    filename = f"{need_id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    image_url = f"/api/upload/files/{filename}"
    need.image_url = image_url
    db.commit()

    return {"imageUrl": image_url, "message": "Image uploaded successfully"}


@router.post("/need-image-base64/{need_id}")
async def upload_need_image_base64(
    payload: dict,
    need_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    need = db.query(CommunityNeed).filter(CommunityNeed.id == need_id).first()
    if not need:
        raise HTTPException(status_code=404, detail="Need not found")

    data_url = payload.get("image", "")
    if not data_url.startswith("data:image/"):
        raise HTTPException(status_code=400, detail="Invalid image data")

    header, b64data = data_url.split(",", 1)
    ext = header.split("/")[1].split(";")[0].replace("jpeg", "jpg")
    contents = base64.b64decode(b64data)

    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="Image too large (max 5MB)")

    filename = f"{need_id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    image_url = f"/api/upload/files/{filename}"
    need.image_url = image_url
    db.commit()

    return {"imageUrl": image_url, "message": "Image uploaded successfully"}


@router.get("/files/{filename}")
async def serve_file(filename: str):
    from fastapi.responses import FileResponse
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath)
