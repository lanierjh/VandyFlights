from fastapi import FastAPI, HTTPException, status, APIRouter, Depends
from core import crud, schemas
from core.security import util
from core import models
router = APIRouter(tags=["user"])
@router.post("/register/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate):
    existing_username = crud.get_user_by_username_or_email(user.username)
    existing_email = crud.get_user_by_username_or_email(user.email)
    if existing_username or existing_email:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    new_user_data = crud.create_user(user)
    return new_user_data


@router.post("/users/send_friend_request", response_model=schemas.FriendRequestResponse)
def send_friend_request(request: schemas.FriendRequest, current_user: models.User = Depends(util.get_current_user)):
    try:
        print("Current user:", current_user['user'])
        crud.send_friend_request(requester_id=current_user['user'], friend_identifier=request.friend_identifier)
        return {"status": "pending", "requester_id": current_user['user'], "recipient_id": request.friend_identifier}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/users/accept_friend_request/{requester_username}")
def accept_friend_request(requester_username: str, current_user: models.User = Depends(util.get_current_user)):
    try:
        requester_id = crud.get_user_id_by_username_or_email(requester_username)
        reciptent_id = crud.get_user_id_by_username_or_email(current_user['user'])
        print(requester_username)
        print(requester_id)
        print(reciptent_id)
        if not requester_id:
            raise ValueError("Requester not found")
        print("Current user:", current_user['user'])
        crud.accept_friend_request(recipient_id=reciptent_id, requester_email=requester_username)
        return {"status": "accepted", "requester_id": requester_username, "recipient_id": current_user['user']}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/users/reject_friend_request/{requester_username}")
def reject_friend_request(requester_username: str, current_user: models.User = Depends(util.get_current_user)):
    try:
        reciptent_id = crud.get_user_id_by_username_or_email(current_user['user'])
        crud.reject_friend_request(recipient_id=reciptent_id, requester_email=requester_username)
        return {"status": "rejected", "requester_id": requester_username, "recipient_id": current_user.id}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
