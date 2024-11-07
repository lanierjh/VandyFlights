import pytest
from fastapi.testclient import TestClient
from app import app  # Assuming your FastAPI app is in a file named main.py

client = TestClient(app)

@pytest.fixture
def default_params():
    return {
        "destination": "LAX",
        "departureDate": "2024-11-09",
        "returnDate": "2024-11-16",
        "roundTrip": "ONE_WAY"
    }

def test_show_flights_oneway(default_params):
    response = client.get(
        f"/flights/origin=BNA&destination={default_params['destination']}&departureDate={default_params['departureDate']}&roundTrip={default_params['roundTrip']}"
    )
    assert response.status_code == 200
    assert "BNA to" in response.json()[0]  # Ensure output contains the expected origin
    assert "results" in response.json()[0]  # Ensure output indicates results
    assert "PRICE PER PASSENGER" in response.json()[0]
    assert "URL" in response.json()[0]
   

def test_show_flights_round_trip(default_params):
    # Update roundTrip parameter for round-trip test
    default_params["roundTrip"] = "ROUND_TRIP"
    response = client.get(
        f"/flights/origin=BNA&destination={default_params['destination']}&departureDate={default_params['departureDate']}&returnDate={default_params['returnDate']}&roundTrip={default_params['roundTrip']}"
    )
    assert response.status_code == 200
    assert "BNA to" in response.json()[0]  # Ensure output contains the expected origin
    assert "results" in response.json()[0]  # Ensure output indicates results
    assert "PRICE PER PASSENGER" in response.json()[0]
    assert "URL" in response.json()[0]
    
