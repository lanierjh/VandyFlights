from fastapi import FastAPI, HTTPException, status
from google.cloud import firestore
from core.schemas import UserCreate, FlightCreate, UserAuthenticate
from datetime import datetime
from core.security.util import hash_password, verify_password
from core.db import get_db

app = FastAPI()

db = get_db()


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
        "email": user.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    new_user_ref = users_ref.document()
    new_user_ref.set(new_user_data)

    return {"id": new_user_ref.id, **new_user_data}


def get_user_by_username_or_email(username: str, email: str):
    users_ref = db.collection("users")

    username_query = list(users_ref.where("username", "==", username).limit(1).stream())
    if username_query:
        return username_query[0].to_dict()

    email_query = list(users_ref.where("email", "==", email).limit(1).stream())
    if email_query:
        return email_query[0].to_dict()

    return None


def user_login(user: UserAuthenticate):
    users_ref = db.collection("users")
    user_query = list(users_ref.where("email", "==", user.email).limit(1).stream())

    if not user_query:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user_data = user_query[0].to_dict()
    if not verify_password(user.password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    return {"success": "User authenticated", "user": user_data}


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


