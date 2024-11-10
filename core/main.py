# from fastapi import FastAPI, Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer

# from sqlalchemy.orm import Session
# import crud
# import models
# import schemas
# from core import crud, models, schemas
# from core.db import get_db
# from core.routers import user, auth, flights
# from core.security import util


from fastapi import FastAPI
from core.routers import user, auth, flights
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the routers with the app
app.include_router(user.router)
app.include_router(auth.router)  # Include the auth router
app.include_router(flights.router)