from typing import List, Dict, Any
import random

# Realistic question banks per domain
MOCK_QUESTIONS = {
    "python-fundamentals": [
        "Let's start with mutable vs immutable types. Can you explain the difference and why it matters in Python?",
        "Excellent. Now, what are the differences between a list and a tuple? When would you choose a tuple over a list?",
        "What is the Global Interpreter Lock (GIL) in CPython, and how does it affect concurrency?",
        "How does Python's memory management work under the hood? (Mention reference counting and cyclic GC)",
        "Explain Python decorators — how they work, how to write a custom one, and why we use functools.wraps.",
        "Lastly, compare generators vs iterators in terms of memory efficiency and evaluation."
    ],
    "sql-databases": [
        "Explain the difference between JOIN types: INNER, LEFT, RIGHT, and FULL OUTER.",
        "What are SQL window functions? Describe PARTITION BY and how ROW_NUMBER differs from DENSE_RANK.",
        "What is an index in databases? How does a B-tree index speed up queries, and what is its overhead?",
        "What is the N+1 query problem, how do you identify it, and how do you fix it?",
        "What are ACID properties in transaction management, and what are transaction isolation levels?"
    ],
    "fastapi": [
        "What is the difference between ASGI and WSGI, and how does FastAPI handle async/await operations?",
        "Describe Pydantic's role in FastAPI, and how request validation/serialization works.",
        "How does FastAPI's Dependency Injection system work? Why use Depends()?",
        "How do you implement OAuth2 Password Flow and JWT token security in FastAPI?",
        "How do you write asynchronous integration tests for FastAPI, and how do you override dependencies?"
    ]
}

DEFAULT_POOL = [
    "Tell me about a complex Python codebase you worked on recently.",
    "How do you handle production error logging and exceptions?",
    "What profiling tools do you use to locate performance bottlenecks?",
    "How do you structure packaging dependencies and virtual environments in team projects?"
]

def get_next_question(domain: str, index: int) -> str:
    pool = MOCK_QUESTIONS.get(domain, DEFAULT_POOL)
    if index < len(pool):
        return pool[index]
    return "Thank you. I have finished asking all technical questions. We are ready to compile the report."

def get_mock_grading(messages: List[Dict[str, str]], domain: str) -> Dict[str, Any]:
    # Compute a realistic score
    score = 75 + random.randint(0, 15)
    
    strengths = [
        "Solid conceptual foundation of language/framework architecture guidelines.",
        "Accurate terminology coverage when explaining memory models or join operations.",
        "Good understanding of primary complexity implications (Big-O scaling)."
    ]
    
    weaknesses = [
        "Could expand further on specific edge cases or boundary constraints.",
        "Missed describing memory allocation overheads or connection pool limitations.",
        "Slightly weak explanation of scoping context or cooperative thread behaviors."
    ]
    
    improvements = [
        "Study internal interpreter mechanisms (like CPython execution cycles).",
        "Practice benchmarking queries and index structures using EXPLAIN ANALYZE.",
        "Practice implementing custom context managers and decorators under multiple concurrency scopes."
    ]
    
    return {
        "score": score,
        "summary": f"The candidate demonstrated strong knowledge of {domain.replace('-', ' ').title()} core structures. Answers were well-structured and direct, showing solid industrial preparation.",
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvements": improvements
    }

def parse_resume_mock(file_name: str) -> Dict[str, Any]:
    return {
        "name": "Alexander Smith",
        "email": "alexander.smith@example.com",
        "experience_years": 3.5,
        "skills": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS", "PyTest", "Celery"],
        "suggested_role": "Intermediate Python Backend Engineer",
        "projects": [
            {
                "title": "Real-time Telemetry Service",
                "tech": ["FastAPI", "WebSockets", "Redis", "Docker"],
                "description": "Designed and implemented an async telemetry pipeline processing 15,000+ data packets per second with Redis cache-aside queues."
            },
            {
                "title": "Automated ETL Pipeline",
                "tech": ["Python", "Pandas", "PostgreSQL", "AWS S3"],
                "description": "Built serverless pipelines converting raw transactional CSVs into clean dimensional Postgres tables."
            }
        ]
    }
