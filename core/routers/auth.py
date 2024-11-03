from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from .. security import util
from .. import crud, models,schemas
from .. db import get_db, engine

router = APIRouter(tags=["auth"])

@router.post("/login")
def login(user_cerd: schemas.UserLogin, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.email == user_cerd.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")
    if not util.verify_password(user_cerd.password,user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")

    return "success"

