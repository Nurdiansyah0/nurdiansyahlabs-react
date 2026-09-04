from flask import Blueprint, request, jsonify
from app.modules.auth.service import AuthService
from app.modules.auth.decorators import admin_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({
            "success": False,
            "error": {"code": "VALIDATION_ERROR", "message": "Username and password required"}
        }), 400

    user, result = AuthService.authenticate(username, password)
    if not user:
        return jsonify({
            "success": False,
            "error": {"code": "INVALID_CREDENTIALS", "message": result}
        }), 401

    return jsonify({
        "success": True,
        "token": result,
        "user": user.to_dict()
    })

@auth_bp.route("/verify", methods=["GET"])
@admin_required
def verify():
    return jsonify({
        "success": True,
        "valid": True,
        "user": request.current_user.to_dict()
    })

@auth_bp.route("/logout", methods=["POST"])
def logout():
    token = request.headers.get("X-Admin-Token")
    if token:
        AuthService.logout(token)
    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    })

@auth_bp.route("/forgot_password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    identifier = data.get("identifier", "").strip()
    if not identifier:
        return jsonify({
            "success": False,
            "error": {"code": "VALIDATION_ERROR", "message": "Username or email is required"}
        }), 400

    user, reset_token = AuthService.create_reset_token(identifier)
    return jsonify({
        "success": True,
        "message": "If the account exists, password reset instructions have been generated."
    })

@auth_bp.route("/reset_password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    token = data.get("token", "").strip()
    password = data.get("password", "")

    if not token or not password:
        return jsonify({
            "success": False,
            "error": {"code": "VALIDATION_ERROR", "message": "Token and new password required"}
        }), 400

    success, message = AuthService.reset_password(token, password)
    if not success:
        return jsonify({
            "success": False,
            "error": {"code": "INVALID_TOKEN", "message": message}
        }), 400

    return jsonify({
        "success": True,
        "message": message
    })

# Legacy router for /api/auth.php?action=...
@auth_bp.route("/legacy", methods=["GET", "POST"])
def legacy_auth_router():
    action = request.args.get("action", "")
    if action == "login":
        return login()
    elif action == "verify":
        return verify()
    elif action == "forgot_password":
        return forgot_password()
    elif action == "reset_password":
        return reset_password()
    elif action == "logout":
        return logout()
    return jsonify({"error": "Unknown action"}), 400
