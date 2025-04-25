from fastapi import FastAPI

from app.routes import auth_routes, user_routes, route_routes

app = FastAPI()

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(route_routes.router, prefix="/routes", tags=["Routes"])

@app.get("/", status_code=200)
def isUp():
    return True;
