from fastapi import FastAPI, HTTPException, status, APIRouter
from core import crud, schemas

router = APIRouter()


@router.post("/register/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate):
    # Check if a user with the given username or email already exists
    existing_user = crud.get_user_by_username_or_email(user.username, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    # Create the new user
    new_user_data = crud.create_user(user)

    # Return the new user data with the ID
    return {
        "id": new_user_data["id"],
        "username": new_user_data["username"],
        "email": new_user_data["email"],
        "created_at": new_user_data["created_at"]
    }