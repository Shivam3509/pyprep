"use client";

import Link from "next/link";
import {
  BookOpen,
  Code2,
  Brain,
  FileText,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  Zap,
  Star,
  Play,
  ChevronRight,
  Database,
  Server,
  Cpu,
} from "lucide-react";

// ─── Shared helpers ─────────────────────────────────────────────────────────

const DiffBadge = ({
  level,
}: {
  level: "Easy" | "Medium" | "Hard" | string;
}) => {
  const cls =
    level === "Easy"
      ? "badge-easy"
      : level === "Medium"
      ? "badge-medium"
      : "badge-hard";
  return <span className={cls}>{level}</span>;
};

// ─── Navigation ─────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-md flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            PyPrep
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {[
            ["Problems", "/playground"],
            ["Learn", "/tracks"],
            ["Mock Interview", "/interview"],
            ["Pricing", "/pricing"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-brand-700 transition-colors"
          >
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full border border-brand-200 mb-6">
          <Star className="w-3 h-3 fill-current" />
          Trusted by 50,000+ Python developers
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-5 max-w-3xl mx-auto leading-tight">
          The complete Python interview
          <span className="text-brand-600"> prep platform</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          1000+ questions, AI-powered mock interviews, a coding playground, and
          structured learning paths — from Python basics to System Design and
          LLMs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-brand-700 transition-colors"
          >
            Start learning free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/playground"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 text-sm font-semibold px-6 py-3 rounded-md hover:bg-slate-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            Try the playground
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "1,000+", label: "Interview questions" },
            { value: "50+", label: "Coding problems" },
            { value: "10", label: "Learning tracks" },
            { value: "AI", label: "Mock interviewer" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center border border-slate-200 rounded-lg py-4 px-3"
            >
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────

const features = [
  {
    icon: BookOpen,
    title: "Structured Learning Paths",
    desc: "Experience-based tracks for Fresher (0–1y), Intermediate (1–3y), and Senior (3–5y) engineers. Each path covers the exact topics companies test.",
  },
  {
    icon: Code2,
    title: "Coding Playground",
    desc: "Write, run, and debug Python and SQL directly in the browser with a Monaco editor, test cases, and expected output verification.",
  },
  {
    icon: Brain,
    title: "AI Mock Interviews",
    desc: "Practice with a GPT-4o powered AI interviewer. Select your experience level, domain, and get real-time feedback and a detailed report.",
  },
  {
    icon: FileText,
    title: "Resume-Based Interviews",
    desc: "Upload your resume. Our AI extracts your skills and projects, then generates a personalized interview with questions tailored to your experience.",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    desc: "Track your question accuracy, coding performance, topic completion, and identify weak areas with visual dashboards and improvement trends.",
  },
  {
    icon: Target,
    title: "1000+ Curated Questions",
    desc: "Questions with detailed answers, interviewer expectations, common mistakes, and follow-up questions. Categorized by topic and difficulty.",
  },
];

function Features() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Everything you need to land the job
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Built by engineers who have been on both sides of the interview
            table.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 text-[0.9375rem]">
                {f.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Tracks ──────────────────────────────────────────────────────────────────

const trackGroups = [
  {
    level: "Fresher (0–1 Year)",
    color: "text-green-700 bg-green-50 border-green-200",
    tracks: [
      { icon: "🐍", name: "Python Fundamentals", count: "120 questions" },
      { icon: "🗄️", name: "SQL & Databases", count: "80 questions" },
      { icon: "🌐", name: "REST API Basics", count: "40 questions" },
    ],
  },
  {
    level: "Intermediate (1–3 Years)",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    tracks: [
      { icon: "⚡", name: "FastAPI", count: "90 questions" },
      { icon: "🎯", name: "Django & DRF", count: "85 questions" },
      { icon: "⚙️", name: "Advanced Python", count: "70 questions" },
      { icon: "🤖", name: "Machine Learning", count: "75 questions" },
    ],
  },
  {
    level: "Senior (3–5 Years)",
    color: "text-purple-700 bg-purple-50 border-purple-200",
    tracks: [
      { icon: "🏗️", name: "System Design", count: "60 questions" },
      { icon: "🧠", name: "Deep Learning", count: "60 questions" },
      { icon: "💬", name: "LLMs", count: "65 questions" },
      { icon: "🔍", name: "RAG Systems", count: "50 questions" },
    ],
  },
];

function Tracks() {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Learning paths for every level
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Start where you are. Cover exactly what your target role requires.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {trackGroups.map((group) => (
            <div key={group.level} className="card p-5">
              <div
                className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded border mb-4 ${group.color}`}
              >
                {group.level}
              </div>
              <div className="space-y-2">
                {group.tracks.map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-sm font-medium text-slate-800">
                        {t.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{t.count}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/onboarding"
                className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Start this path
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sample Question ─────────────────────────────────────────────────────────

function SampleQuestion() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Questions with depth, not just answers
          </h2>
          <p className="text-slate-600">
            Every question covers what interviewers actually look for.
          </p>
        </div>

        <div className="card overflow-hidden">
          {/* Question header */}
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 font-mono">Q#005</span>
              <h3 className="font-semibold text-slate-900">
                How do decorators work in Python?
              </h3>
            </div>
            <DiffBadge level="Medium" />
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Answer panel */}
            <div className="lg:col-span-3 space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                A <strong>decorator</strong> is a callable that takes a function
                as input and returns a modified function. The{" "}
                <code>@decorator</code> syntax is syntactic sugar for{" "}
                <code>func = decorator(func)</code>.
              </p>

              <div className="bg-slate-900 rounded-lg p-4 text-xs leading-relaxed overflow-x-auto">
                <pre className="text-slate-300 font-mono">{`import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took "
              f"{time.perf_counter()-start:.4f}s")
        return result
    return wrapper

@timer
def slow_op():
    """Does something slow."""
    return sum(range(1_000_000))`}</pre>
              </div>
            </div>

            {/* Sidebar metadata */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Interviewer expects
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Explain wrapper pattern",
                    "Show @functools.wraps usage",
                    "Decorator with arguments",
                    "Real-world use cases",
                  ].map((e) => (
                    <li
                      key={e}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Common mistakes
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Forgetting @functools.wraps",
                    "@my_dec() vs @my_dec",
                  ].map((m) => (
                    <li key={m} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-red-400 flex-shrink-0">✗</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Follow-up questions
                </div>
                <ul className="space-y-1 text-sm text-brand-600">
                  {[
                    "What is functools.wraps?",
                    "How do stacked decorators work?",
                  ].map((q) => (
                    <li key={q} className="hover:text-brand-800 cursor-pointer">
                      → {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tech Tracks ────────────────────────────────────────────────────────────

function TechCoverage() {
  const techs = [
    { icon: "🐍", name: "Python" },
    { icon: "⚡", name: "FastAPI" },
    { icon: "🎯", name: "Django" },
    { icon: "🗄️", name: "PostgreSQL" },
    { icon: "🔴", name: "Redis" },
    { icon: "🐳", name: "Docker" },
    { icon: "🤖", name: "ML / sklearn" },
    { icon: "🧠", name: "Deep Learning" },
    { icon: "💬", name: "LLMs / GPT" },
    { icon: "🔍", name: "RAG / Qdrant" },
    { icon: "⚙️", name: "Kubernetes" },
    { icon: "📊", name: "System Design" },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-8">
          Topics covered
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {techs.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50"
            >
              <span>{t.icon}</span>
              {t.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="py-20 bg-brand-600">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Ready to start preparing?
        </h2>
        <p className="text-brand-100 mb-8 text-base max-w-xl mx-auto">
          Join thousands of Python developers who landed their dream jobs using
          PyPrep. Start free, no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-brand-700 text-sm font-semibold px-6 py-3 rounded-md hover:bg-brand-50 transition-colors"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto text-sm font-medium text-brand-200 hover:text-white py-3"
          >
            See pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm">PyPrep</span>
            </div>
            <p className="text-xs leading-relaxed">
              The complete Python interview prep platform. Learn, practice, and
              ace your interviews.
            </p>
          </div>

          {[
            {
              title: "Learn",
              links: ["Python Basics", "FastAPI", "Django", "System Design"],
            },
            {
              title: "Practice",
              links: ["Coding Playground", "Mock Interviews", "Resume Interview", "Question Bank"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wide mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-xs hover:text-slate-200 transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2025 PyPrep. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-200">Privacy</Link>
            <Link href="#" className="hover:text-slate-200">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Tracks />
      <SampleQuestion />
      <TechCoverage />
      <CTA />
      <Footer />
    </div>
  );
}
