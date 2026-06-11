# PyPrep — Python Interview Preparation Platform
## Complete Implementation Plan

A production-ready, end-to-end interview preparation ecosystem for Python developers (Fresher → 5 Years experience).

---

## 1. Product Overview

**PyPrep** is a focused, distraction-free platform inspired by LeetCode, InterviewBit, and Educative. It serves Python developers at every stage of their career journey — from writing their first `print("Hello")` to architecting distributed systems.

**Design Philosophy**: Clean, readable, professional. No flashy animations. No gimmicks. Just a tool that works.

---

## 2. Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Code Editor | Monaco Editor |
| Data Fetching | React Query (TanStack Query) |
| State Management | Zustand |
| Charts | Recharts |
| UI Components | Radix UI (headless) |
| Forms | React Hook Form + Zod |

### Backend
| Layer | Technology |
|---|---|
| API Framework | FastAPI (Python) |
| Database | PostgreSQL 15 |
| Cache | Redis |
| Task Queue | Celery + Redis |
| ORM | SQLAlchemy 2.0 + Alembic |
| Auth | JWT + OAuth2 (Google, GitHub) |
| File Storage | AWS S3 / Cloudflare R2 |

### AI Layer
| Layer | Technology |
|---|---|
| Primary LLM | OpenAI GPT-4o |
| Fallback LLM | Anthropic Claude 3.5 |
| Embeddings | OpenAI text-embedding-3-small |
| Vector DB | Qdrant (self-hosted) |
| Resume Parsing | PyMuPDF + LLM extraction |

### Code Execution
| Layer | Technology |
|---|---|
| Engine | Judge0 CE (self-hosted) |
| Sandbox | Docker containers |
| Languages | Python 3.11, SQL (PostgreSQL) |

### Infrastructure
| Layer | Technology |
|---|---|
| Containerization | Docker + Docker Compose |
| Orchestration | Kubernetes (production) |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |
| Logging | Loki + Grafana |
| CDN | Cloudflare |

---

## 3. Database Schema

### Core Tables

```sql
-- Users
users (id, email, name, avatar_url, auth_provider, subscription_tier, experience_level, created_at)

-- Experience Levels
experience_levels (id, name, slug, description, min_years, max_years)

-- Learning Tracks  
tracks (id, slug, name, description, icon, experience_level_id, order_index, is_premium)

-- Topics
topics (id, track_id, title, slug, description, order_index, estimated_minutes, is_premium)

-- Questions
questions (id, topic_id, title, slug, difficulty, question_text, answer_text, 
           expectations, common_mistakes, follow_up_questions, code_example, 
           tags[], created_at)

-- Coding Problems
coding_problems (id, topic_id, title, slug, difficulty, description, 
                 starter_code, test_cases[], constraints, hints[], is_premium)

-- Test Cases
test_cases (id, problem_id, input, expected_output, is_hidden, points)

-- User Progress
user_topic_progress (id, user_id, topic_id, completion_percentage, last_accessed_at)
user_question_attempts (id, user_id, question_id, is_correct, time_taken_seconds, attempted_at)
user_coding_submissions (id, user_id, problem_id, code, language, status, 
                         passed_test_cases, total_test_cases, execution_time_ms, 
                         memory_used_kb, submitted_at)

-- Mock Interviews
mock_interview_sessions (id, user_id, experience_level, domain, company_type, 
                          status, ai_model, started_at, ended_at, overall_score)
mock_interview_messages (id, session_id, role, content, feedback, score, created_at)
mock_interview_reports (id, session_id, summary, strengths, weaknesses, 
                         improvements, topic_scores{}, created_at)

-- Resume Interviews
resume_uploads (id, user_id, file_url, parsed_skills[], parsed_projects[], 
                parsed_technologies[], parsed_experience_years, status, uploaded_at)
resume_interview_sessions (id, user_id, resume_id, questions[], status, created_at)

-- Subscriptions
subscription_plans (id, name, slug, price_monthly, price_yearly, features[], is_active)
user_subscriptions (id, user_id, plan_id, status, started_at, expires_at, payment_provider)
```

---

## 4. API Design

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
GET  /api/auth/google
GET  /api/auth/github
```

### Learning Content
```
GET  /api/tracks                          # All tracks
GET  /api/tracks/{slug}                   # Track details
GET  /api/tracks/{slug}/topics            # Topics in track
GET  /api/topics/{slug}                   # Topic detail
GET  /api/topics/{slug}/questions         # Questions for topic
GET  /api/questions/{slug}               # Question detail
GET  /api/questions?difficulty=&topic=   # Filtered questions
```

### Coding Playground
```
GET  /api/problems                        # Problem list
GET  /api/problems/{slug}                 # Problem detail
POST /api/problems/{slug}/run             # Run code (returns results)
POST /api/problems/{slug}/submit          # Submit solution
GET  /api/submissions/{id}               # Submission result
```

### Mock Interviews
```
POST /api/interviews/start               # Start session
POST /api/interviews/{id}/message        # Send message to AI
GET  /api/interviews/{id}/report         # Get report
GET  /api/interviews/history             # Past interviews
```

### Resume Interviews
```
POST /api/resume/upload                  # Upload PDF
GET  /api/resume/{id}/status             # Processing status
GET  /api/resume/{id}/questions          # Generated questions
POST /api/resume/{id}/answer             # Answer a question
```

### Progress
```
GET  /api/progress/dashboard             # Full dashboard data
GET  /api/progress/topics                # Topic completion
GET  /api/progress/streak                # Daily streak
GET  /api/progress/weak-areas            # Identified weak areas
```

---

## 5. Frontend Architecture

### Page Structure (Next.js App Router)
```
app/
├── (public)/
│   ├── page.tsx                    # Landing page
│   ├── pricing/page.tsx            # Pricing/Subscription
│   └── about/page.tsx
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (platform)/
│   ├── layout.tsx                  # Sidebar + header
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── tracks/
│   │   ├── page.tsx               # All tracks
│   │   └── [slug]/
│   │       ├── page.tsx           # Track overview
│   │       └── [topic]/page.tsx   # Topic detail + questions
│   ├── playground/
│   │   ├── page.tsx               # Problem list
│   │   └── [slug]/page.tsx        # Code editor
│   ├── interview/
│   │   ├── page.tsx               # Interview setup
│   │   └── [id]/page.tsx          # Live interview
│   ├── resume/page.tsx             # Resume upload + interview
│   ├── progress/page.tsx           # Progress dashboard
│   └── profile/page.tsx           # User profile
├── admin/
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── questions/page.tsx
│   ├── users/page.tsx
│   └── content/page.tsx
```

### Component Library
```
components/
├── ui/                    # Radix-based primitives (Button, Modal, etc.)
├── layout/                # Sidebar, Header, Footer
├── question/              # QuestionCard, QuestionDetail, QuestionFilter
├── code/                  # MonacoEditor, TestCasePanel, OutputPanel
├── interview/             # ChatBubble, InterviewTimer, FeedbackPanel
├── progress/              # ProgressRing, HeatMap, TopicBar, WeakAreaCard
└── shared/                # LoadingSpinner, EmptyState, ErrorBoundary
```

---

## 6. AI Architecture

### Mock Interview Flow
```
User → Select (Level + Domain + Company) 
     → AI generates opening question 
     → User answers (text or voice) 
     → AI evaluates + scores + provides feedback 
     → AI generates follow-up 
     → Repeat (8–12 questions) 
     → AI generates full report
```

### Resume Interview Flow
```
User uploads PDF 
  → PyMuPDF extracts text 
  → LLM extracts structured data (skills, projects, tech) 
  → LLM generates 15–20 personalized questions 
  → User answers each 
  → AI scores and provides feedback
```

### RAG for Questions
```
Question bank → Embed with text-embedding-3-small 
              → Store in Qdrant 
              → On search/filter → semantic similarity retrieval 
              → Hybrid search (semantic + keyword)
```

---

## 7. UI/UX Specifications

### Design System
| Token | Value |
|---|---|
| Primary Blue | `#2563EB` |
| Secondary | `#64748B` |
| Background | `#FFFFFF` |
| Surface | `#F8FAFC` |
| Border | `#E2E8F0` |
| Text Primary | `#0F172A` |
| Text Secondary | `#475569` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Error | `#DC2626` |
| Font | Inter (Google Fonts) |
| Base font size | 15px |
| Border radius | 8px |
| Sidebar width | 260px |

### Key Pages to Build in MVP
1. **Landing Page** — Hero, features, tracks overview, pricing CTA
2. **Experience Selection** — Choose Fresher / Intermediate / Senior
3. **Learning Dashboard** — Track cards, progress rings, streaks
4. **Topic Detail** — Content + Q&A accordion
5. **Coding Playground** — Monaco editor + test panel
6. **Mock Interview** — Chat-based AI interview screen
7. **Progress Dashboard** — Charts, heatmap, weak areas
8. **Resume Upload** — Drag-drop + interview flow

---

## 8. Development Roadmap

### Phase 1 — MVP (Weeks 1–8)
- [ ] Project scaffolding (Next.js + FastAPI)
- [ ] Auth (email/password + Google OAuth)
- [ ] Experience selection onboarding
- [ ] Learning tracks (Fresher path complete)
- [ ] 200+ Python Q&A questions seeded
- [ ] Basic coding playground (Python)
- [ ] Mock interview (text-based, GPT-4o)
- [ ] Progress dashboard (basic)
- [ ] Landing page + pricing page

### Phase 2 — Core Features (Weeks 9–16)
- [ ] All 3 experience level tracks complete
- [ ] 1000+ question bank seeded
- [ ] SQL coding challenges
- [ ] Resume-based interview
- [ ] FastAPI + Django tracks
- [ ] ML/DL/NLP tracks
- [ ] LLM + RAG tracks
- [ ] Advanced progress analytics
- [ ] Admin panel

### Phase 3 — Scale & Polish (Weeks 17–24)
- [ ] Voice-based mock interviews
- [ ] Company-specific interview packs
- [ ] Leaderboard + community
- [ ] Payments + subscriptions (Stripe)
- [ ] Mobile-responsive polish
- [ ] Performance optimization
- [ ] Kubernetes deployment
- [ ] Monitoring + alerting

---

## 9. MVP Definition

The MVP includes:
- Landing page with all sections
- Auth (email + Google)
- Fresher learning track (complete)
- 200 Python Q&A questions
- Coding playground (Python, 20 problems)
- Text-based AI mock interview
- Basic progress dashboard
- Subscription page (Stripe-ready)

---

## 10. Monetization Strategy

| Tier | Price | Features |
|---|---|---|
| Free | $0/mo | 50 questions, 5 coding problems, 1 mock interview/month |
| Pro | $12/mo | Unlimited questions, all tracks, 10 mock interviews/month |
| Premium | $25/mo | All Pro + resume interviews, company packs, priority AI |
| Team | $80/mo (5 seats) | All Premium + admin panel, team analytics |

---

## 11. Scaling Strategy

- **Stateless API** → Horizontal scaling behind load balancer
- **Redis caching** → Question data, user sessions, leaderboard
- **Read replicas** → PostgreSQL read replicas for heavy queries
- **CDN** → Static assets on Cloudflare
- **Code execution** → Judge0 cluster, autoscaled via Kubernetes HPA
- **AI calls** → Async via Celery, rate-limited per user tier
- **Vector DB** → Qdrant cluster with sharding

---

## 12. Security Considerations

- JWT with short-lived access tokens (15 min) + refresh tokens (7 days)
- OAuth2 PKCE flow for Google/GitHub
- Rate limiting on all API endpoints (per-IP + per-user)
- Code sandbox isolation (Docker with no network, memory/CPU limits)
- SQL injection prevention (parameterized queries via SQLAlchemy)
- XSS prevention (Next.js built-in + strict CSP headers)
- File upload validation (PDF-only, 5MB max, virus scan)
- HTTPS everywhere, HSTS headers
- Admin role-based access control (RBAC)
- Secrets managed via environment variables / AWS Secrets Manager

---

## 13. Admin Panel Requirements

- **Content Management**: Add/edit/delete questions, topics, tracks
- **User Management**: View, ban, change subscription tier
- **Analytics**: DAU/MAU, question attempt rates, interview usage
- **Question Moderation**: Review AI-generated questions before publishing
- **System Health**: API latency, error rates, Judge0 queue depth

---

## 14. Future Feature Recommendations

1. **Voice Mock Interviews** — Whisper STT + TTS response
2. **Company-Specific Packs** — Google, Meta, Amazon, Flipkart interview packs
3. **Peer Mock Interviews** — Match users for live 1:1 practice
4. **Video Recording** — Record and analyze body language / delivery
5. **Study Groups** — Collaborative learning rooms
6. **Spaced Repetition** — SM-2 algorithm for question review scheduling
7. **IDE Plugins** — VS Code extension for daily question
8. **Leaderboard** — Weekly coding contests
9. **Job Board Integration** — Apply to jobs directly from platform
10. **Mentorship** — Connect with senior engineers for 1:1 sessions

---

## 15. What I Will Build Now (Backend Layer)

We will build a production-ready, fully functional FastAPI backend under the `backend/` directory, containing the following parts:

### [NEW] `backend/requirements.txt`
- Core FastAPI, Uvicorn, SQLAlchemy (async/await standard), databases (for async pool support), asyncpg, SQLite/PostgreSQL drivers.
- Security: passlib (with bcrypt for hashing), PyJWT (for session tokens), python-multipart (for PDF uploads).
- Testing: pytest, pytest-asyncio, httpx.

### [NEW] `backend/app/config.py`
- Configuration management using Pydantic `BaseSettings`. Handles JWT secrets, Database connection URLs, and LLM mock toggle configurations.

### [NEW] `backend/app/database.py`
- Async session creation and engine initialization using `sqlalchemy.ext.asyncio` with SQLite fallback for local testing.

### [NEW] `backend/app/models.py`
- SQLAlchemy models mapped to the PostgreSQL/SQLite schema:
  - `User`: id, name, email, hashed_password, experience_level, tier.
  - `Track`, `Topic`, `Question`, `CodingProblem` (Seeded initial data).
  - `Submission`: Code submissions, status, execution time.
  - `InterviewSession`, `InterviewMessage`, `InterviewReport`: Mock interview logs.
  - `ResumeUpload`, `ResumeQuestion`: Extracted skills, experience, and custom tailored questions.

### [NEW] `backend/app/schemas.py`
- Pydantic models for request/response serialization (e.g. `UserCreate`, `UserResponse`, `LoginRequest`, `Token`, `ProblemRunRequest`, `SubmissionResponse`, `InterviewMessageCreate`, etc.).

### [NEW] `backend/app/utils/security.py`
- JWT signature generation, expiration handling, password verification, and user authentication dependency.

### [NEW] `backend/app/utils/ai.py`
- Simulated AI interview question generation and response grading based on candidate responses and chosen interviewer persona characteristics.

### [NEW] `backend/app/utils/sandbox.py`
- Secure Python execution runner. Evaluates the solution code against the problem's inputs and checks outputs without requiring heavy external dependencies.

### [NEW] `backend/app/crud.py`
- DB operations for creating users, checking passwords, logging coding submissions, starting mock interviews, and saving session questions.

### [NEW] `backend/app/routers/`
- `auth.py`: registration, credentials validation, token retrieval.
- `content.py`: queries for tracks, topics, questions and coding problems.
- `playground.py`: code testing and formal submission logs.
- `interview.py`: starts sessions, handles chat turns, generates grades.
- `resume.py`: resume file parser mock and personalized questions.
- `progress.py`: dashboard analytics aggregator.

### [NEW] `backend/app/main.py`
- App mount, routing initialization, and database initialization on startup.

---

## 16. Verification & Testing Plan

### Automated Tests (`backend/tests/`)
- **`tests/conftest.py`**: Configures a clean SQLite test database and an asynchronous HTTP client (`httpx.AsyncClient`).
- **`tests/test_auth.py`**: Tests registration, login, token authentication, and invalid credentials exceptions.
- **`tests/test_content.py`**: Tests retrieval of learning tracks, topics, conceptual questions, and coding problem lists.
- **`tests/test_playground.py`**: Tests running code, verifying correct inputs, and submitting wrong code vs correct solutions.
- **`tests/test_interview.py`**: Tests mock interview flow (session start, conversation messages, report generation).
- **`tests/test_resume.py`**: Tests parsing step triggers and customized questions.

### Manual Verification
- We will start the FastAPI service with Uvicorn and run the `pytest` test suite to check that 100% of routes pass successfully.

