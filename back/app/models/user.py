from sqlalchemy import (
    Column,
    String
)
from app.config.database import Base

class User(Base):
    __tablename__ = "user"
    email = Column(String, primary_key=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
