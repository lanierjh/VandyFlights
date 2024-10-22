import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
from app import app  
from app import show_flights

client = TestClient(app)

# Mock data for the external API response
mock_flight_data = b'''
{
    "data": [
        {"url": "https://sample-url.com/flight1?price=200"},
        {"url": "https://sample-url.com/flight2?price=0"},
        {"url": "https://sample-url.com/flight3?price=150"}
    ]
}
'''

@pytest.fixture
def mock_rapidapi_response():
    """Mock the HTTPSConnection and its response for show_flights."""
    mock_conn = Mock()
    mock_conn.getresponse.return_value.read.return_value = mock_flight_data
    return mock_conn

# Patch the connection object in the context of this test
@patch('app.conn', new_callable=lambda: Mock())
def test_show_flights(mock_conn, mock_rapidapi_response):
    mock_conn.getresponse = mock_rapidapi_response.getresponse
    response = client.get("/flights")
    
    # Checking for a valid response
    assert response.status_code == 200
    data = response.json()
    
    # Validate that the output matches expected strings.
    assert "BNA to LAX results" in data["output"]
    
    #test known values in the output
def test_Variables():
    assert 'Variable' in show_flights()["output"]
    assert 'PRICE PER PASSENGER' in show_flights()["output"]
    assert 'URL' in show_flights()["output"]
    

#HOW TO RUN:
#install pytest within the folder this file is in in your terminal with the command below:
#pip install pytest

#then, simply run:
#python -m pytest
#to run the test. If this doesn't work, the command:
#pytest
#can work as well, depending on the configurations of your system
        
        