from datetime import datetime, timezone
from sqlalchemy import String, Integer, Numeric, Text, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import db

JSONType = JSON().with_variant(JSONB, "postgresql")

class Product(db.Model):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    app_id: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    slug: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0.0)
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    icon: Mapped[str | None] = mapped_column(String(255), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    features: Mapped[list | None] = mapped_column(JSONType, nullable=True)
    screenshots: Mapped[list | None] = mapped_column(JSONType, nullable=True)
    cta_text: Mapped[str | None] = mapped_column(String(50), nullable=True, default="Order Now")
    external_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active")
    extras: Mapped[dict | list | None] = mapped_column(JSONType, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "appId": self.app_id,
            "app_id": self.app_id,
            "slug": self.slug,
            "name": self.name,
            "description": self.description,
            "price": float(self.price) if self.price is not None else 0.0,
            "category": self.category,
            "icon": self.icon,
            "imageUrl": self.image_url,
            "image_url": self.image_url,
            "features": self.features or [],
            "screenshots": self.screenshots or [],
            "ctaText": self.cta_text,
            "externalUrl": self.external_url,
            "status": self.status,
            "extras": self.extras,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None
        }
