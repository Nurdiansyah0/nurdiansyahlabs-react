from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import Config
from app.core.database import db
from app.modules.leads.models import Lead
from app.modules.auth.decorators import admin_required

leads_bp = Blueprint("leads", __name__, url_prefix="/api/v1/leads")

def send_lead_email(name, contact, service, message):
    if not Config.SMTP_USER or not Config.SMTP_PASS:
        return False, "SMTP not configured"
    try:
        msg = MIMEMultipart()
        msg['From'] = Config.SMTP_USER
        msg['To'] = Config.SMTP_USER
        msg['Subject'] = f"🚀 Inbound Inquiry: {name} ({service or 'General'})"

        body = f"""
        Halo Admin, ada prospek baru yang menghubungi via website NurdiansyahLabs:
        
        • Nama: {name}
        • Kontak: {contact}
        • Layanan: {service}
        • Pesan:
        {message}
        
        Waktu: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(Config.SMTP_HOST, Config.SMTP_PORT, timeout=10)
        server.starttls()
        server.login(Config.SMTP_USER, Config.SMTP_PASS)
        server.send_message(msg)
        server.quit()
        return True, "Email sent"
    except Exception as e:
        return False, str(e)

@leads_bp.route("", methods=["POST"])
def submit_lead():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    contact = data.get("contact", "").strip()
    service = data.get("service", "").strip()
    message = data.get("message", "").strip()

    if not name or not contact:
        return jsonify({
            "success": False,
            "error": {"code": "VALIDATION_ERROR", "message": "Name and contact are required"}
        }), 400

    lead = Lead(
        name=name,
        contact=contact,
        service=service,
        message=message,
        timestamp=datetime.now(timezone.utc)
    )
    db.session.add(lead)
    db.session.commit()

    # Attempt email sending in background/safely without breaking response
    email_sent, email_msg = send_lead_email(name, contact, service, message)

    return jsonify({
        "success": True,
        "message": "Terima kasih! Pesan Anda telah kami terima.",
        "data": lead.to_dict()
    }), 201

@leads_bp.route("", methods=["GET"])
@admin_required
def get_leads():
    leads = db.session.scalars(db.select(Lead).order_by(Lead.timestamp.desc())).all()
    return jsonify({
        "success": True,
        "leads": [l.to_dict() for l in leads]
    })

@leads_bp.route("/<int:lead_id>", methods=["DELETE"])
@admin_required
def delete_lead(lead_id):
    lead = db.session.get(Lead, lead_id)
    if not lead:
        return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Lead not found"}}), 404
    db.session.delete(lead)
    db.session.commit()
    return jsonify({"success": True, "message": "Lead deleted successfully"})
