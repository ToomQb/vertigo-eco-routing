import pytest
import jwt
from datetime import timedelta, datetime, timezone
from app.services.security_service import SecurityService
from app.config.security import SECRET_KEY, ALGORITHM

# --- hash_password & verify_password ---

def test_hash_and_verify_password():
    password = "securepassword123"
    hashed = SecurityService.hash_password(password)
    
    assert hashed != password
    assert SecurityService.verify_password(password, hashed)
    assert not SecurityService.verify_password("wrongpassword", hashed)

# --- create_access_token ---

def test_create_access_token_default_exp():
    data = {"sub": "testuser"}
    token = SecurityService.create_access_token(data)
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    assert decoded["sub"] == "testuser"
    assert "exp" in decoded
    assert datetime.fromtimestamp(decoded["exp"], tz=timezone.utc) > datetime.now(timezone.utc)

def test_create_access_token_with_explicit_exp():
    data = {"sub": "testuser"}
    delta = timedelta(minutes=30)
    token = SecurityService.create_access_token(data, expires_delta=delta)
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    assert decoded["sub"] == "testuser"
    exp_time = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc)
    expected = datetime.now(timezone.utc) + delta
    # check within a small margin of error
    assert abs((exp_time - expected).total_seconds()) < 5
