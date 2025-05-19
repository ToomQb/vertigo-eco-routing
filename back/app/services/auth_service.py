from fastapi import HTTPException, status
from datetime import timedelta
from app.services.security_service import SecurityService
from app.services.user_service import UserService
from app.schemas.types import Token, UserInDB, UserInDB
from app.config.security import ACCESS_TOKEN_EXPIRE_MINUTES

class AuthService:
    @staticmethod
    def authenticate_user(email: str, password: str) -> UserInDB:
        user = UserService.get_user(email)
        if not user or not SecurityService.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user

    @staticmethod
    def create_access_token(user: UserInDB) -> Token:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = SecurityService.create_access_token(data={"email": user.email}, expires_delta=access_token_expires)
        return Token(access_token=access_token, token_type="bearer")