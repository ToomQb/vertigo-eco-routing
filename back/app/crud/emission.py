from app.models.emission import Emission
from app.config.database import get_db
from sqlalchemy.orm import Session

class EmissionCRUD:
    def __init__(self) -> None:
        self.db: Session = next(get_db())
        
    def get_emission_co2(self, transport_mode: str) -> float | None:
        result: Emission = self.db.get(Emission, transport_mode)
        if result:
            return result.emission_per_km
        return None
        