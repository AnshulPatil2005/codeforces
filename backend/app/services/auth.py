from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
import json
import os
from app.config import settings

# JWT Configuration
SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing - using sha256_crypt for better compatibility in this environment
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

# Simple persistence for user database
DB_FILE = "users_db.json"

def load_db() -> Dict[str, Dict[str, Any]]:
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_db(db: Dict[str, Dict[str, Any]]):
    with open(DB_FILE, "w") as f:
        json.dump(db, f, indent=2)

users_db: Dict[str, Dict[str, Any]] = load_db()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def register_user(username: str, email: str, password: str, cf_handle: Optional[str] = None) -> Dict[str, Any]:
    """Register a new user"""
    # Check if user already exists
    if username in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Check if email already exists
    if any(user.get("email") == email for user in users_db.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    hashed_password = get_password_hash(password)
    user = {
        "username": username,
        "email": email,
        "hashed_password": hashed_password,
        "cf_handle": cf_handle or username,
        "created_at": datetime.utcnow().isoformat()
    }

    users_db[username] = user
    save_db(users_db)

    # Return user without password
    return {
        "username": user["username"],
        "email": user["email"],
        "cf_handle": user["cf_handle"],
        "created_at": user["created_at"]
    }


def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate user and return user data"""
    user = users_db.get(username)
    if not user:
        return None

    if not verify_password(password, user["hashed_password"]):
        return None

    return {
        "username": user["username"],
        "email": user["email"],
        "cf_handle": user["cf_handle"],
        "created_at": user["created_at"]
    }


def get_current_user(token: str) -> Dict[str, Any]:
    """Get current user from token"""
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = users_db.get(username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        "username": user["username"],
        "email": user["email"],
        "cf_handle": user["cf_handle"],
        "created_at": user["created_at"]
    }
