from fastapi import FastAPI, HTTPException, status
from google.cloud import firestore
from core.schemas import UserCreate, FlightCreate, UserAuthenticate
from datetime import datetime
from core.security.util import hash_password, verify_password
from core.db import get_db

app = FastAPI()

db = get_db()

def user_login(user: UserAuthenticate):
    existing_user = get_user_by_username_or_email(user.identifier)
    if not existing_user or not verify_password(user.password, existing_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    else:
        return {"success": "User authenticated", "user": user}

def create_user(user: UserCreate):
    users_ref = db.collection("users")
    existing_user_by_username = list(users_ref.where("username", "==", user.username).limit(1).stream())
    if existing_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    existing_user_by_email = list(users_ref.where("email", "==", user.email).limit(1).stream())
    if existing_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )

    hashed_password = hash_password(user.password)
    new_user_data = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    new_user_ref = users_ref.document()
    new_user_ref.set(new_user_data)

    return {"id": new_user_ref.id, **new_user_data}

def get_user_by_username_or_email(identifier: str):
    users_ref = db.collection("users")

    username_query = users_ref.where("username", "==", identifier).limit(1).get()
    if username_query:
        return username_query[0].to_dict()


    email_query = users_ref.where("email", "==", identifier).limit(1).get()

    if email_query:
        return email_query[0].to_dict()

    return None


def create_flight(flight_data: FlightCreate, user_id: str):
    flight_ref = db.collection("users").document(user_id).collection("flights").document()
    new_flight_data = {
        "flight_number": flight_data.flight_number,
        "departure": flight_data.departure,
        "arrival": flight_data.arrival,
        "departure_time": flight_data.departure_time,
        "arrival_time": flight_data.arrival_time,
        "price": flight_data.price,
        "purchase_time": datetime.utcnow()
    }
    flight_ref.set(new_flight_data)
    return new_flight_data


def fetch_flight_details(query: str):
    import requests
    url = "https://sky-scanner3.p.rapidapi.com/flights/auto-complete"
    headers = {
        "x-rapidapi-key": "your-rapidapi-key",
        "x-rapidapi-host": "sky-scanner3.p.rapidapi.com"
    }
    params = {"query": query}

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        result = data['results']
        return result
    else:
        raise Exception("Failed to fetch flight details")


from google.cloud import firestore


def get_user_id_by_username_or_email(identifier: str):
    # Search by username or email in the "users" collection
    users_ref = db.collection("users")

    # Look up by username
    query = users_ref.where("username", "==", identifier).limit(1).get()
    if not query:
        # If not found by username, look up by email
        query = users_ref.where("email", "==", identifier).limit(1).get()

    if query:
        return query[0].id  # Return the document ID (user ID)
    else:
        return None  # User not found


from google.cloud import firestore



def send_friend_request(requester_id: str, friend_identifier: str):
    friend_id = get_user_id_by_username_or_email(friend_identifier)
    print(friend_id)
    if not friend_id:
        raise ValueError("User not found")

    recipient_requests_ref = db.collection("users").document(friend_id).collection("friend_requests")

    existing_request = recipient_requests_ref.where("requester_id", "==", requester_id).where("status", "==",
                                                                                              "pending").get()
    if existing_request:
        raise ValueError("Friend request already sent")

    recipient_requests_ref.add({
        "requester_id": requester_id,
        "status": "pending"
    })


# def accept_friend_request(recipient_id: str, requester_id: str):
#     recipient_requests_ref = db.collection("users").document(recipient_id).collection("friend_requests")
#     request_query = recipient_requests_ref.where("requester_id", "==", requester_id).where("status", "==",
#                                                                                            "pending").limit(1).get()
#     if not request_query:
#         raise ValueError("Friend request not found or already processed")
#
#     request = request_query[0]
#     request.reference.update({"status": "accepted"})
#
#     # Add each other as friends
#     recipient_ref = db.collection("users").document(recipient_id)
#     requester_ref = db.collection("users").document(requester_id)
#     recipient_ref.update({"friends": firestore.ArrayUnion([requester_id])})
#     requester_ref.update({"friends": firestore.ArrayUnion([recipient_id])})

def accept_friend_request(recipient_id: str, requester_email: str):
    # Get the requester ID from their email
    requester_id = get_user_id_by_username_or_email(requester_email)
    if not requester_id:
        raise ValueError("Requester not found")

    recipient_requests_ref = db.collection("users").document(recipient_id).collection("friend_requests")
    request_query = recipient_requests_ref.where("requester_id", "==", requester_email).where("status", "==",
                                                                                              "pending").limit(1).get()

    if not request_query:
        raise ValueError("Friend request not found or already processed")

    request = request_query[0]
    request.reference.update({"status": "accepted"})

    recipient_ref = db.collection("users").document(recipient_id)
    requester_ref = db.collection("users").document(requester_id)
    recipient_ref.update({"friends": firestore.ArrayUnion([requester_id])})
    requester_ref.update({"friends": firestore.ArrayUnion([recipient_id])})


def reject_friend_request(recipient_id: str, requester_email: str):
    requester_id = get_user_id_by_username_or_email(requester_email)

    if not requester_id:
        raise ValueError("Requester not found")

    recipient_requests_ref = db.collection("users").document(recipient_id).collection("friend_requests")
    request_query = recipient_requests_ref.where("requester_id", "==", requester_email).where("status", "==", "pending").limit(1).get()

    if not request_query:
        raise ValueError("Friend request not found or already processed")

    request = request_query[0]
    request.reference.update({"status": "rejected"})

def remove_friend(user_id: str, friend_id: str):
    user_ref = db.collection("users").document(user_id)
    user = user_ref.get().to_dict()

    if friend_id in user.get("friends", []):
        user_ref.update({"friends": firestore.ArrayRemove([friend_id])})



def get_pending_friend_requests(recipient_id: str):
    recipient_requests_ref = db.collection("users").document(recipient_id).collection("friend_requests")
    pending_requests = recipient_requests_ref.where("status", "==", "pending").get()

    requests_data = []
    for request in pending_requests:
        request_data = request.to_dict()
        requests_data.append({
            "requester_email": request_data["requester_id"],
            "requester_username": request_data.get("requester_username", "Unknown")
        })
    return requests_data

def get_user_by_id(user_id: str):
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()
    if user_doc.exists:
        return user_doc.to_dict()  # Returns the entire user document as a dictionary
    return None

def update_user_profile(user_id: str, update_data: dict):
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return None

    user_ref.update(update_data)

    updated_user = user_ref.get().to_dict()
    return updated_user