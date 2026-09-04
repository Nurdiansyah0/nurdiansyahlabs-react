import secrets
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not plain_password or not hashed_password:
        return False
    # Support both $2y$ (PHP standard) and $2b$ (standard bcrypt)
    if hashed_password.startswith("$2y$"):
        hashed_password = "$2b$" + hashed_password[4:]
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def generate_token(length: int = 32) -> str:
    return secrets.token_hex(length)
