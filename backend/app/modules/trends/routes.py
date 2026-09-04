import os
import json
from flask import Blueprint, request, jsonify
from app.core.config import Config
from app.modules.auth.decorators import admin_required

trends_bp = Blueprint("trends", __name__, url_prefix="/api/v1/trends")

@trends_bp.route("", methods=["GET"])
def get_trends():
    cache_path = "/home/uygpuazs/public_html/api/cache/trends.json"
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return jsonify(data)
        except Exception:
            pass

    return jsonify({
        "success": True,
        "topics": [
            {"title": "Pengembangan Web AI Batam", "traffic": "High", "service": "Web Development"},
            {"title": "Jasa Pembuatan Software ERP Kepri", "traffic": "Rising", "service": "Software Development"}
        ]
    })

@trends_bp.route("/auto_post", methods=["GET", "POST"])
def auto_post():
    auth_header = request.headers.get("X-Cron-Key") or request.args.get("key")
    if auth_header != Config.CRON_API_KEY:
        return jsonify({"success": False, "error": {"code": "UNAUTHORIZED", "message": "Invalid cron key"}}), 401

    geo = request.args.get("geo", "ID")
    return jsonify({
        "success": True,
        "message": f"Trend automated generation queued for geo={geo}",
        "status": "queued"
    })
