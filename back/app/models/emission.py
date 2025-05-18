from sqlalchemy import (
    Column,
    String,
    DECIMAL
)
from app.config.database import Base

class Emission(Base):
    __tablename__ = "emission"
    transport_mode = Column(String, primary_key=True)
    emission_per_km = Column(DECIMAL, nullable=False)
