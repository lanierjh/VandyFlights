import json
from fastapi.testclient import TestClient
from core.main import app  # Assuming this code is in main.py
import http.client

client = TestClient(app)

# Fixtures for common valid and invalid requests
valid_oneway_request = {
    "origin": "LAX",
    "destination": "JFK",
    "departureDate": "2024-12-15",
    "roundTrip": False
}

valid_roundtrip_request = {
    "origin": "LAX",
    "destination": "JFK",
    "departureDate": "2024-12-15",
    "returnDate": "2024-12-25",
    "roundTrip": True
}

invalid_request_missing_date = {
    "origin": "LAX",
    "destination": "JFK",
    "roundTrip": False
}

invalid_request_missing_destination = {
    "origin": "LAX",
    "departureDate": "2024-12-15",
    "roundTrip": False
}

# 1. Testing Input Validation (No Mocking Needed) (black box)

# Test one-way flight endpoint with valid data
def test_flights_oneway_valid():
    response = client.post("/flightsONEWAY", json=valid_oneway_request)
    assert response.status_code == 200
    assert "flights" in response.json()
    assert isinstance(response.json()["flights"], list)

# Test round-trip flight endpoint with valid data
def test_flights_roundtrip_valid():
    response = client.post("/flightsROUNDTRIP", json=valid_roundtrip_request)
    assert response.status_code == 200
    assert "flights" in response.json()
    assert isinstance(response.json()["flights"], list)

# Test one-way flight endpoint with missing date
def test_flights_oneway_missing_date():
    response = client.post("/flightsONEWAY", json=invalid_request_missing_date)
    assert response.status_code == 422
    assert response.json()["detail"][0] == {'input': {'destination': 'JFK', 'origin': 'LAX', 'roundTrip': False}, 'loc': ['body', 'departureDate'], 'msg': 'Field required', 'type': 'missing'}

# Test round-trip flight endpoint with missing destination
def test_flights_roundtrip_missing_destination():
    response = client.post("/flightsROUNDTRIP", json=invalid_request_missing_destination)
    assert response.status_code == 422
    assert response.json()["detail"][0] == {'input': {'departureDate': '2024-12-15', 'origin': 'LAX', 'roundTrip': False}, 'loc': ['body', 'destination'], 'msg': 'Field required', 'type': 'missing'}

# 2. Mocking External API Responses (Simulating Backend Behavior) (white box)

# Mock a successful API response for a one-way flight request
def test_flights_oneway_valid_response(monkeypatch):
    def mock_getresponse(*args, **kwargs):
        class MockResponse:
            def read(self):
                return json.dumps({
                    "data": {
                        "flights": [
                            {
                                "segments": [
                                    {
                                        "legs": [
                                            {
                                                "originStationCode": "LAX",
                                                "destinationStationCode": "JFK",
                                                "departureDateTime": "2024-12-15T08:00",
                                                "arrivalDateTime": "2024-12-15T16:00",
                                                "marketingCarrier": {"displayName": "Test Airline"},
                                                "flightNumber": "123"
                                            }
                                        ]
                                    }
                                ],
                                "purchaseLinks": [{"url": "https://test.com", "totalPricePerPassenger": 300}]
                            }
                        ]
                    }
                }).encode("utf-8")
        return MockResponse()
    
    monkeypatch.setattr("http.client.HTTPSConnection.getresponse", mock_getresponse)

    response = client.post("/flightsONEWAY", json=valid_oneway_request)
    assert response.status_code == 200
    assert "flights" in response.json()
    assert isinstance(response.json()["flights"], list)
    assert response.json()["flights"][0]["origin"] == "LAX"
    assert response.json()["flights"][0]["destination"] == "JFK"

# Mock a 404 response if no flights are found
def test_flights_oneway_no_flights_found(monkeypatch):
    def mock_getresponse(*args, **kwargs):
        class MockResponse:
            def read(self):
                return json.dumps({"data": {"flights": []}}).encode("utf-8")
        return MockResponse()
    
    monkeypatch.setattr("http.client.HTTPSConnection.getresponse", mock_getresponse)

    response = client.post("/flightsONEWAY", json=valid_oneway_request)
    assert response.status_code == 500
    assert response.json()["detail"][0] == "R"

# Mock a malformed JSON response to test JSON decode error handling
def test_flights_oneway_malformed_json(monkeypatch):
    def mock_getresponse(*args, **kwargs):
        class MockResponse:
            def read(self):
                return b"not a json"
        return MockResponse()
    
    monkeypatch.setattr("http.client.HTTPSConnection.getresponse", mock_getresponse)

    response = client.post("/flightsONEWAY", json=valid_oneway_request)
    assert response.status_code == 500
    assert "R" in response.json()["detail"][0]

# Mock a network error to test exception handling
def test_flights_oneway_network_error(monkeypatch):
    def mock_request(*args, **kwargs):
        raise http.client.HTTPException("Network error")
    
    monkeypatch.setattr("http.client.HTTPSConnection.request", mock_request)

    response = client.post("/flightsONEWAY", json=valid_oneway_request)
    assert response.status_code == 500
    assert response.json()["detail"] == "Network error"