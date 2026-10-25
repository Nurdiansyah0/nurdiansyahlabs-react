from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import db

class AnalyticsEvent(db.Model):
    __tablename__ = "analytics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    visitorId: Mapped[str] = mapped_column("visitorId", String(255), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    service: Mapped[str | None] = mapped_column(String(100), nullable=True)
    duration: Mapped[int | None] = mapped_column(Integer, nullable=True)
    route: Mapped[str | None] = mapped_column(String(255), nullable=True)
    userAgent: Mapped[str | None] = mapped_column("userAgent", Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "path": self.path,
            "visitorId": self.visitorId,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "title": self.title,
            "service": self.service,
            "duration": self.duration,
            "route": self.route,
            "userAgent": self.userAgent,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
