import io
import csv
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Volunteer, CommunityNeed, Task, Event
from .auth import get_current_user

router = APIRouter(prefix="/api/export", tags=["export"])


def _csv_response(rows: list[dict], filename: str):
    if not rows:
        rows = [{"message": "No data available"}]
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/volunteers")
def export_volunteers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vols = db.query(Volunteer).all()
    rows = [{
        "ID": v.id, "Name": v.name, "Email": v.email or "",
        "Skills": v.skills, "Region": v.region, "Status": v.status.value if v.status else "",
        "Rating": v.rating, "Completed Tasks": v.completedTasks,
        "Response Time": v.responseTime,
    } for v in vols]
    return _csv_response(rows, "volunteers.csv")


@router.get("/needs")
def export_needs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    needs = db.query(CommunityNeed).all()
    rows = [{
        "ID": n.id, "Title": n.title, "Description": n.description or "",
        "Location": n.location, "Severity": n.severity.value if n.severity else "",
        "Status": n.status.value if n.status else "",
        "Type": n.issueType, "People Affected": n.peopleAffected,
        "Reported": n.timeReported,
    } for n in needs]
    return _csv_response(rows, "community_needs.csv")


@router.get("/tasks")
def export_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks = db.query(Task).all()
    rows = [{
        "ID": t.id, "Need ID": t.needId, "Volunteer ID": t.volunteerId,
        "Status": t.status.value if t.status else "",
        "Assigned At": t.assignedAt, "ETA": t.eta or "",
    } for t in tasks]
    return _csv_response(rows, "tasks.csv")


@router.get("/events")
def export_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    events = db.query(Event).all()
    rows = [{
        "ID": e.id, "Title": e.title, "Date": e.date, "Time": e.time,
        "Location": e.location, "Category": e.category, "Spots": e.spots,
    } for e in events]
    return _csv_response(rows, "events.csv")


@router.get("/report-summary")
def export_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_needs = db.query(CommunityNeed).count()
    resolved = db.query(CommunityNeed).filter(CommunityNeed.status.in_(["resolved", "RESOLVED"])).count()
    total_vols = db.query(Volunteer).count()
    total_tasks = db.query(Task).count()
    rows = [{
        "Metric": "Total Needs", "Value": total_needs,
    }, {
        "Metric": "Resolved Needs", "Value": resolved,
    }, {
        "Metric": "Total Volunteers", "Value": total_vols,
    }, {
        "Metric": "Total Tasks", "Value": total_tasks,
    }, {
        "Metric": "Resolution Rate", "Value": f"{round(resolved/max(total_needs,1)*100, 1)}%",
    }]
    return _csv_response(rows, "report_summary.csv")
