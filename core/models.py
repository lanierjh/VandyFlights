from pydantic import BaseModel, Field
from typing import Optional, List

class User(BaseModel):
    username: str
    email: str
    hashed_password: str
    is_active: bool = True

class Flight(BaseModel):
    flight_number: str
    departure: str
    arrival: str
    departure_time: str
    arrival_time: str
    price: int
    user_id: Optional[str]