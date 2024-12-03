from pydantic import BaseModel, Field
from typing import Optional, List

class User(BaseModel):
    id : str
    username: str
    first_name: str
    last_name: str
    email: str
    hashed_password: str
    is_active: bool = True
    friends : List[str]  = []
    flights : List[str] = []

class Flight(BaseModel):
    #flight_number: str
    departure: str
    arrival: str
    departure_time: str
    arrival_time: str
    price: str
    user_id: Optional[str]