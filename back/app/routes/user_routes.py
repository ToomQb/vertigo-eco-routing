from fastapi import APIRouter, Depends, Body, Response, Request, HTTPException
from app.services.user_service import UserService
from app.schemas.types import UserRegister, UserInDB, User, SignInRequest, Token
from typing import Annotated
import logging
from app.crud.user import UserCRUD
from app.services.auth_service import AuthService
from app.config.common import debug
from app.services.security_service import SecurityService

uvicorn_logger = logging.getLogger("uvicorn")

router = APIRouter()

@router.get("/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[UserInDB, Depends(UserService.get_current_user_from_request)],
):
    return User(**current_user.model_dump(exclude={"hashed_password"}))
