import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_playground_flow(client: AsyncClient):
    # Register & login to get auth token
    user_payload = {
        "name": "Playground User",
        "email": "coder@example.com",
        "password": "secretpassword"
    }
    await client.post("/api/auth/register", json=user_payload)
    
    login_response = await client.post(
        "/api/auth/login",
        data={"username": "coder@example.com", "password": "secretpassword"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch coding problems list
    response = await client.get("/api/problems")
    assert response.status_code == 200
    problems = response.json()
    assert len(problems) > 0
    assert problems[0]["slug"] == "two-sum"
    
    # Dry-run code in sandbox (Unmodified Starter Code)
    run_payload = {
        "code": "print('Hello')",
        "language": "python",
        "custom_input": ""
    }
    response = await client.post("/api/problems/two-sum/run", json=run_payload)
    assert response.status_code == 200
    run_res = response.json()
    assert run_res["status"] == "Accepted"
    assert "Hello" in run_res["stdout"]
    
    # Run code with syntax error
    bad_run_payload = {
        "code": "def two_sum()\n   pass",
        "language": "python"
    }
    response = await client.post("/api/problems/two-sum/run", json=bad_run_payload)
    assert response.status_code == 200
    bad_res = response.json()
    assert bad_res["status"] == "Runtime Error"
    
    # Submit Code (unauthenticated should fail)
    submit_payload = {
        "code": "def two_sum(nums, target):\n    return [0, 1]",
        "language": "python"
    }
    response = await client.post("/api/problems/two-sum/submit", json=submit_payload)
    assert response.status_code == 401
    
    # Submit Code (authenticated)
    response = await client.post("/api/problems/two-sum/submit", json=submit_payload, headers=headers)
    assert response.status_code == 200
    sub_res = response.json()
    assert "status" in sub_res
    assert sub_res["language"] == "python"
