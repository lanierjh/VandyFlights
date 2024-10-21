from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import http.client

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://your-frontend-domain.com",  # Add any other domains here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Whether to allow cookies and credentials
    allow_methods=["*"],  # List of allowed HTTP methods (GET, POST, etc.). Use ["*"] to allow all methods
    allow_headers=["*"],  # List of allowed headers. Use ["*"] to allow all headers
)

conn = http.client.HTTPSConnection("tripadvisor16.p.rapidapi.com")

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/flights")
def show_flights():

    headers = {
    'x-rapidapi-key': "8f9d9710dcmsh46dbd3b58cf0e4bp139f74jsn1e7767cf4d9e",
    'x-rapidapi-host': "tripadvisor16.p.rapidapi.com"
    }
    
    start = "BNA"
    destination = "LAX" #placeholders for now
    flightType = "ONE_WAY"

    conn.request("GET", "/api/v1/flights/searchFlights?sourceAirportCode="+ start+"&destinationAirportCode="+ destination+"&date=2024-11-01&itineraryType="+flightType+"&sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&classOfService=ECONOMY&returnDate=2024-11-09&pageNumber=1&nearby=yes&nonstop=yes&currencyCode=USD&region=USA", headers=headers)

    res = conn.getresponse()
    data = res.read()
    return{data}

