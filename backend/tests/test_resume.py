import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_resume_upload_flow(client: AsyncClient):
    # Setup user
    user_payload = {
        "name": "Resume User",
        "email": "resume@example.com",
        "password": "secretpassword"
    }
    await client.post("/api/auth/register", json=user_payload)
    login_response = await client.post(
        "/api/auth/login",
        data={"username": "resume@example.com", "password": "secretpassword"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Upload non-PDF (should fail)
    txt_file = {"file": ("resume.txt", b"Mock resume content", "text/plain")}
    response = await client.post("/api/resume/upload", files=txt_file, headers=headers)
    assert response.status_code == 400
    
    # Upload PDF (should succeed)
    pdf_file = {"file": ("resume.pdf", b"%PDF-1.4 mock content", "application/pdf")}
    response = await client.post("/api/resume/upload", files=pdf_file, headers=headers)
    assert response.status_code == 201
    resume_data = response.json()
    assert resume_data["file_name"] == "resume.pdf"
    assert "skills" in resume_data
    assert resume_data["experience_years"] == 3.5

    # List historic uploads
    response = await client.get("/api/resume/uploads", headers=headers)
    assert response.status_code == 200
    uploads = response.json()
    assert len(uploads) == 1
    assert uploads[0]["file_name"] == "resume.pdf"
