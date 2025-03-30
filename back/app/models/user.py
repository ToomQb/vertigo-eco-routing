from sqlalchemy import (
    Column,
    String
)
from config.database import Base

class User(Base):
    __tablename__ = "user"
    username = Column(String, primary_key=True)
    hashed_password = Column(String, nullable=False)
    email = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
