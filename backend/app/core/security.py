import secrets
from werkzeug.security import generate_password_hash, check_password_hash

try:
    import bcrypt
except ImportError:
    bcrypt = None


def hash_password(password: str) -> str:
    if bcrypt is not None:
        salt = bcrypt.gensalt(rounds=10)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    return generate_password_hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not plain_password or not hashed_password:
        return False
    if hashed_password.startswith(("scrypt:", "pbkdf2:")):
        return check_password_hash(hashed_password, plain_password)
    if bcrypt is not None:
        # Support both $2y$ (PHP standard) and $2b$ (standard bcrypt)
        if hashed_password.startswith("$2y$"):
            hashed_password = "$2b$" + hashed_password[4:]
        try:
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception:
            return False
    return False


def generate_token(length: int = 32) -> str:
    return secrets.token_hex(length)
