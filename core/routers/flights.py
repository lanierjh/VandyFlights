from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import http.client
import json
import logging
import os
from datetime import datetime, timedelta
from db import get_db
from crud import create_flight
from schemas import FlightCreate
from fastapi import Depends

from core.models import Flight

db = get_db()
router = APIRouter(tags=["flights"])

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


@router.post("/flightsONEWAY")
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


@router.post("/flightsROUNDTRIP")
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
    
@router.post("/addFlights")
async def add_flight(flight_data: FlightCreate):
    """
    Adds a new flight to the database.
    """
    try:
        flight = create_flight(flight_data)  # Calls the `create_flight` function from `crud.py`
        return {"success": True, "flight": flight}
    except Exception as e:
        logger.error(f"Error adding flight: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add flight")

# conn = http.client.HTTPSConnection("tripadvisor16.p.rapidapi.com")
#
#
# class FlightRequest(BaseModel):
#     origin: str
#     destination: str
#     departureDate: str
#     returnDate: Optional[str] = None
#     roundTrip: bool
#
#
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)
#
#
# def extract_flight_info(flight):
#     flights = []
#     for segment in flight["segments"]:
#         for leg in segment["legs"]:
#             flight_info = {
#                 "origin": leg["originStationCode"],
#                 "destination": leg["destinationStationCode"],
#                 "departureDateTime": leg["departureDateTime"],
#                 "arrivalDateTime": leg["arrivalDateTime"],
#                 "carrier": leg["marketingCarrier"]["displayName"],
#                 "flightNumber": str(leg["flightNumber"]),
#                 "logo": leg["marketingCarrier"].get("logoUrl", "Logo not available"),
#                 "stops": leg.get("numStops", 0),
#             }
#             for link in flight.get("purchaseLinks", []):
#                 price = link.get("totalPricePerPassenger")
#                 flight_info["price"] = str(price) if price and price > 0 else "Price not available"
#                 flight_info["url"] = link["url"]
#             flights.append(flight_info)
#     return flights
#
#
# def combine_flights(flights):
#     combined_flights = []
#     flights_sorted = sorted(flights, key=lambda x: (x["price"], x["departureDateTime"]))
#     temp_flight = None
#
#     for i, current_flight in enumerate(flights_sorted):
#         # If there is a temporary flight stored, check if it can connect with the current flight
#         if temp_flight:
#             # Check if the arrival time of the temp flight matches the departure time of the current flight
#             arrival_time = datetime.fromisoformat(temp_flight["arrivalDateTime"])
#             departure_time = datetime.fromisoformat(current_flight["departureDateTime"])
#
#             # Check if the price is the same and the arrival matches the next departure
#             if temp_flight["price"] == current_flight["price"] and arrival_time == departure_time:
#                 # Combine the flights
#                 temp_flight["destination"] = current_flight["destination"]
#                 temp_flight["arrivalDateTime"] = current_flight["arrivalDateTime"]
#                 temp_flight["carrier"] += f" -> {current_flight['carrier']}"
#                 temp_flight["flightNumber"] += f" -> {current_flight['flightNumber']}"
#                 temp_flight["logo"] += f" -> {current_flight['logo']}"
#                 temp_flight["stops"] += 1  # Increment stops
#                 temp_flight["url"] += f" -> {current_flight['url']}"
#             else:
#                 # If they don't connect, save the temp flight and start a new temp with the current flight
#                 combined_flights.append(temp_flight)
#                 temp_flight = current_flight
#         else:
#             # Start a new temp flight if none is stored
#             temp_flight = current_flight
#
#     # Append the last temp flight if it exists
#     if temp_flight:
#         combined_flights.append(temp_flight)
#
#     return combined_flights
#
#
# @router.post("/flightsONEWAY")
# async def show_flightsONE_WAY(flight_request: FlightRequest):
#     logger.debug(f"Received FlightRequest: {flight_request}")
#     if not flight_request.destination or not flight_request.departureDate:
#         raise HTTPException(status_code=400, detail="Destination and departure date are required.")
#
#     headers = {
#         'x-rapidapi-key': "8f9d9710dcmsh46dbd3b58cf0e4bp139f74jsn1e7767cf4d9e",
#         'x-rapidapi-host': "tripadvisor16.p.rapidapi.com"
#     }
#
#     start = flight_request.origin
#     destination = flight_request.destination
#     departure_date = flight_request.departureDate
#     flight_type = "ONE_WAY"
#     page_number = 1
#     flights = []
#
#     while len(flights) < 50:  # Fetch until we have at least 50 flights
#         request_path = (
#             f"/api/v1/flights/searchFlights?sourceAirportCode={start}&"
#             f"destinationAirportCode={destination}&date={departure_date}&"
#             f"itineraryType={flight_type}&sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&"
#             f"classOfService=ECONOMY&pageNumber={page_number}&nearby=yes&nonstop=yes&currencyCode=USD&region=USA"
#         )
#
#         try:
#             conn.request("GET", request_path, headers=headers)
#             res = conn.getresponse()
#             data = res.read()
#             final_data = json.loads(data.decode("utf-8"))
#
#             if "flights" in final_data.get("data", {}):
#                 for flight in final_data["data"]["flights"]:
#                     flights.extend(extract_flight_info(flight))
#                     if len(flights) >= 50:
#                         break
#
#             if not final_data.get("data", {}).get("flights"):
#                 break  # No more flights
#
#             page_number += 1  # Next page
#
#         except json.JSONDecodeError as json_error:
#             raise HTTPException(status_code=500, detail=f"Error decoding JSON: {str(json_error)}")
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=str(e))
#
#     combined_flights = combine_flights(flights)
#     return {"start": start, "destination": destination, "flights": combined_flights[:50]}
#
#
# @router.post("/flightsROUNDTRIP")
# async def show_flightsROUND_TRIP(flight_request: FlightRequest):
#     logger.debug(f"Received FlightRequest: {flight_request}")
#     if not flight_request.destination or not flight_request.departureDate:
#         raise HTTPException(status_code=400, detail="Destination and departure date are required.")
#
#     headers = {
#         'x-rapidapi-key': "8f9d9710dcmsh46dbd3b58cf0e4bp139f74jsn1e7767cf4d9e",
#         'x-rapidapi-host': "tripadvisor16.p.rapidapi.com"
#     }
#
#     start = flight_request.origin
#     destination = flight_request.destination
#     departure_date = flight_request.departureDate
#     return_date = flight_request.returnDate
#     flight_type = "ROUND_TRIP"
#     page_number = 1
#     flights = []
#
#     while len(flights) < 50:  # Fetch until we have at least 50 flights
#         request_path = (
#             f"/api/v1/flights/searchFlights?sourceAirportCode={start}&"
#             f"destinationAirportCode={destination}&date={departure_date}&"
#             f"itineraryType={flight_type}&sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&"
#             f"classOfService=ECONOMY&returnDate={return_date}&pageNumber={page_number}&nearby=yes&nonstop=yes&"
#             "currencyCode=USD&region=USA"
#         )
#
#         try:
#             conn.request("GET", request_path, headers=headers)
#             res = conn.getresponse()
#             data = res.read()
#             final_data = json.loads(data.decode("utf-8"))
#             print(final_data)
#             if "flights" in final_data.get("data", {}):
#                 for flight in final_data["data"]["flights"]:
#                     flights.extend(extract_flight_info(flight))
#                     if len(flights) >= 50:  # Stop if we have 50 or more flights
#                         break
#
#             if not final_data.get("data", {}).get("flights"):
#                 break  # Stop if no more flights are found
#
#             page_number += 1  # Move to the next page
#
#         except json.JSONDecodeError as json_error:
#             raise HTTPException(status_code=500, detail=f"Error decoding JSON: {str(json_error)}")
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=str(e))
#
#     # Combine flights based on criteria
#     combined_flights = combine_flights(flights)
#
#     return {"start": start, "destination": destination,
#             "flights": combined_flights[:50]}  # Return only the first 50 flights



router.get("/trending-destinations")
def get_trending_destinations(date_range: int = 30):
    cutoff_date = datetime.now() - timedelta(days=date_range)

    flights_ref = db.collection("flights")
    flights = flights_ref.where("date", ">=", cutoff_date).stream()

    destination_trends = {}
    for flight in flights:
        flight_data = flight.to_dict()
        destination = flight_data["destination"]
        start_date = flight_data["start_date"]
        end_date = flight_data["end_date"]

        if destination not in destination_trends:
            destination_trends[destination] = []

        destination_trends[destination].append((start_date, end_date))

    for destination, date_ranges in destination_trends.items():
        date_ranges.sort()
        merged_ranges = []
        for start, end in date_ranges:
            start_date = datetime.strptime(start, "%Y-%m-%d")
            end_date = datetime.strptime(end, "%Y-%m-%d")
            if not merged_ranges or merged_ranges[-1][1] < start_date:
                merged_ranges.append((start_date, end_date))
            else:
                merged_ranges[-1] = (
                    merged_ranges[-1][0],
                    max(merged_ranges[-1][1], end_date),
                )
        destination_trends[destination] = len(merged_ranges)

    trending_destinations = sorted(
        destination_trends.items(), key=lambda x: x[1], reverse=True
    )

    return [{"destination": dest, "trend_count": count} for dest, count in trending_destinations]

#untested version where we return users but flights need to be populated in the users

# def get_trending_destinations(date_range: int = 30):
#
#     cutoff_date = datetime.now() - timedelta(days=date_range)
#
#     flights_ref = db.collection("flights")
#     flights = flights_ref.where("date", ">=", cutoff_date).stream()
#
#     destination_trends = {}
#     flight_to_destination = {}
#
#     for flight in flights:
#         flight_data = flight.to_dict()
#         flight_id = flight.id
#         destination = flight_data["destination"]
#         start_date = flight_data["start_date"]
#         end_date = flight_data["end_date"]
#
#         if destination not in destination_trends:
#             destination_trends[destination] = {
#                 "trend_count": 0,
#                 "users": [],
#                 "flights": []
#             }
#
#         destination_trends[destination]["flights"].append((start_date, end_date))
#         destination_trends[destination]["trend_count"] += 1
#         flight_to_destination[flight_id] = destination
#
#     users_ref = db.collection("users")
#     users = users_ref.stream()
#
#     for user in users:
#         user_data = user.to_dict()
#         user_id = user.id
#         user_flights = user_data.get("flights", [])
#
#         for flight_id in user_flights:
#             if flight_id in flight_to_destination:
#                 destination = flight_to_destination[flight_id]
#                 destination_trends[destination]["users"].append(user_id)
#
#     trending_destinations = sorted(
#         destination_trends.items(),
#         key=lambda x: x[1]["trend_count"],
#         reverse=True
#     )
#
#     return [
#         {
#             "destination": destination,
#             "trend_count": data["trend_count"],
#             "users": list(set(data["users"]))
#         }
#         for destination, data in trending_destinations
#     ]