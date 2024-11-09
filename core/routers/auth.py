from fastapi import APIRouter, HTTPException, Depends, status
from google.cloud import firestore
from fastapi.security import OAuth2PasswordRequestForm
from core import schemas
from core.db import get_db
from core.security import util
db = get_db()
router = APIRouter(tags=["auth"])

# @router.post("/login", response_model = schemas.Token)
# def login(user_cred: schemas.UserLogin):
#     # Query Firestore to find the user by email
#     users_ref = db.collection("users").where("email", "==", user_cred.email).limit(1)
#     docs = users_ref.stream()
#
#     user = None
#     for doc in docs:
#         user = doc.to_dict()  # Retrieve the user data as a dictionary
#
#     # Check if user exists
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials"
#         )
#
#     # Verify the password
#     if not util.verify_password(user_cred.password, user["hashed_password"]):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
#         )
#
#     # Create a JWT token
#     access_token = util.create_access_token(data={"user": user["email"]})
#     return {"access_token": access_token, "token_type": "bearer"}
#
#
# from fastapi import Depends, HTTPException, status

@router.post("/login", response_model=schemas.Token)
def login(user_cred: OAuth2PasswordRequestForm = Depends()):
    email = user_cred.username
    password = user_cred.password

    users_ref = db.collection("users").where("email", "==", email).limit(1)
    docs = users_ref.stream()

    user = None
    for doc in docs:
        user = doc.to_dict()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials"
        )

    if not util.verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = util.create_access_token(data={"user": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

#
# @router.post("/login", response_model=schemas.Token)
# def login(user_cred: OAuth2PasswordRequestForm = Depends()):
#     # Get the input provided by the user (could be either email or username)
#     user_input = user_cred.username  # OAuth2PasswordRequestForm uses "username" field for input
#     password = user_cred.password
#
#     # Use regex to check if the input is an email
#     is_email = re.match(r"[^@]+@[^@]+\.[^@]+", user_input)
#
#     # Query Firestore to find the user by email or username
#     users_ref = db.collection("users")
#     if is_email:
#         # Search by email
#         user_query = users_ref.where("email", "==", user_input).limit(1).stream()
#     else:
#         # Search by username
#         user_query = users_ref.where("username", "==", user_input).limit(1).stream()
#
#     user = None
#     for doc in user_query:
#         user = doc.to_dict()  # Retrieve the user data as a dictionary
#
#     # Check if user exists
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials"
#         )
#
#     if not util.verify_password(password, user["hashed_password"]):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
#         )
#
#     access_token = util.create_access_token(data={
#         "username": user["username"],
#         "email": user["email"]
#     })
#     return {"access_token": access_token, "token_type": "bearer"}