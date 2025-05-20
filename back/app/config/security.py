import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer

from pathlib import Path

env_path = Path(__file__).resolve().parents[3] / '.env'

load_dotenv(dotenv_path=env_path)

ORS_API_KEY = os.getenv("ORS_API_KEY", "default")
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
