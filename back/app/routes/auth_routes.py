from fastapi import APIRouter, Depends, Body, Response
from app.services.user_service import UserService
from app.schemas.types import UserRegister, UserInDB, User, SignInRequest, Token
from typing import Annotated
import logging
from app.crud.user import UserCRUD
from app.services.auth_service import AuthService
from app.config.common import debug, behind_nginx
from app.config.security import ACCESS_TOKEN_EXPIRE_MINUTES

uvicorn_logger = logging.getLogger("uvicorn")

router = APIRouter()

@router.post("/signup", response_model=UserInDB, status_code=201)
def create_user(user: Annotated[UserInDB, Depends(UserService.create_user)]):
    return user

@router.post("/login", status_code=200)
def login_user(request: SignInRequest, response: Response):
    uvicorn_logger.info("yes")
    user = AuthService.authenticate_user(request.email, request.password)
    token = AuthService.create_access_token(user)
    response.set_cookie(
        key="access_token",
        value=token.access_token,
        httponly=True,
        secure=behind_nginx,
        samesite="Strict",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",        
    )
    return {"message": "Logged in"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}
