from tests.conftest import client

def test_calculate_route_success(client):
    payload = {
        "start": [4.84527, 45.77800],
        "end": [4.867195, 45.781337],
        "transport_mode": "foot-walking"
    }
    response = client.post("/routes/calculate/", json=payload)
    assert response.status_code == 200
    assert "features" in response.json()
    
def test_calculate_route_not_found(client):
    payload = {
        "start": [45.77800, 4.84527],
        "end": [45.781337, 4.867195],
        "transport_mode": "foot-walking"
    }
    response = client.post("/routes/calculate/", json=payload)
    assert response.status_code == 404

def test_calculate_route_invalid_mode(client):
    payload = {
        "start": [48.8566, 2.3522],
        "end": [48.8647, 2.3490],
        "transport_mode": "flying-drone"
    }
    response = client.post("/routes/calculate/", json=payload)
    assert response.status_code == 422

def test_calculate_route_missing_field(client):
    payload = {
        "start": [48.8566, 2.3522],
        "transport_mode": "foot-walking"
    }
    response = client.post("/routes/calculate/", json=payload)
    assert response.status_code == 422