from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv

# Charger les variables depuis le fichier .env
load_dotenv()

database_username = os.getenv("DATABASE_USERNAME", "postgres")
database_password = os.getenv("DATABASE_PASSWORD", "mysecretpassword")
database_ip = os.getenv("DATABASE_IP", "localhost")
database_name = os.getenv("DATABASE_NAME", "mif10")
database_port = int(os.getenv("DATABASE_PORT", "5432"))

DATABASE_URL = (
    f"postgresql+psycopg2://{database_username}:{database_password}"
    f"@{database_ip}:{database_port}/{database_name}"
)

engine = create_engine(DATABASE_URL, pool_size=100)

Session = sessionmaker(bind=engine)

Base = declarative_base()

def get_db():
    with Session() as db:
        yield db