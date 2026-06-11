"use client";

import Link from "next/link";
import { useState } from "react";
import { Code2, ArrowRight, CheckCircle, ChevronRight } from "lucide-react";

const levels = [
  {
    id: "fresher",
    label: "Fresher",
    years: "0–1 Years",
    emoji: "🌱",
    description:
      "Just starting out or < 1 year of experience. We'll cover Python basics, OOP, SQL, REST APIs, and problem solving.",
    tracks: [
      "Python Fundamentals",
      "SQL Basics",
      "REST API Basics",
      "Git & Version Control",
    ],
    interviews: ["Python Fundamentals", "OOP", "SQL Basics", "Problem Solving"],
    color: "border-green-300 bg-green-50",
    activeColor: "border-green-500 bg-green-50 ring-2 ring-green-200",
    badgeColor: "bg-green-100 text-green-700",
    btnColor: "bg-green-600 hover:bg-green-700",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    years: "1–3 Years",
    emoji: "⚡",
    description:
      "1–3 years of industry experience. Focus on FastAPI, Django, async Python, databases, Redis, Docker, and backend design.",
    tracks: [
      "Advanced Python",
      "FastAPI",
      "Django & DRF",
      "PostgreSQL",
      "Machine Learning",
    ],
    interviews: [
      "Backend Development",
      "API Design",
      "Database Design",
      "Performance",
    ],
    color: "border-blue-300 bg-blue-50",
    activeColor: "border-blue-500 bg-blue-50 ring-2 ring-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    btnColor: "bg-brand-600 hover:bg-brand-700",
  },
  {
    id: "senior",
    label: "Senior",
    years: "3–5 Years",
    emoji: "🏆",
    description:
      "3–5 years of experience. Covers System Design, microservices, Kafka, Kubernetes, LLMs, RAG, and architecture leadership.",
    tracks: [
      "System Design",
      "Deep Learning",
      "LLMs & RLHF",
      "RAG Systems",
      "DevOps & Kubernetes",
    ],
    interviews: [
      "Architecture Decisions",
      "Trade-offs",
      "System Design",
      "Leadership",
    ],
    color: "border-purple-300 bg-purple-50",
    activeColor: "border-purple-500 bg-purple-50 ring-2 ring-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
    btnColor: "bg-purple-600 hover:bg-purple-700",
  },
];

import { useAuthStore } from "@/lib/authStore";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, fetchMe } = useAuthStore();
  const [selected, setSelected] = useState<string>("intermediate");
  const [isSaving, setIsSaving] = useState(false);

  const chosen = levels.find((l) => l.id === selected)!;

  const handleStartPath = async () => {
    setIsSaving(true);
    if (isAuthenticated) {
      try {
        await apiFetch("/api/auth/update", {
          method: "PUT",
          body: JSON.stringify({ experience_level: chosen.label }),
        });
        await fetchMe();
      } catch (err) {
        console.error("Failed to update experience level:", err);
      }
    }
    setIsSaving(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm">PyPrep</span>
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-600">Choose your experience level</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start py-12 px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Where are you in your journey?
            </h1>
            <p className="text-slate-600 text-sm">
              We'll build a personalized learning path based on your experience.
              You can always switch later.
            </p>
          </div>

          {/* Level Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelected(level.id)}
                className={`text-left p-5 rounded-xl border-2 transition-all cursor-pointer ${
                  selected === level.id ? level.activeColor : level.color
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">{level.emoji}</div>
                  {selected === level.id && (
                    <CheckCircle className="w-5 h-5 text-brand-600" />
                  )}
                </div>
                <div className="font-semibold text-slate-900 mb-0.5">
                  {level.label}
                </div>
                <div
                  className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-3 ${level.badgeColor}`}
                >
                  {level.years}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {level.description}
                </p>
              </button>
            ))}
          </div>

          {/* Details for selected level */}
          <div className="card p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  📚 Your learning tracks
                </h3>
                <ul className="space-y-2">
                  {chosen.tracks.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  🎤 Mock interview focus areas
                </h3>
                <ul className="space-y-2">
                  {chosen.interviews.map((i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleStartPath}
              disabled={isSaving}
              className={`inline-flex items-center gap-2 text-white text-sm font-semibold px-8 py-3 rounded-md transition-colors cursor-pointer ${chosen.btnColor} disabled:opacity-50`}
            >
              {isSaving ? "Saving Selection..." : `Start my ${chosen.label} learning path`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
