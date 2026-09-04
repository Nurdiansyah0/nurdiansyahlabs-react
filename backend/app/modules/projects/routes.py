from flask import Blueprint, request, jsonify
from app.core.database import db
from app.modules.projects.models import Project
from app.modules.auth.decorators import admin_required

projects_bp = Blueprint("projects", __name__, url_prefix="/api/v1/projects")

@projects_bp.route("", methods=["GET"])
@projects_bp.route("/", methods=["GET"])
def list_projects():
    category = request.args.get("category")
    status = request.args.get("status", "published")

    stmt = db.select(Project)
    if status != "all":
        stmt = stmt.where(Project.status == status)
    if category:
        stmt = stmt.where(Project.category_slug == category)
    
    stmt = stmt.order_by(Project.created_at.desc())
    projects = db.session.scalars(stmt).all()
    return jsonify({
        "success": True,
        "data": [p.to_dict() for p in projects]
    })

@projects_bp.route("/<slug>", methods=["GET"])
def get_project(slug):
    project = db.session.scalar(db.select(Project).where(Project.slug == slug))
    if not project:
        return jsonify({
            "success": False,
            "error": {"code": "NOT_FOUND", "message": "Project not found"}
        }), 404
    return jsonify({
        "success": True,
        "data": project.to_dict()
    })

@projects_bp.route("", methods=["POST"])
@projects_bp.route("/", methods=["POST"])
@admin_required
def create_project():
    data = request.get_json(silent=True) or {}
    slug = data.get("slug", "").strip()
    title = data.get("title", "").strip()

    if not slug or not title:
        return jsonify({
            "success": False,
            "error": {"code": "VALIDATION_ERROR", "message": "Title and slug are required"}
        }), 400

    existing = db.session.scalar(db.select(Project).where(Project.slug == slug))
    if existing:
        return jsonify({
            "success": False,
            "error": {"code": "CONFLICT", "message": "Project with this slug already exists"}
        }), 409

    project = Project(
        slug=slug,
        title=title,
        description=data.get("description", ""),
        category=data.get("category", "Fullstack"),
        category_slug=data.get("categorySlug", "fullstack"),
        accent_color=data.get("accentColor", "#1d4ed8"),
        technologies=data.get("techStack") or data.get("technologies"),
        repository_url=data.get("repositoryUrl"),
        demo_url=data.get("demoUrl"),
        screenshots=data.get("screenshots", []),
        status=data.get("status", "published"),
        is_featured=data.get("isFeatured", False)
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({
        "success": True,
        "data": project.to_dict()
    }), 201

@projects_bp.route("/<int:project_id>", methods=["PATCH", "PUT"])
@admin_required
def update_project(project_id):
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({
            "success": False,
            "error": {"code": "NOT_FOUND", "message": "Project not found"}
        }), 404

    data = request.get_json(silent=True) or {}
    if "title" in data: project.title = data["title"]
    if "description" in data: project.description = data["description"]
    if "category" in data: project.category = data["category"]
    if "categorySlug" in data: project.category_slug = data["categorySlug"]
    if "accentColor" in data: project.accent_color = data["accentColor"]
    if "techStack" in data: project.technologies = data["techStack"]
    if "technologies" in data: project.technologies = data["technologies"]
    if "repositoryUrl" in data: project.repository_url = data["repositoryUrl"]
    if "demoUrl" in data: project.demo_url = data["demoUrl"]
    if "screenshots" in data: project.screenshots = data["screenshots"]
    if "status" in data: project.status = data["status"]
    if "isFeatured" in data: project.is_featured = data["isFeatured"]

    db.session.commit()
    return jsonify({
        "success": True,
        "data": project.to_dict()
    })

@projects_bp.route("/<int:project_id>", methods=["DELETE"])
@admin_required
def delete_project(project_id):
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({
            "success": False,
            "error": {"code": "NOT_FOUND", "message": "Project not found"}
        }), 404

    db.session.delete(project)
    db.session.commit()
    return jsonify({
        "success": True,
        "message": "Project deleted successfully"
    })
