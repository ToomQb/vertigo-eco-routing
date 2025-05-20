import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException, status
from app.services.auth_service import AuthService
from app.schemas.types import UserInDB, Token
from app.config.security import ACCESS_TOKEN_EXPIRE_MINUTES


@pytest.fixture
def user_in_db():
    return UserInDB(email="test@example.com", hashed_password="hashedpass")


# --- authenticate_user ---

@patch("app.services.auth_service.UserService")
@patch("app.services.auth_service.SecurityService")
def test_authenticate_user_success(mock_security, mock_user_service, user_in_db):
    mock_user_service.get_user.return_value = user_in_db
    mock_security.verify_password.return_value = True

    result = AuthService.authenticate_user("unittestuser", "correctpassword")
    assert result.email == user_in_db.email


@patch("app.services.auth_service.UserService")
@patch("app.services.auth_service.SecurityService")
def test_authenticate_user_invalid_password(mock_security, mock_user_service, user_in_db):
    mock_user_service.get_user.return_value = user_in_db
    mock_security.verify_password.return_value = False

    with pytest.raises(HTTPException) as exc_info:
        AuthService.authenticate_user("unittestuser", "wrongpassword")
    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert exc_info.value.detail == "Incorrect email or password"


@patch("app.services.auth_service.UserService")
def test_authenticate_user_user_not_found(mock_user_service):
    mock_user_service.get_user.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        AuthService.authenticate_user("ghost", "password")
    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert exc_info.value.detail == "Incorrect email or password"


# --- create_access_token ---

@patch("app.services.auth_service.SecurityService")
def test_create_access_token(mock_security, user_in_db):
    fake_token = "faketoken"
    mock_security.create_access_token.return_value = fake_token

    token_obj = AuthService.create_access_token(user_in_db)
    assert isinstance(token_obj, Token)
    assert token_obj.access_token == fake_token
    assert token_obj.token_type == "bearer"
