import pytest
from fastapi import HTTPException, status
from unittest.mock import patch, MagicMock
from jwt import encode
from app.services.user_service import UserService
from app.schemas.types import UserInDB, UserRegister
from app.config.security import SECRET_KEY, ALGORITHM

@pytest.fixture
def sample_user():
    return UserInDB(email="test@example.com", hashed_password="hashed")

@pytest.fixture
def sample_user_register():
    return UserRegister(email="test@example.com", password="password123")

def generate_token(email: str):
    return encode({"email": email}, SECRET_KEY, algorithm=ALGORITHM)

# --- get_user ---

@patch("app.services.user_service.UserCRUD")
def test_get_user_found(mock_user_crud, sample_user):
    mock_user_crud.return_value.get_user.return_value = sample_user
    user = UserService.get_user("test@example.com")
    assert user.email == "test@example.com"

@patch("app.services.user_service.UserCRUD")
def test_get_user_not_found(mock_user_crud):
    mock_user_crud.return_value.get_user.return_value = None
    with pytest.raises(HTTPException) as exc_info:
        UserService.get_user("notfound")
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "User not found"

# --- get_current_user ---

@patch("app.services.user_service.UserCRUD")
def test_get_current_user_valid_token(mock_user_crud, sample_user):
    token = generate_token("test@example.com")
    mock_user_crud.return_value.get_user.return_value = sample_user
    user = UserService.get_current_user(token)
    assert user.email == "test@example.com"

@patch("app.services.user_service.UserCRUD")
def test_get_current_user_invalid_token(mock_user_crud):
    invalid_token = "invalidtoken"
    with pytest.raises(HTTPException) as exc_info:
        UserService.get_current_user(invalid_token)
    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED

@patch("app.services.user_service.UserCRUD")
def test_get_current_user_user_not_found(mock_user_crud):
    token = generate_token("ghostuser")
    mock_user_crud.return_value.get_user.return_value = None
    with pytest.raises(HTTPException) as exc_info:
        UserService.get_current_user(token)
    assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND

# --- create_user ---

@patch("app.services.user_service.SecurityService")
@patch("app.services.user_service.UserCRUD")
def test_create_user_success(mock_user_crud, mock_security, sample_user_register):
    mock_user_crud.return_value.get_user.return_value = None
    mock_security.hash_password.return_value = "hashed_pw"
    mock_user_crud.return_value.create_user.return_value = UserInDB(
        email=sample_user_register.email,
        hashed_password="hashed_pw"
    )

    user = UserService.create_user(sample_user_register)
    assert user.email == sample_user_register.email
    assert user.hashed_password == "hashed_pw"

@patch("app.services.user_service.UserCRUD")
def test_create_user_already_exists(mock_user_crud, sample_user, sample_user_register):
    mock_user_crud.return_value.get_user.return_value = sample_user
    with pytest.raises(HTTPException) as exc_info:
        UserService.create_user(sample_user_register)
    assert exc_info.value.status_code == 409
    assert exc_info.value.detail == "User already exists"
