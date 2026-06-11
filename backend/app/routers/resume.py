from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database import get_db
from .. import crud, schemas
from ..utils.security import get_current_user, User
from ..utils.ai import parse_resume_mock

router = APIRouter(prefix="/api/resume", tags=["resume"])

@router.post("/upload", response_model=schemas.ResumeUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )
        
    # Read file and call mock parsing
    parsed = parse_resume_mock(file.filename)
    
    # Save parsed resume to database
    db_resume = await crud.create_resume_upload(
        db=db,
        user_id=current_user.id,
        file_name=file.filename,
        suggested_role=parsed["suggested_role"],
        experience_years=parsed["experience_years"],
        skills=parsed["skills"],
        projects=parsed["projects"]
    )
    
    return db_resume

@router.get("/uploads", response_model=List[schemas.ResumeUploadResponse])
async def list_resumes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud.get_resume_uploads_by_user(db, current_user.id)
