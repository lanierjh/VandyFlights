from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
# import crud
# import models
# import schemas
from core import crud, models, schemas
from core.db import engine, get_db
from core.routes import user, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
# app.include_router(post.router)
app.include_router(user.router)
app.include_router(auth.router)