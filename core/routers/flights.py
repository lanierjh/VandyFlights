from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from .. import crud, models,schemas
from ..crud import fetch_flight_details, get_user_by_username_or_email
from .. db import get_db, engine
router = APIRouter(tags=["flights"])



@router.post( "/flights/")



@router.post("/purchase-flights", response_model=schemas.FlightResponse)
def purchase_flight(
    flight_data: schemas.FlightCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_user_by_username_or_email)  # Assuming you have user authentication
):
    try:
        expedia_flight_data = fetch_flight_details(flight_data.departure)  # You can adjust the query based on your needs
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching flight details: {str(e)}")

    flight_number = expedia_flight_data.get('flight_number', 'Unknown')
    departure = expedia_flight_data.get('departure', flight_data.departure)
    arrival = expedia_flight_data.get('arrival', flight_data.arrival)
    departure_time = expedia_flight_data.get('departure_time', flight_data.departure_time)
    arrival_time = expedia_flight_data.get('arrival_time', flight_data.arrival_time)
    price = expedia_flight_data.get('price', flight_data.price)

    new_flight = crud.create_flight(
        db=db,
        flight_data=schemas.FlightCreate(
            flight_number=flight_number,
            departure=departure,
            arrival=arrival,
            departure_time=departure_time,
            arrival_time=arrival_time,
            price=price
        ),
        user=current_user
    )

    return new_flight