from typing import Union

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import re
import requests
import pydantic

import http.client

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8001",
    "http://localhost:3000",  # Add any other domains here
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

@app.get("/flights/origin=BNA&destination={destination}&departureDate={departureDate}&roundTrip={roundTrip}")
async def show_flightsONEWAY(request: Request, destination: str, departureDate: str, roundTrip: str):
    
    #params = request.query_params
    #origin = params.get("origin", "BNA")  # Default to "BNA" if not provided
    #destination = params.get("destination", "LAX")  # Default to "LAX" if not provided
    #departure_date = params.get("departureDate", "2024-11-09")  # Default date
    #round_trip = params.get("roundTrip", "ONE_WAY")  # Default to "ONE_WAY"
    
    headers = {
    'x-rapidapi-key': "8f9d9710dcmsh46dbd3b58cf0e4bp139f74jsn1e7767cf4d9e",
    'x-rapidapi-host': "tripadvisor16.p.rapidapi.com"
    }
    
    roundTrip = 'ONE_WAY' #Placeholder
    
    url = (
        f"/api/v1/flights/searchFlights?"
        f"sourceAirportCode=BNA&"
        f"destinationAirportCode={destination}&"
        f"date={departureDate}&"
        f"itineraryType={roundTrip}&"
        "sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&"
        "classOfService=ECONOMY&pageNumber=1&nearby=yes&nonstop=yes&"
        "currencyCode=USD&region=USA"
    )

    conn.request("GET", url, headers=headers)

    res = conn.getresponse()
    data = res.read()
    
    finalData = data.decode("utf-8")
    
    output = f"BNA to {destination} results: "
    
    urls = re.findall(r'"url":"(.*?)"', finalData)

    index = 0
    # Print and return the results
    while(index<len(urls)):
        last_index = urls[index].rfind("=")
        price = urls[index][last_index+1:]
        if(price == "0"):
            price = "Variable"
        print(f"PRICE PER PASSENGER: {price}, URL: {urls[index]}")
        output += "PRICE PER PASSENGER: " + price + ", URL: " +urls[index] + "\n"
        index += 1
    

    return{output}


@app.get("/flights/origin=BNA&destination={destination}&departureDate={departureDate}&returnDate={returnDate}&roundTrip={roundTrip}")
async def show_flightsROUND(request: Request, destination: str, departureDate: str, returnDate: str, roundTrip: str):
    
    #params = request.query_params
    #origin = params.get("origin", "BNA")  # Default to "BNA" if not provided
    #destination = params.get("destination", "LAX")  # Default to "LAX" if not provided
    #departure_date = params.get("departureDate", "2024-11-09")  # Default date
    #round_trip = params.get("roundTrip", "ONE_WAY")  # Default to "ONE_WAY"
    
    headers = {
    'x-rapidapi-key': "8f9d9710dcmsh46dbd3b58cf0e4bp139f74jsn1e7767cf4d9e",
    'x-rapidapi-host': "tripadvisor16.p.rapidapi.com"
    }
    
    roundTrip = 'ROUND_TRIP' #Placeholder
    
    url = (
        f"/api/v1/flights/searchFlights?"
        f"sourceAirportCode=BNA&"
        f"destinationAirportCode={destination}&"
        f"date={departureDate}&"
        f"itineraryType={roundTrip}&"
        "sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&"
        f"classOfService=ECONOMY&returnDate={returnDate}&pageNumber=1&nearby=yes&nonstop=yes&"
        "currencyCode=USD&region=USA"
    )

    conn.request("GET", url, headers=headers)

    res = conn.getresponse()
    data = res.read()
    
    finalData = data.decode("utf-8")
    
    output = f"BNA to {destination} results: "
    
    urls = re.findall(r'"url":"(.*?)"', finalData)

    index = 0
    # Print and return the results
    while(index<len(urls)):
        last_index = urls[index].rfind("=")
        price = urls[index][last_index+1:]
        if(price == "0"):
            price = "Variable"
        print(f"PRICE PER PASSENGER: {price}, URL: {urls[index]}")
        output += "PRICE PER PASSENGER: " + price + ", URL: " +urls[index] + "\n"
        index += 1
    

    return{output}

