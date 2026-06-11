from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    experience_level = Column(String(50), default="Intermediate")  # Fresher, Intermediate, Senior
    tier = Column(String(50), default="Free")  # Free, Pro, Premium
    created_at = Column(DateTime, default=datetime.utcnow)
    
    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("ResumeUpload", back_populates="user", cascade="all, delete-orphan")

class Track(Base):
    __tablename__ = "tracks"
    
    id = Column(String(50), primary_key=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)
    color = Column(String(50), nullable=True)
    topic_count = Column(Integer, default=0)
    question_count = Column(Integer, default=0)
    estimated_hours = Column(Integer, default=0)
    level = Column(String(50), nullable=False)
    is_premium = Column(Boolean, default=False)
    
    topics = relationship("Topic", back_populates="track", cascade="all, delete-orphan")

class Topic(Base):
    __tablename__ = "topics"
    
    id = Column(String(50), primary_key=True)
    track_id = Column(String(50), ForeignKey("tracks.id"), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    estimated_minutes = Column(Integer, default=0)
    is_premium = Column(Boolean, default=False)
    subtopics = Column(JSON, nullable=True)  # List of strings
    
    track = relationship("Track", back_populates="topics")
    questions = relationship("Question", back_populates="topic", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(String(50), primary_key=True)
    topic_id = Column(String(50), ForeignKey("topics.id"), nullable=False)
    track_slug = Column(String(100), nullable=False)
    difficulty = Column(String(50), nullable=False)
    title = Column(String(300), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    expectations = Column(JSON, nullable=True)    # List of strings
    common_mistakes = Column(JSON, nullable=True)  # List of strings
    follow_ups = Column(JSON, nullable=True)       # List of strings
    code_example = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)             # List of strings
    
    topic = relationship("Topic", back_populates="questions")

class CodingProblem(Base):
    __tablename__ = "coding_problems"
    
    id = Column(String(50), primary_key=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    difficulty = Column(String(50), nullable=False)
    track = Column(String(100), nullable=False)
    tags = Column(JSON, nullable=True)             # List of strings
    description = Column(Text, nullable=False)
    examples = Column(JSON, nullable=True)         # List of example objects
    constraints = Column(JSON, nullable=True)      # List of strings
    starter_code = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    hints = Column(JSON, nullable=True)            # List of strings
    time_complexity = Column(String(100), nullable=True)
    space_complexity = Column(String(100), nullable=True)
    acceptance_rate = Column(Integer, default=70)
    
    submissions = relationship("Submission", back_populates="problem", cascade="all, delete-orphan")

class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(String(50), ForeignKey("coding_problems.id"), nullable=False)
    code = Column(Text, nullable=False)
    language = Column(String(50), default="python")
    status = Column(String(50), nullable=False)  # Accepted, Wrong Answer, Compile Error
    execution_time_ms = Column(Integer, default=0)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="submissions")
    problem = relationship("CodingProblem", back_populates="submissions")

class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id = Column(String(100), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    experience_level = Column(String(50), nullable=False)
    domain = Column(String(100), nullable=False)
    company_type = Column(String(100), nullable=False)
    persona_id = Column(String(100), nullable=False)
    status = Column(String(50), default="ongoing")  # ongoing, review
    overall_score = Column(Integer, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="interviews")
    messages = relationship("InterviewMessage", back_populates="session", cascade="all, delete-orphan")
    reports = relationship("InterviewReport", back_populates="session", cascade="all, delete-orphan")

class InterviewMessage(Base):
    __tablename__ = "interview_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("interview_sessions.id"), nullable=False)
    sender = Column(String(50), nullable=False)  # ai, user
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("InterviewSession", back_populates="messages")

class InterviewReport(Base):
    __tablename__ = "interview_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("interview_sessions.id"), nullable=False)
    summary = Column(Text, nullable=True)
    strengths = Column(JSON, nullable=True)     # List of strings
    weaknesses = Column(JSON, nullable=True)    # List of strings
    improvements = Column(JSON, nullable=True)   # List of strings
    created_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("InterviewSession", back_populates="reports")

class ResumeUpload(Base):
    __tablename__ = "resume_uploads"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name = Column(String(200), nullable=False)
    suggested_role = Column(String(200), nullable=True)
    experience_years = Column(Float, default=0.0)
    skills = Column(JSON, nullable=True)        # List of strings
    projects = Column(JSON, nullable=True)      # List of project objects
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="resumes")
