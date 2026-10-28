import os
import json
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from app.core.config import Config
from app.modules.auth.service import AuthService

trends_bp = Blueprint("trends", __name__, url_prefix="/api/v1/trends")

DEFAULT_TRENDS_BY_CATEGORY = {
    "fullstack": [
        {"keyword": "Jasa Pembuatan Custom ERP Indonesia", "service": "fullstack", "score": 88, "latest": 92, "avg": 74, "trend": 18},
        {"keyword": "Sistem Manajemen Gudang WMS Batam", "service": "fullstack", "score": 82, "latest": 85, "avg": 71, "trend": 14},
    ],
    "landing_page": [
        {"keyword": "Jasa Pembuatan Website Perusahaan B2B", "service": "landing_page", "score": 85, "latest": 89, "avg": 76, "trend": 13},
        {"keyword": "Web Developer Batam & Kepulauan Riau", "service": "landing_page", "score": 79, "latest": 81, "avg": 70, "trend": 11},
    ],
    "data_analyst": [
        {"keyword": "Konsultan Business Intelligence & Dashboard", "service": "data_analyst", "score": 80, "latest": 84, "avg": 69, "trend": 15},
    ],
    "data_science": [
        {"keyword": "Integrasi AI Agent & Automasi Bisnis", "service": "data_science", "score": 91, "latest": 95, "avg": 72, "trend": 23},
    ],
}


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

    opportunities = sorted(
        [item for items in DEFAULT_TRENDS_BY_CATEGORY.values() for item in items],
        key=lambda x: x["score"],
        reverse=True,
    )

    return jsonify({
        "success": True,
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "opportunities": opportunities,
        "data": DEFAULT_TRENDS_BY_CATEGORY,
        "topics": [
            {"title": "Pengembangan Web AI Batam", "traffic": "High", "service": "Web Development"},
            {"title": "Jasa Pembuatan Software ERP Kepri", "traffic": "Rising", "service": "Software Development"}
        ]
    })

@trends_bp.route("/auto_post", methods=["GET", "POST"])
def auto_post():
    admin_token = request.headers.get("X-Admin-Token")
    is_admin = bool(admin_token and AuthService.verify_token(admin_token))

    cron_key = request.headers.get("X-Cron-Key") or request.args.get("key")
    is_cron = bool(cron_key and cron_key == Config.CRON_API_KEY)

    if not is_admin and not is_cron:
        return jsonify({"success": False, "error": {"code": "UNAUTHORIZED", "message": "Admin token or cron key required"}}), 401

    geo = request.args.get("geo", "ID")
    return jsonify({
        "success": True,
        "message": f"Trend automated generation queued for geo={geo}",
        "status": "queued"
    })
