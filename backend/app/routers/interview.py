from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime
from ..database import get_db
from .. import crud, schemas
from ..utils.security import get_current_user, User
from ..utils.ai import get_next_question, get_mock_grading

router = APIRouter(prefix="/api/interviews", tags=["interviews"])

@router.post("/start", response_model=schemas.InterviewSessionResponse)
async def start_session(
    setup: schemas.InterviewSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session_id = f"session-{int(datetime.utcnow().timestamp())}"
    
    # Create session record
    session = await crud.create_interview_session(
        db=db,
        session_id=session_id,
        user_id=current_user.id,
        level=setup.level,
        domain=setup.domain,
        company_type=setup.company_type,
        persona_id=setup.persona_id
    )
    
    # Generate and save first AI message
    first_q = get_next_question(setup.domain, 0)
    await crud.create_interview_message(
        db=db,
        session_id=session_id,
        sender="ai",
        text=f"Welcome to your mock interview today! I am your interviewer. Let's start.\n\n{first_q}"
    )
    
    # Fetch updated session details
    updated_session = await crud.get_interview_session(db, session_id)
    return updated_session

@router.post("/{session_id}/message", response_model=schemas.InterviewSessionResponse)
async def send_message(
    session_id: str,
    msg_in: schemas.InterviewMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = await crud.get_interview_session(db, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
        
    if session.status != "ongoing":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview session has already completed."
        )
        
    # Log user message
    await crud.create_interview_message(db, session_id, "user", msg_in.text)
    
    # Calculate question index (AI questions sent so far)
    ai_msg_count = sum(1 for m in session.messages if m.sender == "ai")
    
    # Generate next question
    next_text = get_next_question(session.domain, ai_msg_count)
    await crud.create_interview_message(db, session_id, "ai", next_text)
    
    # If pool limit reached, complete session status
    if "Finished" in next_text or "compile the report" in next_text:
        session.status = "review"
        session.ended_at = datetime.utcnow()
        
        # Calculate mock report grading details
        history = [{"sender": m.sender, "text": m.text} for m in session.messages]
        grades = get_mock_grading(history, session.domain)
        session.overall_score = grades["score"]
        
        await crud.save_interview_report(
            db=db,
            session_id=session_id,
            summary=grades["summary"],
            strengths=grades["strengths"],
            weaknesses=grades["weaknesses"],
            improvements=grades["improvements"]
        )
        
    await db.commit()
    
    # Fetch updated state (force reload relationship)
    db.expire(session)
    updated_session = await crud.get_interview_session(db, session_id)
    return updated_session

@router.get("/{session_id}", response_model=schemas.InterviewSessionResponse)
async def read_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = await crud.get_interview_session(db, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    return session

@router.get("/{session_id}/report", response_model=schemas.InterviewReportResponse)
async def get_session_report(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = await crud.get_interview_session(db, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
        
    if not session.reports:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Evaluation report has not been generated for this session yet."
        )
        
    return session.reports[0]
