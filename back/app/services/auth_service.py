from fastapi import HTTPException, status
from datetime import timedelta
from services.security_service import SecurityService
from schemas.types import Token, UserInDB
from services.user_service import UserService
from config.security import ACCESS_TOKEN_EXPIRE_MINUTES
from schemas.types import UserInDB

class AuthService:
    @staticmethod
    def authenticate_user(username: str, password: str) -> UserInDB:
        user = UserService.get_user(username)
        if not user or not SecurityService.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user

    @staticmethod
    def create_access_token(user: UserInDB) -> Token:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = SecurityService.create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
        return Token(access_token=access_token, token_type="bearer")
