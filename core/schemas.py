from pydantic import BaseModel, EmailStr, validator
import re
from datetime import date,time

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @validator('email')
    def validate_vanderbilt_email(cls, value):
        if not value.endswith('@vanderbilt.edu'):
            raise ValueError('Email must end with @vanderbilt.edu')
        return value

    @validator('password')
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', value):
            raise ValueError('Password must contain at least one capital letter')
        if not re.search(r'[\W_]', value):
            raise ValueError('Password must contain at least one special character')
        return value




class FlightCreate(BaseModel):
    flight_number: str
    departure: date #str?
    arrival: date #str?
    departure_time: time
    arrival_time: time
    price: int

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True