import os

import uvicorn
from fastapi import FastAPI
from core.routers import user, auth, flights, app
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(auth.router)  # Include the auth router
app.include_router(flights.router)