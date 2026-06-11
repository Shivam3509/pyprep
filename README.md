# PyPrep — Python Interview Preparation Platform

PyPrep is a complete, production-ready interactive preparation platform designed specifically for Python developers ranging from entry-level (Freshers) to mid-to-senior candidates (up to 5 years of experience). The platform provides conceptual learning, coding playgrounds with a sandboxed code execution engine, real-time AI mock interviews, resume scanning, and visual analytics dashboards.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14/15 (TypeScript)
- **Styling:** Vanilla CSS & Tailwind CSS (Curated dark mode palette)
- **Editor:** `@monaco-editor/react` (Monaco Code Editor)
- **State Management:** Zustand (Global authentication & session states)
- **Visual Analytics:** Recharts (Interactive Radar & Git-like contribution heatmap)

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **ORM / Database:** SQLAlchemy (Async sessions) / SQLite (Development)
- **Security:** Passlib (Salted SHA-256), JWT tokens
- **Testing:** Pytest / Pytest-Asyncio
- **Code Execution Sandbox:** subprocess-based isolated execution container (2s timeout, memory constraints)

---

## 🛠️ Feature Walkthrough

1. **Learning Tracks & Topics (`/tracks`)**: A structured directory covering core Python, Object-Oriented Programming (OOP), Data Structures & Algorithms, Web Frameworks (Django/FastAPI), and System Design.
2. **Coding Playground (`/playground` & `/playground/[slug]`)**: LeetCode-style code bank. Features a code-editor console, syntax checker, input customizer, custom stdout/stderr capture, and optimal solution code reveals.
3. **Live AI Mock Interview (`/interview` & `/interview/[id]`)**: Select experience level, company profile, and interviewer personality. Simulates real-time technical questions, speech-to-text integration, and generates a post-interview assessment score.
4. **Resume Scanning (`/resume`)**: PDF parser that extracts technical skills and automatically compiles custom technical interview questions tailored to the candidate's profile.
5. **Analytics Dashboard (`/progress`)**: Git-style commit heatmap, radar charts mapping performance metrics (OOP, algorithms, basics), and study streak trackers.

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Backend Setup (FastAPI)
Navigate to the `backend/` directory, set up your environment, and launch the server:

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations & seed seed-data (creates SQLite db automatically on startup)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

*The backend server will run on `http://127.0.0.1:8001`.*

### 2. Frontend Setup (Next.js)
Navigate to the `pyprep/` directory, create local environment configuration, and run the development dev-server:

```bash
cd pyprep

# Install packages
npm install

# Create environment variable
echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local

# Run next.js dev server on port 5001
npm run dev -- -p 5001
```

*The frontend application will be accessible at `http://localhost:5001`.*

---

## 🧪 Running Tests
The backend features a comprehensive async integration test suite. Navigate to `backend/` and run `pytest`:

```bash
cd backend
pytest
```

All 5 core routing test groups (Authentication, Topics Content, Code Submissions Playground, AI Interviews, Resume parser) should pass successfully.

---

## 📁 Repository Structure

```
Learnwithme/
├── backend/
│   ├── app/
│   │   ├── routers/       # API Routes (auth, content, playground, interview, etc.)
│   │   ├── utils/         # Code Sandbox, JWT Tokens, Mock AI Engine
│   │   ├── main.py        # FastAPI entrypoint & CORS setup
│   │   ├── models.py      # SQLAlchemy DB ORM models
│   │   └── database.py    # Database session management
│   ├── tests/             # pytest integration suites
│   ├── requirements.txt
│   └── pytest.ini
└── pyprep/
    ├── src/
    │   ├── app/           # Next.js App Router Pages
    │   ├── components/    # Reusable UI Components
    │   └── lib/           # Central API & Auth Store
    └── package.json
```
