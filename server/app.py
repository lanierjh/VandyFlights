from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import http.client
import json
import logging
from datetime import datetime

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

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def extract_flight_info(flight):
    # This function handles multi-leg flights with layovers in a consolidated format
    flights = []
    for segment in flight["segments"]:
        # Initialize flight info for multi-leg journeys
        flight_info = {
            "legs": [],  # Store individual legs
            "layovers": [],  # Store layover details
            "price": "Price not available",
            "url": "URL not available"
        }

        # Process each leg of the flight
        for leg in segment["legs"]:
            leg_info = {
                "origin": leg["originStationCode"],
                "destination": leg["destinationStationCode"],
                "departureDateTime": leg["departureDateTime"],
                "arrivalDateTime": leg["arrivalDateTime"],
                "carrier": leg["marketingCarrier"]["displayName"],
                "flightNumber": str(leg["flightNumber"]),
                "logo": leg["marketingCarrier"].get("logoUrl", "Logo not available"),
                "stops": leg.get("numStops", 0),
                "distanceInKM": leg.get("distanceInKM", "N/A"),
                "classOfService": leg.get("classOfService", "N/A"),
                "equipmentId": leg.get("equipmentId", "N/A")
            }
            flight_info["legs"].append(leg_info)

        # Process layovers if available
        if "layovers" in segment:
            for layover in segment["layovers"]:
                layover_info = {
                    "durationInMinutes": layover.get("durationInMinutes"),
                    "hasStationChange": layover.get("hasStationChange", False),
                    "durationType": layover.get("durationType", "NORMAL"),
                }
                flight_info["layovers"].append(layover_info)

        # Extract purchase links with price and URL if available
        if "purchaseLinks" in flight:
            for link in flight["purchaseLinks"]:
                price = link.get("totalPricePerPassenger")
                flight_info["price"] = str(price) if price and price > 0 else "Price not available"
                flight_info["url"] = link["url"]

        flights.append(flight_info)
    return flights

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
    flight_type = "ONE_WAY"
    page_number = 1
    flights = []

    while len(flights) < 50:  # Fetch until we have at least 50 flights
        request_path = (
            f"/api/v1/flights/searchFlights?sourceAirportCode={start}&"
            f"destinationAirportCode={destination}&date={departure_date}&"
            f"itineraryType={flight_type}&sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&"
            f"classOfService=ECONOMY&pageNumber={page_number}&nearby=yes&nonstop=no&currencyCode=USD&region=USA"
        )

        try:
            conn.request("GET", request_path, headers=headers)
            res = conn.getresponse()
            data = res.read()
            final_data = json.loads(data.decode("utf-8"))

            if "flights" in final_data.get("data", {}):
                for flight in final_data["data"]["flights"]:
                    flights.extend(extract_flight_info(flight))
                    if len(flights) >= 50:
                        break

            if not final_data.get("data", {}).get("flights"):
                break  # No more flights

            page_number += 1  # Next page
            
        except json.JSONDecodeError as json_error:
            raise HTTPException(status_code=500, detail=f"Error decoding JSON: {str(json_error)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Adjusted return structure for consistency
    return {
        "start": start,
        "destination": destination,
        "flights": flights[:50]  # Key should match the expected format in the component
    }

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
    flight_type = "ROUND_TRIP"
    page_number = 1
    outbound_flights = []
    return_flights = []

    # Loop to fetch both outbound and return flights until we have at least 100 flights or exhaust results
    while len(outbound_flights) + len(return_flights) < 50:
        request_path = (
            f"/api/v1/flights/searchFlights?sourceAirportCode={start}&"
            f"destinationAirportCode={destination}&date={departure_date}&"
            f"itineraryType={flight_type}&sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&"
            f"classOfService=ECONOMY&returnDate={return_date}&pageNumber={page_number}&nearby=yes&nonstop=no&"
            "currencyCode=USD&region=USA"
        )

        try:
            conn.request("GET", request_path, headers=headers)
            res = conn.getresponse()
            data = res.read()
            final_data = json.loads(data.decode("utf-8"))

            if "flights" in final_data.get("data", {}):
                for flight in final_data["data"]["flights"]:
                    extracted_flights = extract_flight_info(flight)
                    for f in extracted_flights:
                        if f["legs"][0]["origin"] == start and len(outbound_flights) < 50:
                            outbound_flights.append(f)
                        elif f["legs"][-1]["destination"] == start and len(return_flights) < 50:
                            return_flights.append(f)

                    if len(outbound_flights) >= 50 and len(return_flights) >= 50:
                        break

            if not final_data.get("data", {}).get("flights"):
                break

            page_number += 1  # Next page

        except json.JSONDecodeError as json_error:
            raise HTTPException(status_code=500, detail=f"Error decoding JSON: {str(json_error)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Return up to 50 flights for each type
    return {
        "start": start,
        "destination": destination,
        "outbound_flights": outbound_flights[:50],
        "return_flights": return_flights[:50]
    }