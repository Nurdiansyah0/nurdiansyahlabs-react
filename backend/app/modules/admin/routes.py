from flask import Blueprint, request, jsonify
from app.modules.auth.decorators import admin_required
from app.modules.posts.service import PostService
from app.modules.leads.models import Lead
from app.core.database import db

admin_bp = Blueprint("admin", __name__, url_prefix="/api/v1/admin")

@admin_bp.route("", methods=["GET", "POST", "PUT", "DELETE"])
@admin_bp.route("/", methods=["GET", "POST", "PUT", "DELETE"])
@admin_required
def admin_router():
    action = request.args.get("action", "")
    method = request.method

    # 1. Posts Management
    if action == "posts":
        if method == "GET":
            posts = PostService.get_all_posts()
            return jsonify({"posts": [p.to_dict() for p in posts]})
        elif method == "POST":
            data = request.get_json(silent=True) or {}
            post = PostService.create_post(data)
            return jsonify({"success": True, "post": post.to_dict()}), 201
        elif method == "PUT":
            data = request.get_json(silent=True) or {}
            slug = data.get("slug") or request.args.get("slug")
            post = PostService.update_post(slug, data)
            return jsonify({"success": True, "post": post.to_dict() if post else None})
        elif method == "DELETE":
            slug = request.args.get("slug")
            success = PostService.delete_post(slug)
            return jsonify({"success": success})

    # 2. Leads Management
    elif action == "leads":
        if method == "GET":
            leads = db.session.scalars(db.select(Lead).order_by(Lead.timestamp.desc())).all()
            return jsonify({"leads": [l.to_dict() for l in leads]})
        elif method == "DELETE":
            lead_id = request.args.get("id", type=int)
            lead = db.session.get(Lead, lead_id)
            if lead:
                db.session.delete(lead)
                db.session.commit()
                return jsonify({"success": True})
            return jsonify({"success": False, "error": "Lead not found"}), 404

    return jsonify({"error": "Invalid action"}), 400
