from typing import Union, Optional, List, Dict
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import http.client
import json
import os
import logging 
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = http.client.HTTPSConnection("tripadvisor16.p.rapidapi.com")

class FlightRequest(BaseModel):
    origin: str
    destination: str
    departureDate: str
    returnDate: Optional[str] = None
    roundTrip: bool

# Configure logging to display debug messages
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.get("/")
def read_root():
    return {"Dummy values": "For required root route"}

@app.post("/flightsONEWAY")
async def show_flightsONE_WAY(flight_request: FlightRequest):
    logger.debug(f"Received FlightRequest: {flight_request}")
    if not flight_request.destination or not flight_request.departureDate:
        raise HTTPException(status_code=400, detail="Destination and departure date are required.")

    headers = {
        'x-rapidapi-key': "8f9d9710dcmsh46dbd3b58cf0e4bp139f74jsn1e7767cf4d9e",
        'x-rapidapi-host': "tripadvisor16.p.rapidapi.com"
    }

    start = flight_request.origin
    destination = flight_request.destination
    departure_date = flight_request.departureDate
    return_date = flight_request.returnDate
    flight_type = "ONE_WAY" #if flight_request.roundTrip else "ONE_WAY"

    request_path = (
        f"/api/v1/flights/searchFlights?"
        f"sourceAirportCode={start}&destinationAirportCode={destination}"
        f"&date={departure_date}&itineraryType={flight_type}&"
        f"sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&"
        "classOfService=ECONOMY&pageNumber=1&nearby=yes&nonstop=yes&"
        "currencyCode=USD&region=USA"
    )

    try:
        conn.request("GET", request_path, headers=headers)
        res = conn.getresponse()
        data = res.read()
        print(request_path)
        logger.debug(f"Raw API Response: {data}")  # Log raw data for debugging


        final_data = json.loads(data.decode("utf-8"))
        flights = []

        if "flights" in final_data.get("data", {}):
            for flight in final_data["data"]["flights"]:
                for segment in flight["segments"]:
                    for leg in segment["legs"]:
                        flight_info = {
                            "origin": leg["originStationCode"],
                            "destination": leg["destinationStationCode"],
                            "departureDateTime": leg["departureDateTime"],
                            "arrivalDateTime": leg["arrivalDateTime"],
                            "carrier": leg["marketingCarrier"]["displayName"],
                            "flightNumber": str(leg["flightNumber"]),
                        }
                        for link in flight.get("purchaseLinks", []):
                            flight_info["url"] = link["url"]
                            flight_info["price"] = str(link.get("totalPricePerPassenger", "Variable")) 
                        flights.append(flight_info)

        if not flights:
            raise HTTPException(status_code=404, detail="No flights found.")

    except json.JSONDecodeError as json_error:
        raise HTTPException(status_code=500, detail=f"Error decoding JSON: {str(json_error)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"start": start, "destination": destination, "flights": flights}


@app.post("/flightsROUNDTRIP")
async def show_flightsROUND_TRIP(flight_request: FlightRequest):
    logger.debug(f"Received FlightRequest: {flight_request}")
    if not flight_request.destination or not flight_request.departureDate:
        raise HTTPException(status_code=400, detail="Destination and departure date are required.")

    headers = {
        'x-rapidapi-key': "8f9d9710dcmsh46dbd3b58cf0e4bp139f74jsn1e7767cf4d9e",
        'x-rapidapi-host': "tripadvisor16.p.rapidapi.com"
    }

    start = flight_request.origin
    destination = flight_request.destination
    departure_date = flight_request.departureDate
    return_date = flight_request.returnDate
    flight_type = "ROUND_TRIP" #if flight_request.roundTrip else "ONE_WAY"

    request_path = (
        f"/api/v1/flights/searchFlights?"
        f"sourceAirportCode=BNA&"
        f"destinationAirportCode={destination}&"
        f"date={departure_date}&"
        f"itineraryType={flight_type}&"
        "sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&"
        f"classOfService=ECONOMY&returnDate={return_date}&pageNumber=1&nearby=yes&nonstop=yes&"
        "currencyCode=USD&region=USA"
    )

    try:
        conn.request("GET", request_path, headers=headers)
        res = conn.getresponse()
        data = res.read()

        final_data = json.loads(data.decode("utf-8"))
        flights = []

        if "flights" in final_data.get("data", {}):
            for flight in final_data["data"]["flights"]:
                for segment in flight["segments"]:
                    for leg in segment["legs"]:
                        flight_info = {
                            "origin": leg["originStationCode"],
                            "destination": leg["destinationStationCode"],
                            "departureDateTime": leg["departureDateTime"],
                            "arrivalDateTime": leg["arrivalDateTime"],
                            "carrier": leg["marketingCarrier"]["displayName"],
                            "flightNumber": str(leg["flightNumber"]),
                        }
                        for link in flight.get("purchaseLinks", []):
                            flight_info["url"] = link["url"]
                            flight_info["price"] = str(link.get("totalPricePerPassenger", "Variable")) 
                        flights.append(flight_info)

        if not flights:
            raise HTTPException(status_code=404, detail="No flights found.")

    except json.JSONDecodeError as json_error:
        raise HTTPException(status_code=500, detail=f"Error decoding JSON: {str(json_error)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"start": start, "destination": destination, "flights": flights}
