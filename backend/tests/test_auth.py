import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_auth_flow(client: AsyncClient):
    # Register a new user
    user_payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "secretpassword"
    }
    response = await client.post("/api/auth/register", json=user_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    
    # Try duplicate registration
    response = await client.post("/api/auth/register", json=user_payload)
    assert response.status_code == 400
    
    # Login
    login_payload = {
        "username": "test@example.com",
        "password": "secretpassword"
    }
    response = await client.post("/api/auth/login", data=login_payload)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    
    # Get Profile (me)
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    response = await client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    profile = response.json()
    assert profile["name"] == "Test User"
    assert profile["email"] == "test@example.com"
    assert profile["experience_level"] == "Intermediate"
    assert profile["tier"] == "Free"

    # Update Profile
    update_payload = {
        "experience_level": "Senior",
        "tier": "Premium"
    }
    response = await client.put("/api/auth/update", json=update_payload, headers=headers)
    assert response.status_code == 200
    updated_profile = response.json()
    assert updated_profile["experience_level"] == "Senior"
    assert updated_profile["tier"] == "Premium"

    # Get Profile again to verify
    response = await client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    profile_check = response.json()
    assert profile_check["experience_level"] == "Senior"
    assert profile_check["tier"] == "Premium"
