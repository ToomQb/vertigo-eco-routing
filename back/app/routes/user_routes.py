from fastapi import APIRouter, Depends
from app.services.user_service import UserService
from app.schemas.types import UserRegister, UserInDB, User
from typing import Annotated

router = APIRouter()

@router.post("", response_model=UserInDB, status_code=201)
def create_user(user: UserRegister):
    return UserService.create_user(user)

@router.get("/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[UserInDB, Depends(UserService.get_current_user)],
):
    return User(**current_user.model_dump(exclude={"hashed_password"}))
