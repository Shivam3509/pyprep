from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database import get_db
from .. import crud, schemas
from ..utils.security import get_current_user, User
from ..utils.sandbox import execute_python_code

router = APIRouter(prefix="/api/problems", tags=["playground"])

@router.get("", response_model=List[schemas.ProblemResponse])
async def read_problems(db: AsyncSession = Depends(get_db)):
    return await crud.get_problems(db)

@router.get("/{slug}", response_model=schemas.ProblemResponse)
async def read_problem_detail(slug: str, db: AsyncSession = Depends(get_db)):
    problem = await crud.get_problem_by_slug(db, slug)
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    return problem

@router.post("/{slug}/run", response_model=schemas.RunResultResponse)
async def run_problem_code(
    slug: str,
    run_req: schemas.ProblemRunRequest,
    db: AsyncSession = Depends(get_db)
):
    problem = await crud.get_problem_by_slug(db, slug)
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    
    # Execute python code
    result = execute_python_code(run_req.code, run_req.custom_input)
    return result

@router.post("/{slug}/submit", response_model=schemas.SubmissionResponse)
async def submit_problem_solution(
    slug: str,
    run_req: schemas.ProblemRunRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = await crud.get_problem_by_slug(db, slug)
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    
    # Run sandbox checks
    result = execute_python_code(run_req.code)
    
    # Log submission in db
    submission = await crud.create_submission(
        db=db,
        user_id=current_user.id,
        problem_id=problem.id,
        code=run_req.code,
        language=run_req.language,
        status=result["status"],
        execution_time_ms=result["time_ms"]
    )
    
    return submission
