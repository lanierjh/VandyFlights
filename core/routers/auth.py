# from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
# from sqlalchemy.orm import Session
# from .. security import util
# from .. import crud, models,schemas
# from .. db import get_db
#
# router = APIRouter(tags=["auth"])
#
# @router.post("/login")
# def login(user_cerd: schemas.UserLogin, db: Session = Depends(get_db)):
#
#     user = db.query(models.User).filter(models.User.email == user_cerd.email).first()
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")
#     if not util.verify_password(user_cerd.password,user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")
#
#     return "success"
#

from fastapi import APIRouter, HTTPException, Depends, status
from google.cloud import firestore
from core import schemas
from core.security import util
from core.db import get_db
db = get_db()
router = APIRouter()

@router.post("/login")
def login(user_cred: schemas.UserLogin):
    # Query Firestore to find the user by email
    users_ref = db.collection("users").where("email", "==", user_cred.email).limit(1)
    docs = users_ref.stream()

    user = None
    for doc in docs:
        user = doc.to_dict()  # Retrieve the user data as a dictionary

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")

    # Verify the password using your utility function
    if not util.verify_password(user_cred.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")

    return "success"