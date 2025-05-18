import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_create_user(client):
    response = client.post("/users", json={
        "username": "testuser",
        "email": "testuser@test.fr",
        "full_name": "testuser",
        "password": "testpass"
    })
    
    assert response.status_code in (201, 409)