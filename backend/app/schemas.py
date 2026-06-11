from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any
from datetime import datetime

# Auth schemas
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    experience_level: str
    tier: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    experience_level: Optional[str] = None
    tier: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Track & Syllabus schemas
class TopicResponse(BaseModel):
    id: str
    slug: str
    title: str
    description: Optional[str]
    estimated_minutes: int
    is_premium: bool
    subtopics: Optional[List[str]] = []
    
    class Config:
        from_attributes = True

class TrackResponse(BaseModel):
    id: str
    slug: str
    name: str
    description: Optional[str]
    icon: Optional[str]
    color: Optional[str]
    topic_count: int
    question_count: int
    estimated_hours: int
    level: str
    is_premium: bool
    
    class Config:
        from_attributes = True

class TrackDetailResponse(TrackResponse):
    topics: List[TopicResponse] = []

class QuestionResponse(BaseModel):
    id: str
    topic_id: str
    track_slug: str
    difficulty: str
    title: str
    question: str
    answer: str
    expectations: Optional[List[str]] = []
    common_mistakes: Optional[List[str]] = []
    follow_ups: Optional[List[str]] = []
    code_example: Optional[str] = None
    tags: Optional[List[str]] = []
    
    class Config:
        from_attributes = True

# Coding Playground schemas
class ProblemRunRequest(BaseModel):
    code: str
    language: str
    custom_input: Optional[str] = ""

class RunResultResponse(BaseModel):
    status: str
    message: str
    stdout: Optional[str] = None
    passed: Optional[int] = 0
    total: Optional[int] = 0
    time_ms: Optional[int] = 0

class ProblemResponse(BaseModel):
    id: str
    slug: str
    title: str
    difficulty: str
    track: str
    tags: Optional[List[str]] = []
    description: str
    examples: Optional[List[Any]] = []
    constraints: Optional[List[str]] = []
    starter_code: str
    hints: Optional[List[str]] = []
    time_complexity: Optional[str]
    space_complexity: Optional[str]
    acceptance_rate: int
    
    class Config:
        from_attributes = True

class SubmissionResponse(BaseModel):
    id: int
    problem_id: str
    code: str
    language: str
    status: str
    execution_time_ms: int
    submitted_at: datetime
    
    class Config:
        from_attributes = True

# Interview schemas
class InterviewSessionCreate(BaseModel):
    level: str
    domain: str
    company_type: str
    persona_id: str

class InterviewMessageResponse(BaseModel):
    id: int
    sender: str
    text: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

class InterviewMessageCreate(BaseModel):
    text: str

class InterviewReportResponse(BaseModel):
    summary: Optional[str]
    strengths: Optional[List[str]] = []
    weaknesses: Optional[List[str]] = []
    improvements: Optional[List[str]] = []
    created_at: datetime
    
    class Config:
        from_attributes = True

class InterviewSessionResponse(BaseModel):
    id: str
    status: str
    experience_level: str
    domain: str
    company_type: str
    persona_id: str
    overall_score: Optional[int] = None
    started_at: datetime
    ended_at: Optional[datetime] = None
    messages: List[InterviewMessageResponse] = []
    reports: List[InterviewReportResponse] = []
    
    class Config:
        from_attributes = True

# Resume schemas
class ResumeUploadResponse(BaseModel):
    id: int
    file_name: str
    suggested_role: Optional[str]
    experience_years: float
    skills: Optional[List[str]] = []
    projects: Optional[List[Any]] = []
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

# Progress schemas
class ProgressStatsResponse(BaseModel):
    streak: int
    total_time_hours: float
    solved_questions_count: int
    avg_interview_score: float
    weekly_hours: List[dict]
    domain_scores: List[dict]
