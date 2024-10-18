from fastapi import FastAPI, requests, HTTPException, status

from sqlalchemy.orm import Session


from core.models import User, Flight
from core.schemas import UserCreate, FlightCreate, UserAuthenticate
from datetime import date,time, datetime

from core.security.util import hash_password, verify_password

app = FastAPI()

def create_user(db: Session, user: UserCreate):
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )

    hashed_password = hash_password(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username_or_email(db: Session, username: str, email: str):
    return db.query(User).filter((User.username == username) | (User.email == email)).first()

def user_login(db:Session, user = UserAuthenticate):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user or not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    return {"success": "User authenticated", "user": existing_user}

def create_flight(db: Session, flight_data: FlightCreate, user: User):
    new_flight = Flight(
        flight_number=flight_data.flight_number,
        departure=flight_data.departure,
        arrival=flight_data.arrival,
        departure_time=flight_data.departure_time,
        arrival_time=flight_data.arrival_time,
        price=flight_data.price,
        user=user,
        purchase_time=datetime.utcnow()
    )
    db.add(new_flight)
    db.commit()
    db.refresh(new_flight)
    return new_flight


def fetch_flight_details(query: str):
    url = "https://sky-scanner3.p.rapidapi.com/flights/auto-complete"
    headers = {
        "x-rapidapi-key": "your-rapidapi-key",
        "x-rapidapi-host": "sky-scanner3.p.rapidapi.com"
    }

    params = {"query": query}

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        # Extract relevant details (based on API response structure)
        result = data['results']  # This assumes your API returns results in a field 'results'

        # You can refine the data extraction as per your API's response structure
        return result
    else:
        raise Exception("Failed to fetch flight details")