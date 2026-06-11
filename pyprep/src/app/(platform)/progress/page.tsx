"use client";

import { Header } from "@/components/layout/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Flame,
  Award,
  TrendingUp,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingDown,
  ChevronRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

const weeklyData = [
  { day: "Mon", hours: 2.4 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.5 },
  { day: "Thu", hours: 0.5 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 4.2 },
  { day: "Sun", hours: 1.5 },
];

const skillData = [
  { subject: "Python OOP", A: 85, B: 110, fullMark: 100 },
  { subject: "GIL & Async", A: 55, B: 130, fullMark: 100 },
  { subject: "Django", A: 75, B: 130, fullMark: 100 },
  { subject: "FastAPI", A: 90, B: 100, fullMark: 100 },
  { subject: "SQL Window", A: 65, B: 90, fullMark: 100 },
  { subject: "RAG & LLM", A: 40, B: 80, fullMark: 100 },
];

// Mock activity cells for contribution matrix (last 6 weeks)
const weeks = Array.from({ length: 6 }, (_, wIdx) => {
  return Array.from({ length: 7 }, (_, dIdx) => {
    // Generate random intensity: 0, 1, 2, 3
    const val = (wIdx * dIdx + 3) % 4;
    return val;
  });
});

export default function ProgressDashboardPage() {
  const streak = 14;

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return "bg-slate-100 border-slate-200";
    if (intensity === 1) return "bg-blue-100 border-blue-200";
    if (intensity === 2) return "bg-blue-300 border-blue-400";
    return "bg-blue-600 border-blue-700";
  };

  return (
    <>
      <Header title="Your Progress Analytics" />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Stats Summary Panel */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Streak */}
          <div className="card p-4 bg-white flex items-center gap-4 border-slate-200 shadow-xs">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 flex-shrink-0">
              <Flame className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-800">{streak} Days</div>
              <div className="text-xs text-slate-400">Current Study Streak</div>
            </div>
          </div>

          {/* Card 2: Hours */}
          <div className="card p-4 bg-white flex items-center gap-4 border-slate-200 shadow-xs">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-brand-600 flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-800">42.8 hrs</div>
              <div className="text-xs text-slate-400">Total Practice Time</div>
            </div>
          </div>

          {/* Card 3: Questions Solved */}
          <div className="card p-4 bg-white flex items-center gap-4 border-slate-200 shadow-xs">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-800">142 Solved</div>
              <div className="text-xs text-slate-400">Across 6 Tracks</div>
            </div>
          </div>

          {/* Card 4: Average Interview Score */}
          <div className="card p-4 bg-white flex items-center gap-4 border-slate-200 shadow-xs">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-800">76% Avg</div>
              <div className="text-xs text-slate-400">Mock Interview Accuracy</div>
            </div>
          </div>
        </div>

        {/* Charts Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Weekly activity Bar chart */}
          <div className="card p-5 bg-white border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-850 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-600" />
              Weekly Commitment (Hours)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "#f1f5f9" }} />
                  <Bar dataKey="hours" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Radar chart */}
          <div className="card p-5 bg-white border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-850 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              Technical Domain Performance
            </h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 10, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                  <Radar name="Student" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Heatmap & Weak/Strong areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Heatmap grid */}
          <div className="card p-5 bg-white border-slate-200 shadow-xs lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Daily Activity Calendar</h3>
            <p className="text-xs text-slate-500">Practice consistency visualizer over the last 6 weeks:</p>
            
            <div className="flex gap-2.5 overflow-x-auto py-2">
              <div className="grid grid-rows-7 gap-1.5 text-[10px] text-slate-400 font-semibold uppercase pr-1">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>
              <div className="flex gap-1.5 flex-1 min-w-[200px]">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="grid grid-rows-7 gap-1.5 flex-1">
                    {week.map((intensity, dIdx) => (
                      <div
                        key={dIdx}
                        className={`h-4 rounded border transition-all ${getIntensityColor(intensity)}`}
                        title={`Activity level: ${intensity}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-50 justify-end">
              <span>Less</span>
              <div className="w-3.5 h-3.5 rounded border bg-slate-100 border-slate-200" />
              <div className="w-3.5 h-3.5 rounded border bg-blue-100 border-blue-200" />
              <div className="w-3.5 h-3.5 rounded border bg-blue-300 border-blue-400" />
              <div className="w-3.5 h-3.5 rounded border bg-blue-600 border-blue-700" />
              <span>More</span>
            </div>
          </div>

          {/* Strengths & Weaknesses (col-span-1) */}
          <div className="space-y-4">
            
            {/* Weak area warning */}
            <div className="card p-5 bg-white border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-red-500" />
                Suggested Weak Areas
              </h3>
              
              <div className="space-y-2">
                <div className="p-2.5 bg-rose-50/50 border border-rose-100 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                    <span>GIL & Concurrency</span>
                    <span>55% Accuracy</span>
                  </div>
                  <p className="text-[10px] text-rose-700 leading-normal">
                    Fails to detail Process pools vs Thread pools correctly.
                  </p>
                  <Link
                    href="/tracks/advanced-python/gil-concurrency"
                    className="text-[10px] text-brand-600 font-bold flex items-center gap-0.5 hover:underline pt-1"
                  >
                    Study Concept
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="p-2.5 bg-rose-50/50 border border-rose-100 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                    <span>SQL Window Functions</span>
                    <span>65% Accuracy</span>
                  </div>
                  <p className="text-[10px] text-rose-700 leading-normal">
                    Struggles with framing clause constraints (ROWS vs RANGE).
                  </p>
                  <Link
                    href="/tracks/sql-databases/window-functions"
                    className="text-[10px] text-brand-600 font-bold flex items-center gap-0.5 hover:underline pt-1"
                  >
                    Study Concept
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}
