from tests.conftest import client

def test_main_is_up(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == True

