import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import Task, CommunityNeed, Volunteer, NeedStatus, TaskStatus, Activity, User, VolunteerStatus
from .auth import get_current_user

router = APIRouter()

class AssignmentRequest(BaseModel):
    needId: str
    volunteerId: str

class TaskStatusUpdate(BaseModel):
    status: str  # pending, in-progress, completed, delayed

# ── List all tasks ──
@router.get("")
def get_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks = db.query(Task).order_by(Task.created_at.desc()).all()
    return [{
        "id": t.id,
        "needId": t.needId,
        "volunteerId": t.volunteerId,
        "status": t.status.value if t.status else "pending",
        "assignedAt": t.assignedAt,
        "eta": t.eta,
        "needTitle": t.need.title if t.need else "Unknown",
        "volunteerName": t.volunteer.name if t.volunteer else "Unknown"
    } for t in tasks]

# ── Assign a volunteer to a need ──
@router.post("")
def assign_task(assignment: AssignmentRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    need = db.query(CommunityNeed).filter(CommunityNeed.id == assignment.needId).first()
    if not need:
        raise HTTPException(status_code=404, detail="Need not found")

    volunteer = db.query(Volunteer).filter(Volunteer.id == assignment.volunteerId).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    task_id = f"t-{str(uuid.uuid4())[:8]}"
    new_task = Task(
        id=task_id,
        needId=assignment.needId,
        volunteerId=assignment.volunteerId,
        status=TaskStatus.PENDING,
        assignedAt="just now",
        eta="Pending"
    )

    need.status = NeedStatus.ASSIGNED
    volunteer.status = VolunteerStatus.BUSY

    # Log activity
    act_id = f"act-{str(uuid.uuid4())[:8]}"
    db.add(Activity(id=act_id, kind="success", text=f"{volunteer.name} assigned to '{need.title}'", time="just now"))

    db.add(new_task)
    db.commit()

    return {"message": "Task assigned successfully", "taskId": task_id}

# ── Update task status ──
@router.put("/{task_id}/status")
def update_task_status(task_id: str, body: TaskStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    status_map = {"pending": TaskStatus.PENDING, "in-progress": TaskStatus.IN_PROGRESS, "completed": TaskStatus.COMPLETED, "delayed": TaskStatus.DELAYED}
    task.status = status_map.get(body.status, task.status)

    # If completed, update need and volunteer
    if body.status == "completed":
        if task.need:
            task.need.status = NeedStatus.RESOLVED
        if task.volunteer:
            task.volunteer.status = VolunteerStatus.AVAILABLE
            task.volunteer.completedTasks = (task.volunteer.completedTasks or 0) + 1
        act_id = f"act-{str(uuid.uuid4())[:8]}"
        db.add(Activity(id=act_id, kind="success", text=f"Task '{task.need.title if task.need else task_id}' completed!", time="just now"))
    elif body.status == "in-progress":
        if task.need:
            task.need.status = NeedStatus.IN_PROGRESS
        act_id = f"act-{str(uuid.uuid4())[:8]}"
        db.add(Activity(id=act_id, kind="alert", text=f"Task '{task.need.title if task.need else task_id}' is now in progress", time="just now"))

    db.commit()
    return {"message": "Task status updated"}
