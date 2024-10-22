from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from .. import crud, models,schemas
from .. db import get_db, engine
# from .. db import engine, get_db

# models.Base.metadata.create_all(bind=engine)

router = APIRouter()

@router.post("/register/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username_or_email(db, user.username, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    new_user = crud.create_user(db, user)
    return new_user