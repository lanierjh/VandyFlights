# from typing import Optional
# from pydantic import BaseModel
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# import http.client
# import json
# import logging
# import os
# from datetime import datetime
#
# app = FastAPI()
#
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
# conn = http.client.HTTPSConnection("tripadvisor16.p.rapidapi.com")
#
# class FlightRequest(BaseModel):
#     origin: str
#     destination: str
#     departureDate: str
#     returnDate: Optional[str] = None
#     roundTrip: bool
#
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)
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
# @app.post("/flightsONEWAY")
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
# @app.post("/flightsROUNDTRIP")
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
#     return {"start": start, "destination": destination, "flights": combined_flights[:50]}  # Return only the first 50 flights
