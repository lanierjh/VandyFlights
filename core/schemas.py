from pydantic import BaseModel, EmailStr, validator
import re
from datetime import date,time

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserAuthenticate(BaseModel):
    email: EmailStr
    password: str


class FlightCreate(BaseModel):
    flight_number: str
    departure: date #str?
    arrival: date #str?
    departure_time: time
    arrival_time: time
    price: int

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str


