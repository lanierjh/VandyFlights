import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from core.main import app
from core.security.util import get_current_user
from core.crud import get_user_by_username_or_email, get_user_id_by_username_or_email

client = TestClient(app)

# Override get_current_user for simulating an authenticated user
def override_get_current_user():
    return {"identifier": "test_user", "email": "test_user@example.com"}

app.dependency_overrides[get_current_user] = override_get_current_user

@patch("core.crud.update_user_profile")
@patch("core.crud.get_user_id_by_username_or_email")
@patch("core.crud.get_user_by_username_or_email")
def test_edit_profile_valid(mock_get_user, mock_get_user_id, mock_update_user):
    mock_get_user.return_value = {
        "username": "test_user",
        "first_name": "OldFirstName",
        "last_name": "OldLastName",
        "email": "test_user@example.com"
    }
    mock_get_user_id.return_value = "user_id_123"
    mock_update_user.return_value = {
        "username": "test_user",
        "first_name": "NewFirstName",
        "last_name": "NewLastName",
        "email": "test_user@example.com"
    }
    response = client.put("/editprofile", json={"first_name": "NewFirstName", "last_name": "NewLastName"})
    assert response.status_code == 200
    assert response.json()["first_name"] == "NewFirstName"

def test_edit_profile_unauthorized():
    app.dependency_overrides = {}  # Temporarily remove override to simulate unauthorized request
    response = client.put("/editprofile", json={"first_name": "NewName"})
    assert response.status_code == 401
    app.dependency_overrides[get_current_user] = override_get_current_user


#////////////////////////////////////////////////////////
@patch("core.crud.update_user_profile")
@patch("core.crud.get_user_id_by_username_or_email")
@patch("core.crud.get_user_by_username_or_email")
def test_edit_profile_valid(mock_get_user, mock_get_user_id, mock_update_user):
    mock_get_user.return_value = {
        "username": "test_user",
        "first_name": "OldFirstName",
        "last_name": "OldLastName",
        "email": "test_user@example.com"
    }
    mock_get_user_id.return_value = "user_id_123"
    mock_update_user.return_value = {
        "username": "test_user",
        "first_name": "NewFirstName",
        "last_name": "NewLastName",
        "email": "test_user@example.com"
    }
    response = client.put("/editprofile", json={"first_name": "NewFirstName", "last_name": "NewLastName"})
    assert response.status_code == 200
    assert response.json()["first_name"] == "NewFirstName"


def test_edit_profile_unauthorized():
    app.dependency_overrides = {}  # Temporarily remove override to simulate unauthorized request
    response = client.put("/editprofile", json={"first_name": "NewName"})
    assert response.status_code == 401
    app.dependency_overrides[get_current_user] = override_get_current_user

@patch("core.crud.send_friend_request")
def test_send_friend_request_valid(mock_send_request):
    response = client.post("/users/send_friend_request", json={"friend_identifier": "target_user"})
    assert response.status_code == 200
    assert response.json()["status"] == "pending"


@patch("core.crud.send_friend_request")
def test_send_friend_request_duplicate(mock_send_request):
    mock_send_request.side_effect = ValueError("Friend request already sent")
    response = client.post("/users/send_friend_request", json={"friend_identifier": "existing_friend"})
    assert response.status_code == 404
    assert response.json()["detail"] == "Friend request already sent"

@patch("core.crud.reject_friend_request")
def test_reject_friend_request_valid(mock_reject_request):
    response = client.post("/users/reject_friend_request/requester_user")
    assert response.status_code == 200
    assert response.json()["status"] == "rejected"

@patch("core.crud.reject_friend_request")
def test_reject_friend_request_already_rejected(mock_reject_request):
    mock_reject_request.side_effect = ValueError("Friend request not found or already processed")
    response = client.post("/users/reject_friend_request/requester_user")
    assert response.status_code == 404
    assert response.json()["detail"] == "Friend request not found or already processed"

@patch("core.crud.get_user_id_by_username_or_email")
@patch("core.crud.accept_friend_request")
def test_accept_friend_request_success(mock_accept_request, mock_get_user_id):
    # Set up mocks
    mock_get_user_id.side_effect = lambda email: "requester_id_123" if email == "requester_user@example.com" else None
    mock_accept_request.return_value = None  # No return needed for success

    # Call the API
    response = client.post("/users/accept_friend_request/requester_user@example.com")

    # Assertions
    assert response.status_code == 200
    assert response.json()["status"] == "accepted"
    assert response.json()["requester_id"] == "requester_user@example.com"

@patch("core.crud.get_user_id_by_username_or_email")
@patch("core.crud.accept_friend_request")
def test_accept_friend_request_requester_not_found(mock_accept_request, mock_get_user_id):
    # Set up mocks
    mock_get_user_id.side_effect = lambda email: None  # Simulate requester not found

    # Call the API
    response = client.post("/users/accept_friend_request/unknown_user@example.com")

    # Assertions
    assert response.status_code == 404
    assert response.json()["detail"] == "Requester not found"

@patch("core.crud.get_user_id_by_username_or_email")
@patch("core.crud.accept_friend_request")
def test_accept_friend_request_not_found_or_processed(mock_accept_request, mock_get_user_id):
    # Set up mocks
    mock_get_user_id.side_effect = lambda email: "requester_id_123" if email == "requester_user@example.com" else None
    mock_accept_request.side_effect = ValueError("Friend request not found or already processed")

    # Call the API
    response = client.post("/users/accept_friend_request/requester_user@example.com")

    # Assertions
    assert response.status_code == 404
    assert response.json()["detail"] == "Friend request not found or already processed"

