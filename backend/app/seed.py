from .database import SessionLocal, engine, Base
from .models import (
    User, Volunteer, CommunityNeed, Task, Alert, Activity, Event, Notification,
    UserRole, VolunteerStatus, NeedSeverity, NeedStatus, TaskStatus
)
from .core.security import get_password_hash

Base.metadata.create_all(bind=engine)


VOLUNTEERS_DATA = [
    {"email": "volunteer@arpan.org", "password": "volunteer123", "name": "Ravi Kumar", "initials": "RK", "skills": "first-aid,logistics,communication", "region": "Central Delhi", "lat": 28.6139, "lng": 77.2090, "rating": 4.5, "completed": 12, "response": "15min"},
    {"email": "anita.v@arpan.org", "password": "volunteer123", "name": "Anita Verma", "initials": "AV", "skills": "medical,counseling,translation", "region": "South Delhi", "lat": 28.5245, "lng": 77.2066, "rating": 4.8, "completed": 18, "response": "10min"},
    {"email": "suresh.p@arpan.org", "password": "volunteer123", "name": "Suresh Patel", "initials": "SP", "skills": "construction,logistics,driving", "region": "East Delhi", "lat": 28.6280, "lng": 77.2950, "rating": 4.2, "completed": 8, "response": "20min"},
    {"email": "meera.s@arpan.org", "password": "volunteer123", "name": "Meera Singh", "initials": "MS", "skills": "education,child-care,first-aid", "region": "Noida", "lat": 28.5355, "lng": 77.3910, "rating": 4.6, "completed": 15, "response": "12min"},
    {"email": "deepak.j@arpan.org", "password": "volunteer123", "name": "Deepak Joshi", "initials": "DJ", "skills": "tech,communication,survey", "region": "Gurgaon", "lat": 28.4595, "lng": 77.0266, "rating": 3.9, "completed": 5, "response": "25min"},
]

NEEDS_DATA = [
    {"title": "Water shortage in Block A", "desc": "Residents report no water supply for 2 days", "location": "Block A, Sector 12, Noida", "lat": 28.5925, "lng": 77.3340, "severity": "critical", "type": "water", "people": 350, "status": "assigned", "time": "2 hours ago"},
    {"title": "Medical supplies needed at Shelter B", "desc": "Shelter running low on bandages and medicines", "location": "Shelter B, Yamuna Ghat, Delhi", "lat": 28.6469, "lng": 77.2425, "severity": "high", "type": "medical", "people": 120, "status": "in-progress", "time": "4 hours ago"},
    {"title": "Flooding near Yamuna Ghat", "desc": "Water level rising, 50 families at risk", "location": "Yamuna Ghat, East Delhi", "lat": 28.6350, "lng": 77.2700, "severity": "critical", "type": "safety", "people": 200, "status": "assigned", "time": "5 hours ago"},
    {"title": "Sanitation issue in Dwarka Sector 7", "desc": "Open drainage causing health risks", "location": "Sector 7, Dwarka, Delhi", "lat": 28.5822, "lng": 77.0637, "severity": "high", "type": "sanitation", "people": 180, "status": "unassigned", "time": "6 hours ago"},
    {"title": "Food shortage at Community Kitchen", "desc": "Daily meals for 300 people at risk", "location": "Community Hall, Connaught Place", "lat": 28.6315, "lng": 77.2167, "severity": "high", "type": "food", "people": 300, "status": "unassigned", "time": "8 hours ago"},
    {"title": "Shelter collapse risk in Okhla", "desc": "Temporary shelter showing structural cracks", "location": "Okhla Industrial Area, Delhi", "lat": 28.5308, "lng": 77.2710, "severity": "critical", "type": "shelter", "people": 75, "status": "unassigned", "time": "10 hours ago"},
    {"title": "Children need school supplies", "desc": "40 children in camp without books or pens", "location": "Relief Camp, Laxmi Nagar", "lat": 28.6304, "lng": 77.2770, "severity": "medium", "type": "education", "people": 40, "status": "unassigned", "time": "12 hours ago"},
    {"title": "Elderly care required in Rohini", "desc": "5 elderly residents need regular medical checkups", "location": "Rohini Sector 3, Delhi", "lat": 28.7155, "lng": 77.1174, "severity": "medium", "type": "medical", "people": 5, "status": "unassigned", "time": "1 day ago"},
    {"title": "Broken water pump in Trilokpuri", "desc": "Community hand-pump broken, 200 people affected", "location": "Trilokpuri Block 32, Delhi", "lat": 28.6100, "lng": 77.3100, "severity": "high", "type": "water", "people": 200, "status": "assigned", "time": "1 day ago"},
    {"title": "Street lighting failure in Saket", "desc": "Dark roads causing safety concerns for women", "location": "Saket, South Delhi", "lat": 28.5234, "lng": 77.2172, "severity": "medium", "type": "safety", "people": 500, "status": "unassigned", "time": "1 day ago"},
    {"title": "Mosquito menace in Mayur Vihar", "desc": "Standing water breeding mosquitoes, dengue risk", "location": "Mayur Vihar Phase 1, Delhi", "lat": 28.5937, "lng": 77.2990, "severity": "high", "type": "sanitation", "people": 400, "status": "resolved", "time": "2 days ago"},
    {"title": "Ration distribution needed in Jahangirpuri", "desc": "150 families without monthly ration", "location": "Jahangirpuri, North Delhi", "lat": 28.7286, "lng": 77.1700, "severity": "medium", "type": "food", "people": 600, "status": "resolved", "time": "3 days ago"},
    {"title": "Mobile health clinic request", "desc": "Remote area needs vaccination and basic checkups", "location": "Bhalswa Village, Delhi", "lat": 28.7400, "lng": 77.1600, "severity": "low", "type": "medical", "people": 250, "status": "resolved", "time": "4 days ago"},
    {"title": "Playground repair in Vasant Kunj", "desc": "Broken swings and slides, unsafe for children", "location": "Vasant Kunj C Block, Delhi", "lat": 28.5198, "lng": 77.1592, "severity": "low", "type": "general", "people": 100, "status": "resolved", "time": "5 days ago"},
    {"title": "Gas leak reported near Lajpat Nagar", "desc": "Faint gas smell from underground pipeline", "location": "Lajpat Nagar Market, Delhi", "lat": 28.5689, "lng": 77.2410, "severity": "critical", "type": "safety", "people": 1000, "status": "resolved", "time": "1 week ago"},
]

ALERTS_DATA = [
    {"type": "critical", "msg": "Flash flood warning for East Delhi — Yamuna levels rising", "loc": "East Delhi", "time": "30 min ago", "need_idx": 2},
    {"type": "critical", "msg": "Medical emergency: Shelter B supplies critically low", "loc": "Yamuna Ghat", "time": "1 hour ago", "need_idx": 1},
    {"type": "warning", "msg": "Water shortage affecting 350 residents in Sector 12", "loc": "Noida", "time": "2 hours ago", "need_idx": 0},
    {"type": "warning", "msg": "Structural assessment needed for Okhla shelter", "loc": "Okhla", "time": "3 hours ago", "need_idx": 5},
    {"type": "info", "msg": "Volunteer Anita Verma dispatched to Shelter B", "loc": "Yamuna Ghat", "time": "4 hours ago", "need_idx": 1},
    {"type": "info", "msg": "Food donation received — 500 meals for distribution", "loc": "Connaught Place", "time": "5 hours ago", "need_idx": None},
    {"type": "warning", "msg": "Sanitation complaints rising in Dwarka Sector 7", "loc": "Dwarka", "time": "6 hours ago", "need_idx": 3},
    {"type": "info", "msg": "New volunteer Deepak Joshi completed onboarding", "loc": "Gurgaon", "time": "8 hours ago", "need_idx": None},
    {"type": "critical", "msg": "Gas leak contained — area cleared for return", "loc": "Lajpat Nagar", "time": "12 hours ago", "need_idx": 14},
    {"type": "info", "msg": "Monthly report generated — 85% resolution rate", "loc": "", "time": "1 day ago", "need_idx": None},
]

ACTIVITIES_DATA = [
    {"kind": "success", "text": "Water tanker dispatched to Block A, Sector 12 — relief for 350 residents", "time": "30 min ago"},
    {"kind": "alert", "text": "CRITICAL: Yamuna water level crossed danger mark near Ghat", "time": "1 hour ago"},
    {"kind": "success", "text": "Anita Verma delivered medical supplies to Shelter B", "time": "2 hours ago"},
    {"kind": "user", "text": "Priya Sharma reported: Sanitation issue in Dwarka Sector 7", "time": "3 hours ago"},
    {"kind": "success", "text": "Ravi Kumar assigned to water shortage in Block A", "time": "4 hours ago"},
    {"kind": "user", "text": "Community member reported: Food shortage at Connaught Place kitchen", "time": "5 hours ago"},
    {"kind": "alert", "text": "Shelter collapse risk identified in Okhla — assessment team needed", "time": "6 hours ago"},
    {"kind": "success", "text": "Mosquito fogging completed in Mayur Vihar Phase 1", "time": "8 hours ago"},
    {"kind": "user", "text": "New volunteer Deepak Joshi registered from Gurgaon", "time": "10 hours ago"},
    {"kind": "success", "text": "Ration packets distributed to 150 families in Jahangirpuri", "time": "12 hours ago"},
    {"kind": "success", "text": "Mobile health clinic served 250 people at Bhalswa Village", "time": "1 day ago"},
    {"kind": "user", "text": "25 volunteers registered for Community Cleanup Drive", "time": "2 days ago"},
    {"kind": "success", "text": "Gas leak in Lajpat Nagar contained — all clear issued", "time": "3 days ago"},
    {"kind": "alert", "text": "Weekly alert: 5 unresolved critical needs pending", "time": "4 days ago"},
    {"kind": "success", "text": "Playground repairs completed in Vasant Kunj", "time": "5 days ago"},
]


def seed_data():
    db = SessionLocal()
    try:
        sev_map = {"critical": NeedSeverity.CRITICAL, "high": NeedSeverity.HIGH, "medium": NeedSeverity.MEDIUM, "low": NeedSeverity.LOW}
        stat_map = {"unassigned": NeedStatus.UNASSIGNED, "assigned": NeedStatus.ASSIGNED, "in-progress": NeedStatus.IN_PROGRESS, "resolved": NeedStatus.RESOLVED}
        prio_map = {"critical": 5, "high": 4, "medium": 3, "low": 2}

        # ── Coordinator ──
        admin = db.query(User).filter(User.email == "admin@arpan.org").first()
        if not admin:
            admin = User(email="admin@arpan.org", hashed_password=get_password_hash("admin123"), role=UserRole.COORDINATOR, full_name="Arpan Admin")
            db.add(admin); db.commit(); db.refresh(admin)
            print("  Coordinator: admin@arpan.org / admin123")

        # ── Community User ──
        community_user = db.query(User).filter(User.email == "user@arpan.org").first()
        if not community_user:
            community_user = User(email="user@arpan.org", hashed_password=get_password_hash("user123"), role=UserRole.USER, full_name="Priya Sharma")
            db.add(community_user); db.commit(); db.refresh(community_user)
            print("  User: user@arpan.org / user123")

        # ── Volunteers (5) ──
        vol_objects = []
        for vd in VOLUNTEERS_DATA:
            u = db.query(User).filter(User.email == vd["email"]).first()
            if not u:
                u = User(email=vd["email"], hashed_password=get_password_hash(vd["password"]), role=UserRole.VOLUNTEER, full_name=vd["name"])
                db.add(u); db.commit(); db.refresh(u)
            vol = db.query(Volunteer).filter(Volunteer.user_id == u.id).first()
            if not vol:
                vol = Volunteer(
                    id=f"vol-{u.id}", user_id=u.id, name=vd["name"], initials=vd["initials"],
                    lat=vd["lat"], lng=vd["lng"], status=VolunteerStatus.AVAILABLE,
                    skills=vd["skills"], rating=vd["rating"], completedTasks=vd["completed"],
                    region=vd["region"], responseTime=vd["response"]
                )
                db.add(vol); db.commit(); db.refresh(vol)
            vol_objects.append(vol)
        print(f"  {len(vol_objects)} volunteers ready")

        # ── Community Needs (15) ──
        need_objects = []
        if db.query(CommunityNeed).count() < 10:
            # Clear existing sparse data
            db.query(CommunityNeed).delete(); db.commit()
            reporter_id = community_user.id if community_user else None
            for i, nd in enumerate(NEEDS_DATA):
                need = CommunityNeed(
                    id=f"n-{i+1:03d}", title=nd["title"], description=nd["desc"],
                    lat=nd["lat"], lng=nd["lng"],
                    severity=sev_map.get(nd["severity"], NeedSeverity.MEDIUM),
                    status=stat_map.get(nd["status"], NeedStatus.UNASSIGNED),
                    priority=prio_map.get(nd["severity"], 3),
                    issueType=nd["type"], peopleAffected=nd["people"],
                    timeReported=nd["time"], location=nd["location"],
                    reported_by=reporter_id if i % 3 == 0 else None
                )
                db.add(need); need_objects.append(need)
            db.commit()
            print(f"  {len(need_objects)} community needs seeded")
        else:
            need_objects = db.query(CommunityNeed).all()

        # ── Tasks (assigned/in-progress needs get tasks) ──
        if db.query(Task).count() < 3:
            db.query(Task).delete(); db.commit()
            assignments = [
                (0, 0, TaskStatus.IN_PROGRESS),   # need 0 -> vol 0
                (1, 1, TaskStatus.IN_PROGRESS),   # need 1 -> vol 1
                (2, 2, TaskStatus.PENDING),        # need 2 -> vol 2
                (8, 3, TaskStatus.PENDING),        # need 8 -> vol 3
                (10, 0, TaskStatus.COMPLETED),     # need 10 (resolved) -> vol 0
                (11, 1, TaskStatus.COMPLETED),     # need 11 (resolved) -> vol 1
                (12, 3, TaskStatus.COMPLETED),     # need 12 (resolved) -> vol 3
                (14, 2, TaskStatus.COMPLETED),     # need 14 (resolved) -> vol 2
            ]
            for ni, vi, status in assignments:
                if ni < len(need_objects) and vi < len(vol_objects):
                    t = Task(
                        id=f"t-{ni+1:03d}", needId=need_objects[ni].id,
                        volunteerId=vol_objects[vi].id, status=status,
                        assignedAt=need_objects[ni].timeReported, eta="~30 min" if status != TaskStatus.COMPLETED else "Done"
                    )
                    db.add(t)
            # Mark assigned volunteers as busy
            for vi in [0, 1, 2, 3]:
                if vi < len(vol_objects):
                    has_active = any(a[1] == vi and a[2] != TaskStatus.COMPLETED for a in assignments)
                    vol_objects[vi].status = VolunteerStatus.BUSY if has_active else VolunteerStatus.AVAILABLE
            db.commit()
            print("  8 tasks seeded")

        # ── Alerts ──
        if db.query(Alert).count() < 5:
            db.query(Alert).delete(); db.commit()
            for i, ad in enumerate(ALERTS_DATA):
                need_id = need_objects[ad["need_idx"]].id if ad["need_idx"] is not None and ad["need_idx"] < len(need_objects) else None
                db.add(Alert(id=f"a-{i+1:03d}", type=ad["type"], message=ad["msg"], location=ad["loc"], time=ad["time"], needId=need_id))
            db.commit()
            print("  10 alerts seeded")

        # ── Activities ──
        if db.query(Activity).count() < 10:
            db.query(Activity).delete(); db.commit()
            for i, ad in enumerate(ACTIVITIES_DATA):
                db.add(Activity(id=f"act-{i+1:03d}", kind=ad["kind"], text=ad["text"], time=ad["time"]))
            db.commit()
            print("  15 activities seeded")

        # ── Events ──
        if db.query(Event).count() < 5:
            db.query(Event).delete(); db.commit()
            events = [
                Event(id="evt-001", title="Community Cleanup Drive", description="Join us for a neighborhood cleanup in Connaught Place. Gloves and bags provided.", date="2026-05-10", time="9:00 AM", location="Connaught Place, Delhi", category="cleanup", spots=30),
                Event(id="evt-002", title="First Aid Training Workshop", description="Learn essential first aid skills from certified trainers. Certificates provided.", date="2026-05-15", time="2:00 PM", location="Community Hall, Sector 12, Noida", category="training", spots=25),
                Event(id="evt-003", title="Food Distribution Drive", description="Help distribute meals to underserved communities near Yamuna banks.", date="2026-05-20", time="7:00 AM", location="Yamuna Ghat, Delhi", category="distribution", spots=40),
                Event(id="evt-004", title="Disaster Preparedness Seminar", description="Interactive session on earthquake and flood preparedness for communities.", date="2026-05-25", time="11:00 AM", location="Town Hall, Gurgaon", category="awareness", spots=60),
                Event(id="evt-005", title="Blood Donation Camp", description="Annual blood donation camp. All blood groups needed.", date="2026-06-01", time="10:00 AM", location="AIIMS, Delhi", category="medical", spots=100),
            ]
            db.add_all(events); db.commit()
            print("  5 events seeded")

        # ── Notifications ──
        all_vols = db.query(User).filter(User.role == UserRole.VOLUNTEER).all()
        for vu in all_vols:
            if not db.query(Notification).filter(Notification.user_id == vu.id).first():
                db.add_all([
                    Notification(id=f"notif-{vu.id}-1", user_id=vu.id, title="Welcome to Arpan!", message="Your volunteer account is active. You can now receive task assignments.", type="success"),
                    Notification(id=f"notif-{vu.id}-2", user_id=vu.id, title="New Event Available", message="Community Cleanup Drive on May 10. Register now!", type="event"),
                    Notification(id=f"notif-{vu.id}-3", user_id=vu.id, title="Task Update", message="Check your tasks dashboard for new assignments.", type="info"),
                ])
        if community_user and not db.query(Notification).filter(Notification.user_id == community_user.id).first():
            db.add_all([
                Notification(id=f"notif-cu-1", user_id=community_user.id, title="Welcome to Arpan!", message="Thank you for joining. Report needs and track their resolution.", type="success"),
                Notification(id=f"notif-cu-2", user_id=community_user.id, title="Need Resolved!", message="Water shortage in Block A is being addressed. Thank you for reporting!", type="success"),
                Notification(id=f"notif-cu-3", user_id=community_user.id, title="Community Update", message="5 needs were resolved in your area this week.", type="info"),
            ])
        db.commit()
        print("  Notifications seeded")

        print("\n  Seed complete. Login credentials:")
        print("    Coordinator:  admin@arpan.org / admin123")
        print("    Volunteer:    volunteer@arpan.org / volunteer123")
        print("    Community:    user@arpan.org / user123")

    except Exception as e:
        db.rollback()
        print(f"  Seed error: {e}")
        import traceback; traceback.print_exc()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
