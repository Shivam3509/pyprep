from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base, AsyncSessionLocal
from .routers import auth, content, playground, interview, resume, progress
from .models import Track, Topic, Question, CodingProblem
from sqlalchemy.future import select
import asyncio

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# Enable CORS for Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(content.router)
app.include_router(playground.router)
app.include_router(interview.router)
app.include_router(resume.router)
app.include_router(progress.router)

# Mock initial data to seed
SEED_TRACKS = [
    {
        "id": "track-1",
        "slug": "python-fundamentals",
        "name": "Python Fundamentals",
        "description": "Master the core Python language — from variables to OOP, decorators, generators, and the standard library.",
        "icon": "🐍",
        "color": "#3B82F6",
        "topic_count": 18,
        "question_count": 120,
        "estimated_hours": 24,
        "level": "Fresher",
        "is_premium": False,
        "topics": [
            {
                "id": "t1-1",
                "slug": "python-basics",
                "title": "Python Basics & Setup",
                "description": "Installation, REPL, first program, PEP8",
                "estimated_minutes": 60,
                "is_premium": False,
                "subtopics": ["Installing Python", "REPL basics", "PEP8", "Running scripts"]
            },
            {
                "id": "t1-2",
                "slug": "variables-data-types",
                "title": "Variables & Data Types",
                "description": "int, float, str, bool, None — type system basics",
                "estimated_minutes": 90,
                "is_premium": False,
                "subtopics": ["Integers", "Floats", "Strings", "Booleans", "Type conversion"]
            }
        ]
    },
    {
        "id": "track-2",
        "slug": "sql-databases",
        "name": "SQL & Databases",
        "description": "SQL from fundamentals to advanced — joins, indexes, window functions, transactions, and PostgreSQL optimization.",
        "icon": "🗄️",
        "color": "#8B5CF6",
        "topic_count": 8,
        "question_count": 80,
        "estimated_hours": 18,
        "level": "Fresher",
        "is_premium": False,
        "topics": [
            {
                "id": "t2-1",
                "slug": "sql-fundamentals",
                "title": "SQL Fundamentals",
                "description": "SELECT, WHERE, ORDER BY, LIMIT — the basics",
                "estimated_minutes": 90,
                "is_premium": False,
                "subtopics": ["SELECT", "WHERE", "ORDER BY", "LIMIT/OFFSET", "DISTINCT"]
            }
        ]
    }
]

SEED_QUESTIONS = [
    {
        "id": "q001",
        "topic_id": "t1-1",
        "track_slug": "python-fundamentals",
        "difficulty": "Easy",
        "title": "What is Python and what are its key features?",
        "question": "Can you explain what Python is and describe its most important features?",
        "answer": "Python is a high-level, interpreted, dynamically typed language. Its key features include dynamic typing, automatic garbage collection, a clean syntax, and a global interpreter lock (GIL).",
        "expectations": ["Mention interpreted vs compiled", "Discuss dynamic typing"],
        "common_mistakes": ["Saying Python is weekly typed"],
        "follow_ups": ["What is the GIL?"],
        "code_example": "x = 10\nx = 'hello' # dynamic typing",
        "tags": ["python", "basics"]
    },
    {
        "id": "q002",
        "topic_id": "t1-2",
        "track_slug": "python-fundamentals",
        "difficulty": "Easy",
        "title": "Explain mutable vs immutable types in Python",
        "question": "What is the difference between mutable and immutable objects in Python? Give examples.",
        "answer": "Mutable objects (like lists, dicts, sets) can be modified in-place. Immutable objects (like ints, floats, strings, tuples) create a new instance when changed.",
        "expectations": ["Clear definition", "Default argument gotcha"],
        "common_mistakes": ["Thinking tuples are always fully immutable even with list elements"],
        "follow_ups": ["How does Python intern strings?"],
        "code_example": "s = 'hello'\ns += ' world' # creates new string",
        "tags": ["python", "data-types"]
    }
]

SEED_PROBLEMS = [
    {
        "id": "p001",
        "slug": "two-sum",
        "title": "Two Sum",
        "difficulty": "Easy",
        "track": "python-fundamentals",
        "tags": ["Array", "Hash Map"],
        "description": "Given a list of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "examples": [{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"}],
        "constraints": ["2 <= nums.length <= 10^4"],
        "starter_code": "from typing import List\n\ndef two_sum(nums: List[int], target: int) -> List[int]:\n    # Write code here\n    pass\n",
        "solution": "from typing import List\n\ndef two_sum(nums: List[int], target: int) -> List[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n",
        "hints": ["Use a hash map for O(n) lookup"],
        "time_complexity": "O(n)",
        "space_complexity": "O(n)",
        "acceptance_rate": 72
    },
    {
        "id": "p002",
        "slug": "valid-parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "track": "python-fundamentals",
        "tags": ["Stack", "String"],
        "description": "Given a string s containing just the characters '()[]{}', determine if the input string is valid.",
        "examples": [{"input": "s = '()'", "output": "True"}],
        "constraints": ["1 <= s.length <= 10^4"],
        "starter_code": "def is_valid(s: str) -> bool:\n    # Write code here\n    pass\n",
        "solution": "def is_valid(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n",
        "hints": ["Use a stack to match brackets"],
        "time_complexity": "O(n)",
        "space_complexity": "O(n)",
        "acceptance_rate": 66
    }
]

async def seed_data(session):
    # Check if already seeded
    result = await session.execute(select(Track))
    if result.scalars().first():
        return  # Already seeded
        
    # Seed Tracks & Topics
    for track_data in SEED_TRACKS:
        topics_data = track_data.pop("topics")
        db_track = Track(**track_data)
        session.add(db_track)
        
        for topic_data in topics_data:
            db_topic = Topic(track_id=db_track.id, **topic_data)
            session.add(db_topic)
            
    # Seed Questions
    for q_data in SEED_QUESTIONS:
        db_q = Question(**q_data)
        session.add(db_q)
        
    # Seed Problems
    for p_data in SEED_PROBLEMS:
        db_p = CodingProblem(**p_data)
        session.add(db_p)
        
    await session.commit()

@app.on_event("startup")
async def startup_event():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Seed default data
    async with AsyncSessionLocal() as session:
        await seed_data(session)

@app.get("/")
def read_root():
    return {"message": "Welcome to PyPrep Backend API Service"}
