from flask import Blueprint, request, jsonify
from app.modules.posts.service import PostService
from app.modules.auth.decorators import admin_required

posts_bp = Blueprint("posts", __name__, url_prefix="/api/v1/posts")

@posts_bp.route("", methods=["GET"])
def list_posts():
    slug = request.args.get("slug")
    if slug:
        post = PostService.get_by_slug(slug)
        if not post:
            return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Article not found"}}), 404
        return jsonify(post.to_dict())

    posts = PostService.get_all_posts()
    # Support both array response (for frontend blog listing) and enveloped object
    return jsonify([p.to_dict() for p in posts])

@posts_bp.route("/<slug>", methods=["GET"])
def get_post(slug):
    post = PostService.get_by_slug(slug)
    if not post:
        return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Article not found"}}), 404
    return jsonify(post.to_dict())

@posts_bp.route("", methods=["POST"])
@admin_required
def create_post():
    data = request.get_json(silent=True) or {}
    if not data.get("title") or not data.get("slug"):
        return jsonify({"success": False, "error": {"code": "VALIDATION_ERROR", "message": "Title and slug required"}}), 400

    existing = PostService.get_by_slug(data["slug"])
    if existing:
        return jsonify({"success": False, "error": {"code": "CONFLICT", "message": "Slug already exists"}}), 409

    post = PostService.create_post(data)
    return jsonify({"success": True, "data": post.to_dict()}), 201

@posts_bp.route("/<slug>", methods=["PUT", "PATCH"])
@admin_required
def update_post(slug):
    data = request.get_json(silent=True) or {}
    post = PostService.update_post(slug, data)
    if not post:
        return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Article not found"}}), 404
    return jsonify({"success": True, "data": post.to_dict()})

@posts_bp.route("/<slug>", methods=["DELETE"])
@admin_required
def delete_post(slug):
    success = PostService.delete_post(slug)
    if not success:
        return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Article not found"}}), 404
    return jsonify({"success": True, "message": "Article deleted successfully"})
