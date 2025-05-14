from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth_routes, user_routes, route_routes

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend
    allow_credentials=True,
    allow_methods=["*"],  # Enables all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(route_routes.router, prefix="/routes", tags=["Routes"])

@app.get("/", status_code=200)
def isUp():
    return True;
