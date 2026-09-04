import os
import uuid
import re
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.core.config import Config
from app.modules.auth.decorators import admin_required

media_bp = Blueprint("media", __name__, url_prefix="/api/v1/media")

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'svg'}
MAGIC_BYTES = {
    'png': b'\x89PNG\r\n\x1a\n',
    'jpg': b'\xff\xd8\xff',
    'jpeg': b'\xff\xd8\xff',
    'webp': b'RIFF',
}

def is_safe_svg(content: bytes) -> bool:
    try:
        text = content.decode('utf-8', errors='ignore').lower()
        # Disallow script tags, javascript: event handlers, foreign objects
        dangerous = ['<script', 'javascript:', 'onload=', 'onerror=', 'onclick=', '<foreignobject', 'xlink:href="javascript:']
        return not any(d in text for d in dangerous)
    except Exception:
        return False

def validate_file_content(file_stream, ext: str) -> bool:
    header = file_stream.read(512)
    file_stream.seek(0)
    
    if ext in MAGIC_BYTES:
        expected = MAGIC_BYTES[ext]
        return header.startswith(expected)
    elif ext == 'svg':
        full_content = file_stream.read(2 * 1024 * 1024)
        file_stream.seek(0)
        return is_safe_svg(full_content)
    return False

@media_bp.route("/upload", methods=["POST"])
@admin_required
def upload_file():
    if 'image' not in request.files and 'file' not in request.files:
        return jsonify({"success": False, "error": {"code": "VALIDATION_ERROR", "message": "No file part in request"}}), 400

    file = request.files.get('image') or request.files.get('file')
    if not file or file.filename == '':
        return jsonify({"success": False, "error": {"code": "VALIDATION_ERROR", "message": "No selected file"}}), 400

    if '.' not in file.filename:
        return jsonify({"success": False, "error": {"code": "INVALID_FILE_TYPE", "message": "File extension required"}}), 400

    ext = file.filename.rsplit('.', 1)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"success": False, "error": {"code": "INVALID_FILE_TYPE", "message": f"Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS)).upper()}"}}), 400

    if not validate_file_content(file.stream, ext):
        return jsonify({"success": False, "error": {"code": "MALICIOUS_FILE_CONTENT", "message": "File failed magic byte / safety validation"}}), 400

    safe_base = secure_filename(file.filename).rsplit('.', 1)[0]
    safe_name = f"{uuid.uuid4().hex[:12]}_{safe_base}.{ext}"
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    destination = os.path.join(Config.UPLOAD_FOLDER, safe_name)
    file.save(destination)

    public_url = f"/upload_articles/{safe_name}"
    return jsonify({
        "success": True,
        "data": {
            "url": public_url,
            "imageUrl": public_url,
            "filename": safe_name
        }
    }), 201
