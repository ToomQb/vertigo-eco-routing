from fastapi import FastAPI

from routes import auth_routes, user_routes, route_routes

app = FastAPI()

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(route_routes.router, prefix="/routes", tags=["Routes"])



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3002)