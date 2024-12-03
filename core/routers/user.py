from fastapi import FastAPI, HTTPException, status, APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from google.cloud import firestore
from core import crud, schemas
from core.crud import get_user_by_username_or_email, get_user_id_by_username_or_email
from core.security import util
from core.security.util import get_current_user
import core.models
from core.db import get_db
from pydantic import BaseModel

router = APIRouter(tags=["user"])
db = get_db()


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate):
    existing_username = crud.get_user_by_username_or_email(user.username)
    existing_email = crud.get_user_by_username_or_email(user.email)
    if existing_username or existing_email:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    new_user = crud.create_user(user)

    access_token_data = {
        "identifier": new_user["username"]  # Store the username or email
    }
    access_token = util.create_access_token(data=access_token_data)

    # Return the user data along with the access token
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    # return new_user_data


@router.post("/users/send_friend_request", response_model=schemas.FriendRequestResponse)
def send_friend_request(request: schemas.FriendRequest, current_user: models.User = Depends(util.get_current_user)):
    try:
        print(current_user)
        print(1,"Current user:", current_user['identifier'])
        print(request.friend_identifier)
        crud.send_friend_request(requester_id=current_user['identifier'], friend_identifier= request.friend_identifier)
        return {"status": "pending", "requester_id": current_user['identifier'], "recipient_id": request.friend_identifier}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/users/accept_friend_request/{requester_username}")
def accept_friend_request(requester_username: str, current_user: models.User = Depends(util.get_current_user)):
    try:
        requester_id = crud.get_user_id_by_username_or_email(requester_username)
        reciptent_id = crud.get_user_id_by_username_or_email(current_user['identifier'])
        if not requester_id:
            raise ValueError("Requester not found")
        print("Current user:", current_user['identifier'])
        crud.accept_friend_request(recipient_id=reciptent_id, requester_email=requester_username)
        return {"status": "accepted", "requester_id": requester_username, "recipient_id": current_user['identifier']}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/users/reject_friend_request/{requester_username}")
def reject_friend_request(requester_username: str, current_user: models.User = Depends(util.get_current_user)):
    try:
        # requester_id = crud.get_user_id_by_username_or_email(requester_username)
        reciptent_id = crud.get_user_id_by_username_or_email(current_user['identifier'])
        crud.reject_friend_request(recipient_id=reciptent_id, requester_email=requester_username)
        return {"status": "rejected", "requester_id": requester_username, "recipient_id": current_user['identifier']}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/pending_friend_requests", response_model=list[schemas.FriendRequestResponse])
def get_pending_friend_requests(current_user: models.User = Depends(util.get_current_user)):
    idNum = get_user_id_by_username_or_email(current_user['identifier'])
    return crud.get_pending_friend_requests(recipient_id= idNum)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
@router.get("/profile", response_model=schemas.UserProfile)
def get_profile(token: str = Depends(oauth2_scheme)):
    payload = util.verify_access_token(token)  # Your function to decode the JWT
    identifier = payload.get("identifier")
    if not identifier:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # Fetch user data based on the identifier
    user = crud.get_user_by_username_or_email(identifier)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

@router.put("/editprofile", response_model=schemas.UserProfile)
def edit_profile(
    profile_data: schemas.UserProfileUpdate,
    current_user: dict = Depends(util.get_current_user)
):
    user_email = current_user['identifier']
    print(f"Editing profile for user: {user_email}")
    print("janer")
    # Retrieve the user from the database
    user = crud.get_user_id_by_username_or_email(user_email)
    print("janey",user)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Prepare update data excluding email
    update_data = {key: value for key, value in profile_data.dict().items() if value is not None}

    if update_data:
        updated_user = crud.update_user_profile(user, update_data)
    else:
        updated_user = user

    return {
        "username": updated_user.get("username"),
        "first_name": updated_user.get("first_name"),
        "last_name": updated_user.get("last_name"),
        "email": updated_user.get("email")
    }
    
class UpdateFlightIDsRequest(BaseModel):
    flight_id: str  # Expect a single flight ID to be added to the list

@router.put("/users/updateFlightIDs")
def update_user_flight_ids(request: UpdateFlightIDsRequest, current_user: dict = Depends(get_current_user)):
    """
    Update the user's flight_ids by adding the selected flight destination.
    """
    user_identifier = current_user.get("identifier")
    
    user_identifier = current_user.get("identifier")
    if not user_identifier:
        raise HTTPException(status_code=400, detail="User identifier not found in token payload")

    # Query Firestore by email
    user_query = db.collection("users").where("email", "==", user_identifier).limit(1).get()

    if not user_query:
        print(f"Document not found for email: {user_identifier}")  # Debug log
        raise HTTPException(status_code=404, detail=f"User with email {user_identifier} not found")

    user_ref = user_query[0].reference  # Get the document reference

    # Update the flight_ids field
    user_ref.update({
        "flight_ids": firestore.ArrayUnion([request.flight_id])
    })

    return {"success": True, "message": f"Flight ID {request.flight_id} added successfully"}