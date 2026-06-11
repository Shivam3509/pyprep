from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from .. import crud, schemas
from ..utils.security import get_current_user, User

router = APIRouter(prefix="/api/progress", tags=["progress"])

@router.get("/dashboard", response_model=schemas.ProgressStatsResponse)
async def get_progress_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch solved submissions by user
    submissions = await crud.get_submissions_by_user(db, current_user.id)
    solved_count = sum(1 for s in submissions if s.status == "Accepted")
    
    # Static mock statistics matching user's progress grid
    weekly_hours = [
        {"day": "Mon", "hours": 2.4},
        {"day": "Tue", "hours": 1.8},
        {"day": "Wed", "hours": 3.5},
        {"day": "Thu", "hours": 0.5},
        {"day": "Fri", "hours": 2.0},
        {"day": "Sat", "hours": 4.2},
        {"day": "Sun", "hours": 1.5}
    ]
    
    domain_scores = [
        {"subject": "Python OOP", "A": 85},
        {"subject": "GIL & Async", "A": 55},
        {"subject": "Django", "A": 75},
        {"subject": "FastAPI", "A": 90},
        {"subject": "SQL Window", "A": 65},
        {"subject": "RAG & LLM", "A": 40}
    ]
    
    return {
        "streak": 14,
        "total_time_hours": 42.8,
        "solved_questions_count": 142 + solved_count,
        "avg_interview_score": 76.0,
        "weekly_hours": weekly_hours,
        "domain_scores": domain_scores
    }
