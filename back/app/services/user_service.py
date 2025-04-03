import jwt
from jwt.exceptions import InvalidTokenError
from config.security import oauth2_scheme, ALGORITHM, SECRET_KEY
from crud.user import UserCRUD
from schemas.types import TokenData
from fastapi import Depends, HTTPException, status 
from typing import Annotated
from schemas.types import UserInDB, UserRegister
from services.security_service import SecurityService

class UserService:
    @staticmethod
    def get_user(username: str) -> UserInDB:
        user = UserCRUD().get_user(username)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
        
    
    @staticmethod
    def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> UserInDB:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")
            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
        except InvalidTokenError:
            raise credentials_exception
        user = UserService.get_user(username)
        if user is None:
            raise credentials_exception
        return user
    
    @staticmethod
    def create_user(user: UserRegister) -> UserInDB:
        if UserService.get_user(user.username):
            raise HTTPException(
                status_code=409,
                detail="User already exists"
            )
        user_dict = user.model_dump(exclude={"password"})
        user_dict["hashed_password"] = SecurityService.hash_password(user.password)
        user_in_db = UserInDB(**user_dict)
        return UserCRUD().create_user(user_in_db)