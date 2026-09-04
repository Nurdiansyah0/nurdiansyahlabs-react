from functools import wraps
from flask import request, jsonify
from app.modules.auth.service import AuthService

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check X-Admin-Token header or Authorization Bearer token
        token = request.headers.get("X-Admin-Token")
        if not token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1].strip()
                
        if not token:
            return jsonify({
                "success": False,
                "error": {
                    "code": "UNAUTHORIZED",
                    "message": "Admin token is missing"
                }
            }), 401

        user = AuthService.verify_token(token)
        if not user:
            return jsonify({
                "success": False,
                "error": {
                    "code": "UNAUTHORIZED",
                    "message": "Invalid or expired admin token"
                }
            }), 401

        request.current_user = user
        return f(*args, **kwargs)
    return decorated_function
