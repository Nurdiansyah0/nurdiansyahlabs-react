from flask import Blueprint, request, jsonify
from app.core.database import db
from app.modules.products.models import Product
from app.modules.auth.decorators import admin_required

products_bp = Blueprint("products", __name__, url_prefix="/api/v1/products")

@products_bp.route("", methods=["GET"])
def get_products():
    app_id = request.args.get("app")
    stmt = db.select(Product)
    if app_id:
        stmt = stmt.where(Product.app_id == app_id)
    stmt = stmt.order_by(Product.created_at.desc())
    products = db.session.scalars(stmt).all()
    # Support both enveloped and legacy data key
    return jsonify({
        "success": True,
        "data": [p.to_dict() for p in products]
    })

@products_bp.route("", methods=["POST"])
@admin_required
def create_product():
    data = request.get_json(silent=True) or {}
    app_id = data.get("app_id", "").strip()
    name = data.get("name", "").strip()
    price = data.get("price")

    if not app_id or not name or price is None:
        return jsonify({
            "success": False,
            "error": {"code": "VALIDATION_ERROR", "message": "app_id, name, and price are required"}
        }), 400

    product = Product(
        app_id=app_id,
        name=name,
        price=price,
        description=data.get("description"),
        image_url=data.get("image_url"),
        category=data.get("category"),
        extras=data.get("extras")
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({"success": True, "data": product.to_dict()}), 201

@products_bp.route("/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Product not found"}}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({"success": True, "message": "Product deleted successfully"})
