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
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr

class UserProfileUpdate(BaseModel):
    first_name: str
    last_name: str

class UserProfile(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr


class UserProfileUpdate(BaseModel):
    first_name: str
    last_name: str


class UserAuthenticate(BaseModel):
    username: str
    password: str




class FlightCreate(BaseModel):
    flight_number: str
    start: str
    destination: str
    departure: str #str?
    arrival: str #str?
    departure_time: str
    arrival_time: str
    price: str

class FriendRequest(BaseModel):
    friend_identifier: str

class FlightResponse(BaseModel):
    success: bool
    flight: FlightCreate


class Token(BaseModel):
    access_token: str
    token_type: str


class FriendRequest(BaseModel):
    friend_identifier: str


class FriendRequestResponse(BaseModel):
    requester_id: str
    recipient_id: str
    status: str