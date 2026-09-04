from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from sqlalchemy import func
from app.core.database import db
from app.modules.analytics.models import AnalyticsEvent
from app.modules.auth.decorators import admin_required

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/v1/analytics")

@analytics_bp.route("/track", methods=["POST"])
def track_event():
    data = request.get_json(silent=True) or {}
    visitor_id = data.get("visitorId") or data.get("visitor_id") or "anonymous"
    event_type = data.get("type", "pageview")

    event = AnalyticsEvent(
        type=event_type,
        path=data.get("path"),
        visitorId=visitor_id,
        timestamp=datetime.now(timezone.utc),
        title=data.get("title"),
        service=data.get("service"),
        duration=data.get("duration"),
        route=data.get("route"),
        userAgent=request.headers.get("User-Agent")
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({"success": True, "id": event.id}), 201

@analytics_bp.route("", methods=["GET"])
@admin_required
def get_analytics_summary():
    total_events = db.session.scalar(db.select(func.count(AnalyticsEvent.id))) or 0
    unique_visitors = db.session.scalar(db.select(func.count(func.distinct(AnalyticsEvent.visitorId)))) or 0
    
    # Top paths
    top_paths = db.session.execute(
        db.select(AnalyticsEvent.path, func.count(AnalyticsEvent.id).label("count"))
        .where(AnalyticsEvent.path.isnot(None))
        .group_by(AnalyticsEvent.path)
        .order_by(func.count(AnalyticsEvent.id).desc())
        .limit(10)
    ).all()

    # Recent events
    recent = db.session.scalars(
        db.select(AnalyticsEvent).order_by(AnalyticsEvent.timestamp.desc()).limit(100)
    ).all()

    return jsonify({
        "success": True,
        "metrics": {
            "total_events": total_events,
            "unique_visitors": unique_visitors,
            "top_paths": [{"path": r[0], "count": r[1]} for r in top_paths]
        },
        "recent_events": [e.to_dict() for e in recent]
    })
