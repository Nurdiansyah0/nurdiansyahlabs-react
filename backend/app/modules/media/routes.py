import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.core.config import Config
from app.modules.auth.decorators import admin_required

media_bp = Blueprint("media", __name__, url_prefix="/api/v1/media")

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'svg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@media_bp.route("/upload", methods=["POST"])
@admin_required
def upload_file():
    if 'image' not in request.files and 'file' not in request.files:
        return jsonify({"success": False, "error": {"code": "VALIDATION_ERROR", "message": "No file part in request"}}), 400

    file = request.files.get('image') or request.files.get('file')
    if file.filename == '':
        return jsonify({"success": False, "error": {"code": "VALIDATION_ERROR", "message": "No selected file"}}), 400

    if not allowed_file(file.filename):
        return jsonify({"success": False, "error": {"code": "INVALID_FILE_TYPE", "message": "Allowed formats: PNG, JPG, JPEG, WEBP, SVG"}}), 400

    # Sanitize and generate unique safe filename
    ext = file.filename.rsplit('.', 1)[1].lower()
    safe_name = f"{uuid.uuid4().hex[:12]}_{secure_filename(file.filename)}"
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    destination = os.path.join(Config.UPLOAD_FOLDER, safe_name)
    file.save(destination)

    # Return public URL matching legacy upload_articles path
    public_url = f"/upload_articles/{safe_name}"
    return jsonify({
        "success": True,
        "url": public_url,
        "imageUrl": public_url,
        "filename": safe_name
    }), 201
