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
    total_views = db.session.scalar(
        db.select(func.count(AnalyticsEvent.id)).where(AnalyticsEvent.type == "pageview")
    ) or total_events
    
    # Top paths
    top_paths = db.session.execute(
        db.select(AnalyticsEvent.path, func.count(AnalyticsEvent.id).label("count"))
        .where(AnalyticsEvent.path.isnot(None))
        .group_by(AnalyticsEvent.path)
        .order_by(func.count(AnalyticsEvent.id).desc())
        .limit(10)
    ).all()

    # Timeline (by date)
    timeline = db.session.execute(
        db.select(func.date(AnalyticsEvent.timestamp).label("date"), func.count(AnalyticsEvent.id).label("views"))
        .group_by(func.date(AnalyticsEvent.timestamp))
        .order_by(func.date(AnalyticsEvent.timestamp).asc())
        .limit(14)
    ).all()

    # Top projects / services
    projects = db.session.execute(
        db.select(AnalyticsEvent.title, func.count(AnalyticsEvent.id).label("clicks"))
        .where(AnalyticsEvent.title.isnot(None))
        .group_by(AnalyticsEvent.title)
        .order_by(func.count(AnalyticsEvent.id).desc())
        .limit(5)
    ).all()

    # Recent events
    recent = db.session.scalars(
        db.select(AnalyticsEvent).order_by(AnalyticsEvent.timestamp.desc()).limit(100)
    ).all()

    top_paths_chart = [{"name": r[0], "views": r[1], "path": r[0], "count": r[1]} for r in top_paths]
    timeline_chart = [{"date": str(r[0]), "views": r[1]} for r in timeline]
    projects_chart = [{"name": r[0], "clicks": r[1]} for r in projects]

    return jsonify({
        "success": True,
        "kpis": {
            "totalViews": total_views,
            "uniqueVisitors": unique_visitors,
            "totalEventsLogged": total_events
        },
        "timelineChart": timeline_chart,
        "topPathsChart": top_paths_chart,
        "projectsChart": projects_chart,
        "metrics": {
            "total_events": total_events,
            "unique_visitors": unique_visitors,
            "top_paths": [{"path": r[0], "count": r[1]} for r in top_paths]
        },
        "recent_events": [e.to_dict() for e in recent]
    })
