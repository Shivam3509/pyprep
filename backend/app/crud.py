from typing import List, Optional
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from . import models, schemas
from .utils.security import get_password_hash, verify_password
from datetime import datetime
import json

# User CRUD
async def get_user_by_email(db: AsyncSession, email: str) -> Optional[models.User]:
    result = await db.execute(select(models.User).where(models.User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user_in: schemas.UserCreate) -> models.User:
    hashed_pwd = get_password_hash(user_in.password)
    db_user = models.User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_pwd,
        experience_level="Intermediate",
        tier="Free"
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def update_user(
    db: AsyncSession,
    user: models.User,
    experience_level: Optional[str] = None,
    tier: Optional[str] = None
) -> models.User:
    if experience_level is not None:
        user.experience_level = experience_level
    if tier is not None:
        user.tier = tier
    await db.commit()
    await db.refresh(user)
    return user

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[models.User]:
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# Track & Syllabus CRUD
async def get_tracks(db: AsyncSession) -> List[models.Track]:
    result = await db.execute(select(models.Track))
    return result.scalars().all()

async def get_track_by_slug(db: AsyncSession, slug: str) -> Optional[models.Track]:
    result = await db.execute(
        select(models.Track)
        .where(models.Track.slug == slug)
        .options(selectinload(models.Track.topics))
    )
    return result.scalars().first()

async def get_topic_by_slug(db: AsyncSession, slug: str) -> Optional[models.Topic]:
    result = await db.execute(
        select(models.Topic)
        .where(models.Topic.slug == slug)
        .options(selectinload(models.Topic.questions))
    )
    return result.scalars().first()

async def get_questions_by_topic(db: AsyncSession, topic_id: str) -> List[models.Question]:
    result = await db.execute(select(models.Question).where(models.Question.topic_id == topic_id))
    return result.scalars().all()

# Coding Problems CRUD
async def get_problems(db: AsyncSession) -> List[models.CodingProblem]:
    result = await db.execute(select(models.CodingProblem))
    return result.scalars().all()

async def get_problem_by_slug(db: AsyncSession, slug: str) -> Optional[models.CodingProblem]:
    result = await db.execute(select(models.CodingProblem).where(models.CodingProblem.slug == slug))
    return result.scalars().first()

async def create_submission(
    db: AsyncSession,
    user_id: int,
    problem_id: str,
    code: str,
    language: str,
    status: str,
    execution_time_ms: int
) -> models.Submission:
    submission = models.Submission(
        user_id=user_id,
        problem_id=problem_id,
        code=code,
        language=language,
        status=status,
        execution_time_ms=execution_time_ms
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return submission

async def get_submissions_by_user(db: AsyncSession, user_id: int) -> List[models.Submission]:
    result = await db.execute(select(models.Submission).where(models.Submission.user_id == user_id))
    return result.scalars().all()

# Interview CRUD
async def create_interview_session(
    db: AsyncSession,
    session_id: str,
    user_id: int,
    level: str,
    domain: str,
    company_type: str,
    persona_id: str
) -> models.InterviewSession:
    db_session = models.InterviewSession(
        id=session_id,
        user_id=user_id,
        experience_level=level,
        domain=domain,
        company_type=company_type,
        persona_id=persona_id,
        status="ongoing"
    )
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)
    return db_session

async def get_interview_session(db: AsyncSession, session_id: str) -> Optional[models.InterviewSession]:
    result = await db.execute(
        select(models.InterviewSession)
        .where(models.InterviewSession.id == session_id)
        .options(
            selectinload(models.InterviewSession.messages),
            selectinload(models.InterviewSession.reports)
        )
    )
    return result.scalars().first()

async def create_interview_message(
    db: AsyncSession,
    session_id: str,
    sender: str,
    text: str
) -> models.InterviewMessage:
    msg = models.InterviewMessage(
        session_id=session_id,
        sender=sender,
        text=text
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg

async def save_interview_report(
    db: AsyncSession,
    session_id: str,
    summary: str,
    strengths: List[str],
    weaknesses: List[str],
    improvements: List[str]
) -> models.InterviewReport:
    report = models.InterviewReport(
        session_id=session_id,
        summary=summary,
        strengths=strengths,
        weaknesses=weaknesses,
        improvements=improvements
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report

# Resume CRUD
async def create_resume_upload(
    db: AsyncSession,
    user_id: int,
    file_name: str,
    suggested_role: str,
    experience_years: float,
    skills: List[str],
    projects: List[dict]
) -> models.ResumeUpload:
    upload = models.ResumeUpload(
        user_id=user_id,
        file_name=file_name,
        suggested_role=suggested_role,
        experience_years=experience_years,
        skills=skills,
        projects=projects
    )
    db.add(upload)
    await db.commit()
    await db.refresh(upload)
    return upload

async def get_resume_uploads_by_user(db: AsyncSession, user_id: int) -> List[models.ResumeUpload]:
    result = await db.execute(select(models.ResumeUpload).where(models.ResumeUpload.user_id == user_id))
    return result.scalars().all()
