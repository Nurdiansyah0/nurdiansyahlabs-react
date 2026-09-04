from datetime import datetime, timezone, date
from sqlalchemy import String, Integer, Numeric, Text, Date, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import db

class PrimateraUser(db.Model):
    __tablename__ = "primatera_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="viewer")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "role": self.role
        }

class PrimateraRecord(db.Model):
    __tablename__ = "primatera_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    flock_id: Mapped[str] = mapped_column(String(50), nullable=False)
    feed_consumed_kg: Mapped[float] = mapped_column(Numeric(10, 2), default=0.0)
    mortality_count: Mapped[int] = mapped_column(Integer, default=0)
    body_weight_grams: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat() if self.date else None,
            "flock_id": self.flock_id,
            "feed_consumed_kg": float(self.feed_consumed_kg or 0),
            "mortality_count": self.mortality_count,
            "body_weight_grams": self.body_weight_grams,
            "notes": self.notes
        }

class PrimateraTransaction(db.Model):
    __tablename__ = "primatera_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False) # INCOME or EXPENSE
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    quantity: Mapped[float] = mapped_column(Numeric(10, 2), default=0.0)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat() if self.date else None,
            "type": self.type,
            "category": self.category,
            "amount": float(self.amount or 0),
            "quantity": float(self.quantity or 0),
            "notes": self.notes
        }

class PrimateraInventory(db.Model):
    __tablename__ = "primatera_inventory"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    item_type: Mapped[str] = mapped_column(String(20), unique=True, nullable=False) # FEED or MEDICINE
    stock: Mapped[float] = mapped_column(Numeric(10, 2), default=0.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "item_type": self.item_type,
            "stock": float(self.stock or 0),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
