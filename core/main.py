import os

import uvicorn
from fastapi import FastAPI
from routers import user, auth, flights
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_origins = ["https://vandyflights-backend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(auth.router)  # Include the auth router
app.include_router(flights.router)

