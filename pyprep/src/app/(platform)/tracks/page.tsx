"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Sidebar";
import { Lock, Clock, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface Track {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color?: string;
  topic_count: number;
  question_count: number;
  estimated_hours: number;
  level: string;
  is_premium: boolean;
}

const levelFilters = ["All", "Fresher", "Intermediate", "Senior"] as const;
type LevelFilter = (typeof levelFilters)[number];

export default function TracksPage() {
  const [filter, setFilter] = useState<LevelFilter>("All");
  const [tracksList, setTracksList] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTracks() {
      try {
        const data = await apiFetch<Track[]>("/api/tracks");
        setTracksList(data);
      } catch (err) {
        console.error("Failed to load tracks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTracks();
  }, []);

  const filtered =
    filter === "All" ? tracksList : tracksList.filter((t) => t.level === filter);

  if (loading) {
    return (
      <>
        <Header title="Learn" />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Learn" />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 mb-1">
            Learning Tracks
          </h1>
          <p className="text-sm text-slate-500">
            Structured paths from Python basics to advanced ML, LLMs, and
            System Design.
          </p>
        </div>

        {/* Filter */}
        <div className="tab-list mb-6">
          {levelFilters.map((l) => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              className="tab-trigger"
              data-state={filter === l ? "active" : "inactive"}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Track grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((track) => (
            <Link
              key={track.slug}
              href={`/tracks/${track.slug}`}
              className="card card-interactive p-5 flex flex-col group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{track.icon}</div>
                <div className="flex items-center gap-2">
                  {track.is_premium && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-yellow-700 bg-yellow-100 border border-yellow-200 px-1.5 py-0.5 rounded">
                      <Lock className="w-2.5 h-2.5" />
                      PRO
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                      track.level === "Fresher"
                        ? "text-green-700 bg-green-50 border-green-200"
                        : track.level === "Intermediate"
                        ? "text-blue-700 bg-blue-50 border-blue-200"
                        : "text-purple-700 bg-purple-50 border-purple-200"
                    }`}
                  >
                    {track.level}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-slate-900 mb-1.5 text-[0.9375rem] group-hover:text-brand-600 transition-colors">
                {track.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                {track.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {track.question_count} questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {track.estimated_hours}h
                </span>
                <span className="ml-auto flex items-center gap-0.5 text-brand-500 font-medium">
                  Start
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
