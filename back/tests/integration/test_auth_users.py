from tests.conftest import client

def test_create_user_invalid_input(client):
    response = client.post("/users", json={
        "email": "testuser@test.fr",
        "full_name": "Bad User",
        "password": "pass123"
    })
    assert response.status_code == 422

def test_login_success(client):
    response = client.post("/auth/token", data={
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
    response_me = client.get("/users/me", headers={
        "Authorization": f"Bearer {data["access_token"]}"
    })
    assert response_me.status_code == 200
    data_me = response_me.json()
    assert data_me["username"] == "testuser"
    assert data_me["email"] == "testuser@test.fr"
    assert data_me["full_name"] == "testuser"

def test_login_failure(client):
    response = client.post("/auth/token", data={
        "username": "testuser",
        "password": "wrong"
    })
    assert response.status_code == 401

def test_login_not_found(client):
    response = client.post("/auth/token", data={
        "username": "wrong",
        "password": "wrong"
    })
    assert response.status_code == 404

def test_user_me_failure(client):
    response_me = client.get("/users/me")
    assert response_me.status_code == 401
    response_me = client.get("/users/me", headers={
        "Authorization": "Bearer random"
    })
    assert response_me.status_code == 401