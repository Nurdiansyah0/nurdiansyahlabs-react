from flask import Blueprint, request, jsonify
from app.core.database import db
from app.modules.products.models import Product
from app.modules.auth.decorators import admin_required

products_bp = Blueprint("products", __name__, url_prefix="/api/v1/products")

@products_bp.route("", methods=["GET"])
def get_products():
    app_id = request.args.get("app") or request.args.get("appId")
    category = request.args.get("category")
    status = request.args.get("status", "active")

    stmt = db.select(Product)
    if status != "all":
        stmt = stmt.where(Product.status == status)
    if app_id:
        stmt = stmt.where(Product.app_id == app_id)
    if category:
        stmt = stmt.where(Product.category == category)

    stmt = stmt.order_by(Product.created_at.desc())
    products = db.session.scalars(stmt).all()
    return jsonify({
        "success": True,
        "data": [p.to_dict() for p in products]
    })

@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product_detail(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({
            "success": False,
            "error": {"code": "NOT_FOUND", "message": "Product not found"}
        }), 404
    return jsonify({
        "success": True,
        "data": product.to_dict()
    })

@products_bp.route("", methods=["POST"])
@admin_required
def create_product():
    data = request.get_json(silent=True) or {}
    app_id = (data.get("app_id") or data.get("appId") or "").strip()
    name = (data.get("name") or "").strip()
    price = data.get("price")

    if not app_id or not name or price is None:
        return jsonify({
            "success": False,
            "error": {"code": "VALIDATION_ERROR", "message": "app_id, name, and price are required"}
        }), 400

    product = Product(
        app_id=app_id,
        slug=data.get("slug"),
        name=name,
        price=price,
        description=data.get("description"),
        category=data.get("category"),
        icon=data.get("icon"),
        image_url=data.get("imageUrl") or data.get("image_url"),
        features=data.get("features", []),
        screenshots=data.get("screenshots", []),
        cta_text=data.get("ctaText", "Order Now"),
        external_url=data.get("externalUrl"),
        status=data.get("status", "active"),
        extras=data.get("extras")
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({"success": True, "data": product.to_dict()}), 201

@products_bp.route("/<int:product_id>", methods=["PATCH", "PUT"])
@admin_required
def update_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Product not found"}}), 404

    data = request.get_json(silent=True) or {}
    if "name" in data: product.name = data["name"]
    if "price" in data: product.price = data["price"]
    if "description" in data: product.description = data["description"]
    if "category" in data: product.category = data["category"]
    if "icon" in data: product.icon = data["icon"]
    if "imageUrl" in data: product.image_url = data["imageUrl"]
    if "image_url" in data: product.image_url = data["image_url"]
    if "features" in data: product.features = data["features"]
    if "screenshots" in data: product.screenshots = data["screenshots"]
    if "ctaText" in data: product.cta_text = data["ctaText"]
    if "externalUrl" in data: product.external_url = data["externalUrl"]
    if "status" in data: product.status = data["status"]
    if "extras" in data: product.extras = data["extras"]

    db.session.commit()
    return jsonify({"success": True, "data": product.to_dict()})

@products_bp.route("/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Product not found"}}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({"success": True, "message": "Product deleted successfully"})
