from flask import Flask, jsonify
from flask_cors import CORS
from app.core.config import Config
from app.core.database import db
from app.core.errors import register_error_handlers
from app.core.middleware import setup_middleware

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    db.init_app(app)

    register_error_handlers(app)
    setup_middleware(app)

    from app.modules.auth.routes import auth_bp
    from app.modules.posts.routes import posts_bp
    from app.modules.products.routes import products_bp
    from app.modules.leads.routes import leads_bp
    from app.modules.analytics.routes import analytics_bp
    from app.modules.media.routes import media_bp
    from app.modules.trends.routes import trends_bp
    from app.modules.primatera.routes import primatera_bp
    from app.modules.admin.routes import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(posts_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(leads_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(media_bp)
    app.register_blueprint(trends_bp)
    app.register_blueprint(primatera_bp)
    app.register_blueprint(admin_bp)

    @app.route("/api/v1/health", methods=["GET"])
    def health_check():
        db_status = "ok"
        try:
            db.session.execute(db.text("SELECT 1"))
        except Exception as e:
            db_status = f"unreachable: {str(e)}"

        return jsonify({
            "success": True,
            "data": {
                "status": "ok",
                "application": "nurdiansyahlabs-modular-monolith",
                "runtime": "python-3.13.15",
                "framework": "flask-3.1.3",
                "database": db_status
            }
        })

    return app
