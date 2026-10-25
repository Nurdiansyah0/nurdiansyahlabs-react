import os
from pathlib import Path

env_file = Path(__file__).resolve().parent.parent.parent / ".env"
if env_file.exists():
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "nurdiansyahlabs-secret-key-change-in-production")
    DATABASE_URL = os.environ.get(
        "DATABASE_URL", 
        "sqlite:///nurdiansyahlabs.db"
    )
    # Ensure psycopg (v3) driver is used for postgresql
    if DATABASE_URL:
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
        elif DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+psycopg://"):
            DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
        
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    if "sqlite" in DATABASE_URL:
        SQLALCHEMY_ENGINE_OPTIONS = {
            "pool_pre_ping": True,
        }
    else:
        SQLALCHEMY_ENGINE_OPTIONS = {
            "pool_size": int(os.environ.get("DB_POOL_SIZE", 5)),
            "max_overflow": int(os.environ.get("DB_MAX_OVERFLOW", 10)),
            "pool_timeout": int(os.environ.get("DB_POOL_TIMEOUT", 15)),
            "pool_recycle": int(os.environ.get("DB_POOL_RECYCLE", 1800)),
            "pool_pre_ping": True,
        }
    
    MAX_CONTENT_LENGTH = int(os.environ.get("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "/home/uygpuazs/public_html/upload_articles")
    
    SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
    SMTP_USER = os.environ.get("SMTP_USER", "")
    SMTP_PASS = os.environ.get("SMTP_PASS", "")
    SITE_URL = os.environ.get("SITE_URL", "https://nurdiansyahlabs.com")
    
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
    CRON_API_KEY = os.environ.get("CRON_API_KEY", "nurdiansyah-cron-2026")
