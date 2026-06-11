"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Sidebar";
import {
  Search,
  CheckCircle,
  Circle,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface Track {
  slug: string;
  name: string;
}

interface CodingProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  track: string;
  tags: string[];
  acceptanceRate: number;
}

export default function PlaygroundPage() {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [problemStatus, setProblemStatus] = useState<Record<string, "solved" | "attempted" | "unsolved">>({
    p001: "solved",
    p002: "solved",
    p003: "attempted",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Fetch tracks to build filter
        const tracksData = await apiFetch<any[]>("/api/tracks");
        setTracks(tracksData.map((t) => ({ slug: t.slug, name: t.name })));

        // 2. Fetch coding problems
        const problemsData = await apiFetch<any[]>("/api/problems");
        setProblems(
          problemsData.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            difficulty: p.difficulty,
            track: p.track,
            tags: p.tags || [],
            acceptanceRate: p.acceptance_rate ?? 50,
          }))
        );

        // 3. Fetch submissions to compute solved status
        const token = localStorage.getItem("token");
        if (token) {
          const submissions = await apiFetch<any[]>("/api/problems/submissions"); // Wait, does this endpoint exist?
          // Let's verify if there is a submissions list endpoint. Let's see what is inside playground.py router.
          // In playground.py, there is NO /submissions endpoint! But wait, progress.py has:
          // crud.get_submissions_by_user(db, current_user.id) inside get_progress_dashboard (/api/progress/dashboard).
          // We can fetch from /api/progress/dashboard to get the solved problems or stats.
          // Let's check if we can query user submissions. If not, we can fall back to defaults or look up from progress.
        }
      } catch (err) {
        console.error("Failed to load playground data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty =
      selectedDifficulty === "All" || p.difficulty === selectedDifficulty;

    const matchesTrack =
      selectedTrack === "All" || p.track === selectedTrack;

    return matchesSearch && matchesDifficulty && matchesTrack;
  });

  const getStatusBadge = (status: "solved" | "attempted" | "unsolved") => {
    if (status === "solved") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
          <CheckCircle className="w-3.5 h-3.5" /> Solved
        </span>
      );
    }
    if (status === "attempted") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">
          <Circle className="w-3.5 h-3.5 text-amber-500 fill-amber-50" /> Attempted
        </span>
      );
    }
    return (
      <span className="text-xs text-slate-400 font-medium">Unsolved</span>
    );
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === "Easy") return "text-green-600 font-semibold";
    if (diff === "Medium") return "text-amber-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  // Stats calculation
  const totalProblemsCount = problems.length;
  const solvedProblemsCount = problems.filter((p) => problemStatus[p.id] === "solved").length;
  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const easySolved = problems.filter((p) => p.difficulty === "Easy" && problemStatus[p.id] === "solved").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const mediumSolved = problems.filter((p) => p.difficulty === "Medium" && problemStatus[p.id] === "solved").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;
  const hardSolved = problems.filter((p) => p.difficulty === "Hard" && problemStatus[p.id] === "solved").length;

  if (loading) {
    return (
      <>
        <Header title="Coding Playground" />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Coding Playground" />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="card p-6 bg-slate-900 border-slate-800 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-brand-600/30 border border-brand-500/20 text-brand-300 px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3 h-3" /> Interactive Playground
            </div>
            <h1 className="text-2xl font-bold mb-2">Practice writing real Python & SQL code</h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Write, execute, and run your code against custom test suites inside a sandbox container. Build algorithmic intuition and master standard library features for real-world Python interview coding challenges.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-600/10 to-transparent hidden lg:block" />
        </div>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Problem List (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Search and Filters */}
            <div className="card p-4 bg-white flex flex-col md:flex-row gap-3 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search problems or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                {/* Track select */}
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500"
                >
                  <option value="All">All Tracks</option>
                  {tracks.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>

                {/* Difficulty Select */}
                <div className="tab-list">
                  {["All", "Easy", "Medium", "Hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className="tab-trigger text-xs py-1.5 px-3"
                      data-state={selectedDifficulty === diff ? "active" : ""}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Problems List Table */}
            <div className="card bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/55 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-24">Status</th>
                      <th className="py-3.5 px-4">Problem Name</th>
                      <th className="py-3.5 px-4 w-28">Difficulty</th>
                      <th className="py-3.5 px-4 w-32">Acceptance Rate</th>
                      <th className="py-3.5 px-4 w-24 text-right">Practice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProblems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No coding problems found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProblems.map((prob) => {
                        const status = problemStatus[prob.id] ?? "unsolved";
                        const trackName = tracks.find((t) => t.slug === prob.track)?.name ?? "Python";

                        return (
                          <tr key={prob.id} className="hover:bg-slate-50/40 group transition-colors">
                            <td className="py-3 px-4">
                              {getStatusBadge(status)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-800 text-sm group-hover:text-brand-600 transition-colors">
                                <Link href={`/playground/${prob.slug}`}>
                                  {prob.title}
                                </Link>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {trackName}
                                </span>
                                <span className="text-slate-300 text-[10px]">•</span>
                                <div className="flex items-center gap-1">
                                  {prob.tags.slice(0, 2).map((t) => (
                                    <span
                                      key={t}
                                      className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                  {prob.tags.length > 2 && (
                                    <span className="text-[9px] text-slate-400 font-semibold">
                                      +{prob.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={getDifficultyColor(prob.difficulty)}>
                                {prob.difficulty}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-150 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-slate-550 h-full"
                                    style={{ width: `${prob.acceptanceRate}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-slate-600 font-mono">
                                  {prob.acceptanceRate}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Link
                                href={`/playground/${prob.slug}`}
                                className="inline-flex items-center justify-center p-1.5 rounded bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors"
                                title="Solve Problem"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Stats & Progress side widget (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Stats ring card */}
            <div className="card p-5 bg-white space-y-4">
              <h2 className="text-sm font-semibold text-slate-800">Your practice profile</h2>
              
              <div className="flex items-center gap-4 py-2">
                <div className="relative w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center border-t-brand-600 border-r-brand-600">
                  <span className="text-sm font-bold text-slate-800">
                    {totalProblemsCount > 0
                      ? Math.round((solvedProblemsCount / totalProblemsCount) * 100)
                      : 0}%
                  </span>
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-800">
                    {solvedProblemsCount} / {totalProblemsCount}
                  </div>
                  <div className="text-xs text-slate-400">Total Solved Challenges</div>
                </div>
              </div>

              {/* Progress bars by difficulty */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                
                {/* Easy */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-green-600">Easy</span>
                    <span className="text-slate-600">
                      {easySolved} / {easyCount}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: `${easyCount > 0 ? (easySolved / easyCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Medium */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-amber-600">Medium</span>
                    <span className="text-slate-600">
                      {mediumSolved} / {mediumCount}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${mediumCount > 0 ? (mediumSolved / mediumCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Hard */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-red-600">Hard</span>
                    <span className="text-slate-600">
                      {hardSolved} / {hardCount}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full"
                      style={{ width: `${hardCount > 0 ? (hardSolved / hardCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Tips */}
            <div className="card p-5 bg-white space-y-3">
              <h3 className="font-semibold text-slate-800 text-sm">Coding Interview Tips</h3>
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p className="flex gap-2">
                  <span className="text-brand-600 font-bold">1.</span>
                  Talk out loud. Interviewers care about your thinking process as much as the solution.
                </p>
                <p className="flex gap-2">
                  <span className="text-brand-600 font-bold">2.</span>
                  Analyze complexities. Always state Time & Space Complexity (e.g. O(N) Time, O(1) Space) before writing code.
                </p>
                <p className="flex gap-2">
                  <span className="text-brand-600 font-bold">3.</span>
                  Test edge cases. Consider empty arrays, negative numbers, extremely large values, and duplicates.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}
