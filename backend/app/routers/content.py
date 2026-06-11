from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api", tags=["content"])

@router.get("/tracks", response_model=List[schemas.TrackResponse])
async def read_tracks(db: AsyncSession = Depends(get_db)):
    return await crud.get_tracks(db)

@router.get("/tracks/{slug}", response_model=schemas.TrackDetailResponse)
async def read_track_detail(slug: str, db: AsyncSession = Depends(get_db)):
    track = await crud.get_track_by_slug(db, slug)
    if not track:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Track not found"
        )
    return track

@router.get("/topics/{slug}", response_model=schemas.TopicResponse)
async def read_topic_detail(slug: str, db: AsyncSession = Depends(get_db)):
    topic = await crud.get_topic_by_slug(db, slug)
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )
    return topic

@router.get("/topics/{slug}/questions", response_model=List[schemas.QuestionResponse])
async def read_topic_questions(slug: str, db: AsyncSession = Depends(get_db)):
    topic = await crud.get_topic_by_slug(db, slug)
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )
    return await crud.get_questions_by_topic(db, topic.id)
