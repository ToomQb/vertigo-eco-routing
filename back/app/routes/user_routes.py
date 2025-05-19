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

@router.get("/me/", status_code=200)
async def read_users_me(request: Request):
    token = request.cookies.get("access_token")
    data = SecurityService.decode_access_token(token)

    uvicorn_logger.info(data)
    return {"data": data}
