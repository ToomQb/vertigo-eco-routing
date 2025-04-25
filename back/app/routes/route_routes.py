from fastapi import APIRouter, HTTPException
from app.config.security import ORS_API_KEY
from app.schemas.types import RouteRequest
import openrouteservice # sous licence Apache 2.0

router = APIRouter()

client = openrouteservice.Client(key=ORS_API_KEY)

@router.post("/calculate/")
def calculate_route(request: RouteRequest):
    """
    Calculates the route between two points and returns it in GeoJSON format.

    ### Parameters
    - `start`: Coordinates of the starting point (latitude, longitude).
    - `end`: Coordinates of the destination point (latitude, longitude).
    - `profile`: The routing profile to use.

    ### Available Profiles
    - 🚗 `driving-car` : Standard car routing  
    - 🚛 `driving-hgv` : Heavy goods vehicle routing  
    - 🚴 `cycling-regular` : Regular bicycle routing  
    - 🛣️ `cycling-road` : Road bicycle routing  
    - 🏔️ `cycling-mountain` : Mountain bicycle routing  
    - ⚡ `cycling-electric` : Electric bicycle routing  
    - 🚶 `foot-walking` : Pedestrian walking route  
    - 🥾 `foot-hiking` : Hiking route  
    - 🦽 `wheelchair` : Wheelchair route

    ### Returns
    - A GeoJSON object representing the calculated route.
    """
    try:
        route = client.directions(
            coordinates=[request.start, request.end],
            profile=request.transport_mode,
            format="geojson"
        )
        return route
    
    except openrouteservice.exceptions.ApiError as e:
        raise HTTPException(status_code=500, detail=f"OpenRouteService Error : {str(e)}")
    