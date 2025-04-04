from pydantic import BaseModel
from typing import Optional, Literal


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str



class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None

class UserInDB(User):
    hashed_password: str
    
class UserRegister(User):
    password: str
    
    
    
class RouteRequest(BaseModel):
    start: tuple[float, float]  # (longitude, latitude)
    end: tuple[float, float]    # (longitude, latitude)
    transport_mode: Literal[
        "driving-car", "driving-hgv", "cycling-regular", 
        "cycling-road", "cycling-mountain", "cycling-electric", 
        "foot-walking", "foot-hiking", "wheelchair"
    ]