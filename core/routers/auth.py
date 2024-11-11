import jwt
import redis
from fastapi import APIRouter, HTTPException, Depends, status
from google.cloud import firestore
from fastapi.security import OAuth2PasswordRequestForm
from core import crud, schemas
from core.db import get_db
from core.security import util
from datetime import timedelta, time

db = get_db()
router = APIRouter(tags=["auth"])

@router.post("/login", response_model=schemas.Token)
def login(user_cred: OAuth2PasswordRequestForm = Depends()):
    identifier = user_cred.username  # This can be either username or email
    password = user_cred.password

    # Use the helper function to get the user by username or email
    user = crud.get_user_by_username_or_email(identifier)

    # Check if user was found
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials"
        )

    # Verify the password
    if not util.verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token_data = {
        "identifier": identifier  # This will store either username or email
    }

    # Optionally, add a type field if you need to know the identifier type later
    if "@" in identifier:
        access_token_data["type"] = "email"
    else:
        access_token_data["type"] = "username"

    access_token = util.create_access_token(data=access_token_data)
    return {"access_token": access_token, "token_type": "bearer"}

    # email = user_cred.username
    # password = user_cred.password
    #
    # users_ref = db.collection("users").where("email", "==", email).limit(1)
    # docs = users_ref.stream()
    #
    # user = None
    # for doc in docs:
    #     user = doc.to_dict()
    #
    # if not user:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials"
    #     )
    #
    # if not util.verify_password(password, user["hashed_password"]):
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
    #     )
    #
    # access_token = util.create_access_token(data={"user": user["email"]})
    # return {"access_token": access_token, "token_type": "bearer"}


# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)  # Set up Redis client

# @router.post("/logout")
# def logout(current_user: str = Depends(util.get_current_user)):
#     try:
#         token = current_user['token']
#         decoded_token = jwt.decode(token, util.SECRET_KEY, algorithms=[util.ALGORITHM])
#         expiration = decoded_token.get("exp")
#         redis_client.setex(token, timedelta(seconds=expiration - int(time.time())), "blacklisted")
#     except Exception:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
#     return {"msg": "Successfully logged out"}

