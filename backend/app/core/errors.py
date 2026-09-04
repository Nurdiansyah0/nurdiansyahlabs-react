from flask import jsonify

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({
            "success": False,
            "error": {
                "code": "BAD_REQUEST",
                "message": getattr(e, 'description', 'Invalid request')
            }
        }), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({
            "success": False,
            "error": {
                "code": "UNAUTHORIZED",
                "message": getattr(e, 'description', 'Authentication required')
            }
        }), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({
            "success": False,
            "error": {
                "code": "FORBIDDEN",
                "message": getattr(e, 'description', 'Access denied')
            }
        }), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "success": False,
            "error": {
                "code": "NOT_FOUND",
                "message": getattr(e, 'description', 'Resource not found')
            }
        }), 404

    @app.errorhandler(422)
    def unprocessable_entity(e):
        return jsonify({
            "success": False,
            "error": {
                "code": "UNPROCESSABLE_ENTITY",
                "message": getattr(e, 'description', 'Unprocessable request')
            }
        }), 422

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again later."
            }
        }), 500
