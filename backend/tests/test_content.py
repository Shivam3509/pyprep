import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_content_retrieval(client: AsyncClient):
    # Fetch all tracks
    response = await client.get("/api/tracks")
    assert response.status_code == 200
    tracks = response.json()
    assert len(tracks) > 0
    assert tracks[0]["slug"] == "python-fundamentals"
    
    # Fetch specific track details
    response = await client.get("/api/tracks/python-fundamentals")
    assert response.status_code == 200
    track_detail = response.json()
    assert len(track_detail["topics"]) > 0
    assert track_detail["topics"][0]["slug"] == "python-basics"
    
    # Fetch specific topic details
    response = await client.get("/api/topics/python-basics")
    assert response.status_code == 200
    topic = response.json()
    assert topic["title"] == "Python Basics & Setup"
    
    # Fetch questions for a topic
    response = await client.get("/api/topics/python-basics/questions")
    assert response.status_code == 200
    questions = response.json()
    assert len(questions) > 0
    assert questions[0]["id"] == "q001"
    assert "GIL" in questions[0]["follow_ups"][0]
