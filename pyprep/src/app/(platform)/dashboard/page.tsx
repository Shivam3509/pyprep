"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Sidebar";
import { tracks } from "@/lib/data/tracks";
import { questions } from "@/lib/data/questions";
import {
  CheckCircle,
  Flame,
  Target,
  Clock,
  ChevronRight,
  Code2,
  Brain,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import { apiFetch } from "@/lib/api";

interface DashboardData {
  streak: number;
  total_time_hours: number;
  solved_questions_count: number;
  avg_interview_score: number;
  weekly_hours: { day: string; hours: number }[];
  domain_scores: { subject: string; A: number }[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-brand-600",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="card p-5 bg-white border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const data = await apiFetch<DashboardData>("/api/progress/dashboard");
        setDashboard(data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  // Fallback states for guests
  const data = dashboard || {
    streak: 3,
    total_time_hours: 4.5,
    solved_questions_count: 12,
    avg_interview_score: 70,
    weekly_hours: [
      { day: "Mon", hours: 1 },
      { day: "Tue", hours: 2 },
      { day: "Wed", hours: 0.5 },
      { day: "Thu", hours: 0 },
      { day: "Fri", hours: 1 },
      { day: "Sat", hours: 0 },
      { day: "Sun", hours: 0 },
    ],
    domain_scores: [
      { subject: "Python Basics", A: 50 },
      { subject: "OOP", A: 30 },
      { subject: "FastAPI", A: 0 },
    ],
  };

  const displayName = user?.name || "Candidate";
  const displayLevel = user?.experience_level || "Intermediate";
  const displayTier = user?.tier || "Free";

  const continueTracks = tracks.slice(0, 3);
  const reviewQuestions = questions.slice(0, 4);

  return (
    <>
      <Header title="" />
      <div className="p-6 max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Good afternoon, {displayName} 👋
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {displayLevel} level ({displayTier} tier) · Keep up the streak!
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/interview"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-center transition-colors"
          >
            <span className="text-xl">🎤</span>
            <span className="text-xs font-semibold text-slate-700">Start mock interview</span>
          </Link>
          <Link
            href="/playground"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-center transition-colors"
          >
            <span className="text-xl">💻</span>
            <span className="text-xs font-semibold text-slate-700">Practice coding</span>
          </Link>
          <Link
            href="/resume"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-center transition-colors"
          >
            <span className="text-xl">📄</span>
            <span className="text-xs font-semibold text-slate-700">Resume interview</span>
          </Link>
          <Link
            href="/progress"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-center transition-colors"
          >
            <span className="text-xl">📊</span>
            <span className="text-xs font-semibold text-slate-700">View progress</span>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard
            icon={CheckCircle}
            label="Questions solved"
            value={data.solved_questions_count}
            sub="Total solved concepts"
            color="text-green-600"
          />
          <StatCard
            icon={Target}
            label="Avg Score"
            value={`${data.avg_interview_score}%`}
            sub="AI Interviews performance"
          />
          <StatCard
            icon={Clock}
            label="Total Hours"
            value={data.total_time_hours}
            sub="Study hours completed"
            color="text-purple-600"
          />
          <StatCard
            icon={Brain}
            label="Streak"
            value={`${data.streak} Days`}
            sub="Daily learning streak"
            color="text-orange-600"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 space-y-4">
            
            {/* Today's Goal */}
            <div className="card p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Today's goal</h3>
                  <p className="text-xs text-slate-500">
                    Keep practicing to retain key technical patterns.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-semibold">{data.streak} day streak</span>
                </div>
              </div>
              <div className="progress-bar mb-2">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.min(100, (data.solved_questions_count / 15) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{Math.round(Math.min(100, (data.solved_questions_count / 15) * 100))}% toward target</span>
                <span>Goal: 15 questions solved</span>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="card p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 text-sm">Recommended tracks</h3>
                <Link
                  href="/tracks"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {continueTracks.map((track, i) => {
                  const pct = [45, 12, 5][i];
                  return (
                    <Link
                      key={track.slug}
                      href={`/tracks/${track.slug}`}
                      className="flex items-center gap-3 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors group"
                    >
                      <div className="text-xl flex-shrink-0">{track.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 group-hover:text-brand-600 truncate">
                          {track.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 progress-bar" style={{ height: "4px" }}>
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-400 flex-shrink-0">
                            {pct}%
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Questions to review */}
            <div className="card p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 text-sm">
                  Questions to review
                </h3>
                <Link
                  href="/tracks"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  Browse all →
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {reviewQuestions.map((q) => (
                  <Link
                    key={q.id}
                    href={`/tracks/${q.track}/${q.topic.toLowerCase().replace(/ /g, "-")}`}
                    className="py-3 flex items-center gap-3 hover:bg-slate-50 -mx-5 px-5 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 group-hover:text-brand-600 truncate">
                        {q.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400">{q.topic}</span>
                      </div>
                    </div>
                    <span
                      className={
                        q.difficulty === "Easy"
                          ? "badge-easy"
                          : q.difficulty === "Medium"
                          ? "badge-medium"
                          : "badge-hard"
                      }
                    >
                      {q.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-4">
            
            {/* Weekly Activity */}
            <div className="card p-5 bg-white border-slate-200">
              <h3 className="font-semibold text-slate-900 text-sm mb-4">
                Hours Studied (This Week)
              </h3>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={data.weekly_hours} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="hours" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Topic Progress */}
            <div className="card p-5 bg-white border-slate-200">
              <h3 className="font-semibold text-slate-900 text-sm mb-4">
                Focus Areas Proficiency
              </h3>
              <div className="space-y-3">
                {data.domain_scores.map((score, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-700 font-medium">{score.subject}</span>
                      <span className="text-slate-400">{score.A}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${score.A}%`,
                          background:
                            score.A >= 80
                              ? "#16a34a"
                              : score.A >= 50
                              ? "#2563eb"
                              : "#d97706",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
