from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os
from dotenv import load_dotenv

from pathlib import Path

env_path = Path(__file__).resolve().parents[3] / '.env'

load_dotenv(dotenv_path=env_path)

database_username = os.getenv("POSTGRES_USER", "postgres")
database_password = os.getenv("POSTGRES_PASSWORD", "mysecretpassword")
database_ip = os.getenv("POSTGRES_HOST", "localhost")
database_name = os.getenv("POSTGRES_DB", "mif10")
database_port = int(os.getenv("POSTGRES_PORT", "5432"))

DATABASE_URL = f"postgresql+psycopg2://{database_username}:{database_password}@{database_ip}:{database_port}/{database_name}"

engine = create_engine(DATABASE_URL, pool_size=100)

Session = sessionmaker(bind=engine)

Base = declarative_base()

def get_db():
    with Session() as db:
        yield db