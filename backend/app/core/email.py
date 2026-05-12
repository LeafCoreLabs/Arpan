"""
Email notification service using SMTP (works with Resend, Gmail, or any SMTP provider).
Falls back gracefully if SMTP is not configured.
"""
import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@arpan.org")
FROM_NAME = os.getenv("FROM_NAME", "Arpan Platform")


def _is_configured() -> bool:
    return bool(SMTP_HOST and SMTP_USER and SMTP_PASS)


def send_email(to: str, subject: str, html_body: str, text_body: Optional[str] = None) -> bool:
    if not _is_configured():
        logger.debug("SMTP not configured, skipping email to %s", to)
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
    msg["To"] = to

    if text_body:
        msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        logger.info("Email sent to %s: %s", to, subject)
        return True
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to, e)
        return False


def send_task_assigned_email(volunteer_email: str, volunteer_name: str, need_title: str, location: str):
    subject = f"[Arpan] New Task Assigned: {need_title}"
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:2rem;">
      <h2 style="color:#6366f1;">New Task Assigned</h2>
      <p>Hi <strong>{volunteer_name}</strong>,</p>
      <p>You've been assigned to a new task:</p>
      <div style="background:#f1f5f9;padding:1rem;border-radius:8px;margin:1rem 0;">
        <p style="margin:0;font-weight:600;">{need_title}</p>
        <p style="margin:0.25rem 0 0;color:#64748b;font-size:0.9rem;">📍 {location}</p>
      </div>
      <p>Please log in to your Arpan dashboard to view details and take action.</p>
      <p style="color:#94a3b8;font-size:0.8rem;">— Arpan Platform</p>
    </div>
    """
    send_email(volunteer_email, subject, html)


def send_need_resolved_email(user_email: str, user_name: str, need_title: str):
    subject = f"[Arpan] Need Resolved: {need_title}"
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:2rem;">
      <h2 style="color:#10b981;">Need Resolved ✓</h2>
      <p>Hi <strong>{user_name}</strong>,</p>
      <p>A community need you reported has been resolved:</p>
      <div style="background:#f0fdf4;padding:1rem;border-radius:8px;margin:1rem 0;">
        <p style="margin:0;font-weight:600;">{need_title}</p>
      </div>
      <p>Thank you for helping improve your community!</p>
      <p style="color:#94a3b8;font-size:0.8rem;">— Arpan Platform</p>
    </div>
    """
    send_email(user_email, subject, html)


def send_escalation_email(coordinator_email: str, need_title: str, location: str, hours_open: int):
    subject = f"[Arpan] ⚠️ Escalation: {need_title} unresolved for {hours_open}h"
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:2rem;">
      <h2 style="color:#ef4444;">⚠️ Need Escalated</h2>
      <p>A critical need has been unresolved for <strong>{hours_open} hours</strong>:</p>
      <div style="background:#fef2f2;padding:1rem;border-radius:8px;margin:1rem 0;">
        <p style="margin:0;font-weight:600;">{need_title}</p>
        <p style="margin:0.25rem 0 0;color:#64748b;font-size:0.9rem;">📍 {location}</p>
      </div>
      <p>Please take immediate action in the coordinator dashboard.</p>
      <p style="color:#94a3b8;font-size:0.8rem;">— Arpan Platform (Auto-Escalation)</p>
    </div>
    """
    send_email(coordinator_email, subject, html)
