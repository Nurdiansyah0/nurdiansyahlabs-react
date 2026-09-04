from datetime import datetime, timezone, timedelta
from app.core.database import db
from app.core.security import verify_password, hash_password, generate_token
from app.modules.auth.models import AdminUser

class AuthService:
    @staticmethod
    def authenticate(username_or_email: str, password: str):
        user = db.session.scalar(
            db.select(AdminUser).where(
                (AdminUser.username == username_or_email) | (AdminUser.email == username_or_email)
            )
        )
        if not user or not verify_password(password, user.password_hash):
            return None, "Invalid username or password"
        
        # Generate new session token
        token = generate_token(32)
        user.token = token
        db.session.commit()
        return user, token

    @staticmethod
    def verify_token(token: str):
        if not token:
            return None
        user = db.session.scalar(
            db.select(AdminUser).where(AdminUser.token == token)
        )
        return user

    @staticmethod
    def logout(token: str):
        if not token:
            return
        user = db.session.scalar(
            db.select(AdminUser).where(AdminUser.token == token)
        )
        if user:
            user.token = None
            db.session.commit()

    @staticmethod
    def create_reset_token(identifier: str):
        user = db.session.scalar(
            db.select(AdminUser).where(
                (AdminUser.username == identifier) | (AdminUser.email == identifier)
            )
        )
        if not user:
            return None, "User not found"
        
        reset_token = generate_token(32)
        user.reset_token = reset_token
        user.reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        db.session.commit()
        return user, reset_token

    @staticmethod
    def reset_password(token: str, new_password: str):
        now = datetime.now(timezone.utc)
        user = db.session.scalar(
            db.select(AdminUser).where(
                AdminUser.reset_token == token,
                AdminUser.reset_expires > now
            )
        )
        if not user:
            return False, "Invalid or expired reset token"
        
        user.password_hash = hash_password(new_password)
        user.reset_token = None
        user.reset_expires = None
        user.token = None # Invalidate existing session
        db.session.commit()
        return True, "Password reset successfully"
