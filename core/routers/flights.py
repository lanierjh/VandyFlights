from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from security import util
import schemas, crud
import logging
import bcrypt




router = APIRouter(tags=["flights"])

@router.get("/protected")
async def protected_route(current_user: dict = Depends(util.get_current_user)):
    return {"message": "Hello, World!", "user": current_user}


@router.post("/addFlight", response_model=schemas.FlightResponse, status_code=status.HTTP_201_CREATED)
async def addflight(flights: schemas.FlightCreate):
    logging.info("Incoming flight data: %s", flights)
    try:
        new_flight = crud.create_flight(flights)
        return {"success": True, "flight": new_flight}
    except Exception as e:
        logging.error("Error adding flight: %s", e)
        raise HTTPException(status_code=500, detail="Failed to add flight.")
