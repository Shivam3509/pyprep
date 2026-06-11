import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_interview_flow(client: AsyncClient):
    # Setup user
    user_payload = {
        "name": "Interview User",
        "email": "candidate@example.com",
        "password": "secretpassword"
    }
    await client.post("/api/auth/register", json=user_payload)
    login_response = await client.post(
        "/api/auth/login",
        data={"username": "candidate@example.com", "password": "secretpassword"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Start Interview session
    setup_payload = {
        "level": "Intermediate",
        "domain": "python-fundamentals",
        "company_type": "faang",
        "persona_id": "sarah"
    }
    response = await client.post("/api/interviews/start", json=setup_payload, headers=headers)
    assert response.status_code == 200
    session = response.json()
    assert session["status"] == "ongoing"
    assert len(session["messages"]) == 1
    assert "Welcome" in session["messages"][0]["text"]
    session_id = session["id"]

    # Verify GET session details
    get_response = await client.get(f"/api/interviews/{session_id}", headers=headers)
    assert get_response.status_code == 200
    get_data = get_response.json()
    assert get_data["id"] == session_id
    assert get_data["status"] == "ongoing"
    assert get_data["domain"] == "python-fundamentals"

    # Send first candidate answer
    response = await client.post(
        f"/api/interviews/{session_id}/message",
        json={"text": "Mutable objects can be modified in place. Immutable cannot."},
        headers=headers
    )
    assert response.status_code == 200
    session = response.json()
    assert len(session["messages"]) == 3  # Start AI Q -> User A -> Next AI Q
    
    # Verify report is not ready yet (status is ongoing)
    response = await client.get(f"/api/interviews/{session_id}/report", headers=headers)
    assert response.status_code == 400
