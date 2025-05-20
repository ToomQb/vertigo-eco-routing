from tests.conftest import client

def test_create_user_invalid_input(client):
    response = client.post("/auth/signup", json={
        "email": "testuser@test.fr",
        "full_name": "Bad User",
        "df": "",
        "password": "pass123"
    })
    assert response.status_code == 422
    
    response = client.post("/auth/signup", json={
        "email": "testuser@test.fr",
        "full_name": "Bad User"
    })
    assert response.status_code == 422

def test_login_success(client):
    response = client.post("/login", data={
        "email": "testuser@test.fr",
        "password": "testpass"
    })
    assert response.status_code == 200
    assert "access_token" in response.cookies
    
    response_me = client.get("/users/me")
    assert response_me.status_code == 200
    data_me = response_me.json()
    assert data_me["email"] == "testuser@test.fr"
    assert data_me["full_name"] == "testuser"

def test_login_failure(client):
    response = client.post("/auth/login", data={
        "email": "testuser@test.fr",
        "password": "wrong"
    })
    assert response.status_code == 401

def test_login_not_found(client):
    response = client.post("/auth/login", data={
        "email": "testwronguser@test.fr",
        "password": "wrong"
    })
    assert response.status_code == 404

def test_user_me_failure(client):
    response_me = client.get("/users/me")
    assert response_me.status_code == 401