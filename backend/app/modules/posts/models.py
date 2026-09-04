from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import db

class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    service: Mapped[str | None] = mapped_column(String(50), nullable=True)
    serviceLabel: Mapped[str | None] = mapped_column("serviceLabel", String(100), nullable=True)
    accent: Mapped[str | None] = mapped_column(String(20), nullable=True)
    accentLight: Mapped[str | None] = mapped_column("accentLight", String(20), nullable=True)
    img: Mapped[str | None] = mapped_column(String(255), nullable=True)
    faqs: Mapped[dict | list | None] = mapped_column(JSON, nullable=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "description": self.description,
            "service": self.service,
            "serviceLabel": self.serviceLabel,
            "accent": self.accent,
            "accentLight": self.accentLight,
            "img": self.img,
            "faqs": self.faqs,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
