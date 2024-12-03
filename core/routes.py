from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from core.db import get_db  # Ensure this imports your `get_db` function
from core.schemas import UserCreate, FlightCreate, UserResponse, UserAuthenticate
from core.crud import create_user, get_user_by_username_or_email, create_flight, \
    fetch_flight_details, user_login
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#
# @app.post("/register", response_model=UserResponse)  # Modify the response_model as needed
# def register_user(user: UserCreate):
#     return create_user(user)
#
# @app.post("/login")
# def login(user_data: UserAuthenticate):
#     return user_login(user_data)

# @app.get("/")
# def read_root(db: Session = Depends(get_db)):
#     return {"hello": db}
#
# @app.post("/register", response_model=UserResponse)  # Modify the response_model as needed
# def register_user(user: UserCreate, db: Session = Depends(get_db)):
#     return create_user(db, user)
#
# @app.post("/login")
# def login(user_data: UserAuthenticate, db: Session = Depends(get_db)):
#     return user_login(db,user_data)
#
# @app.post("/flights/", response_model=FlightCreate)  # Modify the response_model as needed
# def add_flight(flight_data: FlightCreate, db: Session = Depends(get_db)):
#     user = get_user_by_username_or_email(db, flight_data.username, flight_data.email)  # Modify as necessary
#     return create_flight(db, flight_data, user)