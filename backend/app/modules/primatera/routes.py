from flask import Blueprint, request, jsonify
from datetime import datetime, date
from app.core.database import db
from app.core.security import verify_password, generate_token
from app.modules.primatera.models import PrimateraUser, PrimateraRecord, PrimateraTransaction, PrimateraInventory

primatera_bp = Blueprint("primatera", __name__, url_prefix="/api/v1/primatera")

@primatera_bp.route("/auth", methods=["POST"])
def auth():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    user = db.session.scalar(db.select(PrimateraUser).where(PrimateraUser.username == username))
    if not user or not verify_password(password, user.password_hash):
        return jsonify({"success": False, "error": "Invalid username or password"}), 401

    token = generate_token(16)
    return jsonify({
        "success": True,
        "token": token,
        "user": user.to_dict()
    })

@primatera_bp.route("/records", methods=["GET", "POST"])
def handle_records():
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        rec_date = datetime.strptime(data["date"], "%Y-%m-%d").date() if "date" in data else date.today()
        record = PrimateraRecord(
            date=rec_date,
            flock_id=data.get("flock_id", "Kandang-A"),
            feed_consumed_kg=data.get("feed_consumed_kg", 0),
            mortality_count=data.get("mortality_count", 0),
            body_weight_grams=data.get("body_weight_grams"),
            notes=data.get("notes")
        )
        db.session.add(record)
        db.session.commit()
        return jsonify({"success": True, "data": record.to_dict()}), 201

    records = db.session.scalars(db.select(PrimateraRecord).order_by(PrimateraRecord.date.desc())).all()
    return jsonify({"success": True, "records": [r.to_dict() for r in records]})

@primatera_bp.route("/transactions", methods=["GET", "POST"])
def handle_transactions():
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        tx_date = datetime.strptime(data["date"], "%Y-%m-%d").date() if "date" in data else date.today()
        tx = PrimateraTransaction(
            date=tx_date,
            type=data.get("type", "EXPENSE"),
            category=data.get("category", "General"),
            amount=data.get("amount", 0),
            quantity=data.get("quantity", 0),
            notes=data.get("notes")
        )
        db.session.add(tx)
        db.session.commit()
        return jsonify({"success": True, "data": tx.to_dict()}), 201

    transactions = db.session.scalars(db.select(PrimateraTransaction).order_by(PrimateraTransaction.date.desc())).all()
    return jsonify({"success": True, "transactions": [t.to_dict() for t in transactions]})

@primatera_bp.route("/inventory", methods=["GET", "POST"])
def handle_inventory():
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        item_type = data.get("item_type")
        stock = data.get("stock", 0)
        item = db.session.scalar(db.select(PrimateraInventory).where(PrimateraInventory.item_type == item_type))
        if not item:
            item = PrimateraInventory(item_type=item_type, stock=stock)
            db.session.add(item)
        else:
            item.stock = stock
        db.session.commit()
        return jsonify({"success": True, "data": item.to_dict()})

    items = db.session.scalars(db.select(PrimateraInventory)).all()
    return jsonify({"success": True, "inventory": [i.to_dict() for i in items]})
