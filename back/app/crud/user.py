from schemas.types import UserInDB
from models.user import User as UserTable
from config.database import get_db
from sqlalchemy.orm import Session

class UserCRUD:
    def __init__(self) -> None:
        self.db: Session = next(get_db())
        
    def get_user(self, username: str) -> UserInDB | None:
        result = self.db.get(UserTable, username)
        if result:
            return UserInDB.model_validate(result.__dict__)
        return None
    
    def create_user(self, user: UserInDB):
        new_user = UserTable(**user.model_dump())
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user
        