from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# from sqlalchemy.orm import Session
# import crud
# import models
# import schemas
# from core import crud, models, schemas
from core.db import get_db
from core.routers import user, auth, flights
from core.security import util
app = FastAPI()

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(flights.router)
