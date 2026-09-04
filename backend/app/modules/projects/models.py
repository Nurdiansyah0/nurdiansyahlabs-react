from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import db

# Universal JSON type (JSONB on PostgreSQL, JSON on SQLite)
JSONType = JSON().with_variant(JSONB, "postgresql")

class Project(db.Model):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="Fullstack")
    category_slug: Mapped[str] = mapped_column(String(50), nullable=False, default="fullstack")
    accent_color: Mapped[str] = mapped_column(String(20), default="#1d4ed8")
    technologies: Mapped[dict | None] = mapped_column(JSONType, nullable=True)
    repository_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    demo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    screenshots: Mapped[list | None] = mapped_column(JSONType, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="published")
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "categorySlug": self.category_slug,
            "accentColor": self.accent_color,
            "techStack": self.technologies,
            "technologies": self.technologies,
            "repositoryUrl": self.repository_url,
            "demoUrl": self.demo_url,
            "screenshots": self.screenshots or [],
            "status": self.status,
            "isFeatured": self.is_featured,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
