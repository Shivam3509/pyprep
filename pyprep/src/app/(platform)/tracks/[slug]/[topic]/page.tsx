"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Sidebar";
import {
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Lock,
  Copy,
  Check,
  Code2,
  HelpCircle,
  AlertTriangle,
  Play,
  Lightbulb,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  isPremium: boolean;
  subtopics: string[];
}

interface TrackDetail {
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
  topics: Topic[];
}

interface Question {
  id: string;
  topic_id: string;
  track_slug: string;
  difficulty: string;
  title: string;
  question: string;
  answer: string;
  expectations: string[];
  commonMistakes: string[];
  followUps: string[];
  codeExample: string | null;
  tags: string[];
}

interface CodingProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  track: string;
  acceptanceRate: number;
}

export default function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) {
  const { slug: trackSlug, topic: topicSlug } = use(params);

  // States
  const [track, setTrack] = useState<TrackDetail | null>(null);
  const [topicQuestions, setTopicQuestions] = useState<Question[]>([]);
  const [relatedProblems, setRelatedProblems] = useState<CodingProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [solvedStatus, setSolvedStatus] = useState<Record<string, "solved" | "in-progress" | "unsolved">>({
    q001: "solved",
    q002: "in-progress",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(false);
      try {
        // 1. Fetch Track Detail
        const trackData = await apiFetch<any>(`/api/tracks/${trackSlug}`);
        const mappedTrack: TrackDetail = {
          ...trackData,
          topics: (trackData.topics || []).map((t: any) => ({
            id: t.id,
            slug: t.slug,
            title: t.title,
            description: t.description,
            estimatedMinutes: t.estimated_minutes ?? 0,
            isPremium: t.is_premium ?? false,
            subtopics: t.subtopics || [],
          })),
        };
        setTrack(mappedTrack);

        // 2. Fetch Topic Questions
        const questionsData = await apiFetch<any[]>(`/api/topics/${topicSlug}/questions`);
        const mappedQuestions: Question[] = questionsData.map((q: any) => ({
          id: q.id,
          topic_id: q.topic_id,
          track_slug: q.track_slug,
          difficulty: q.difficulty,
          title: q.title,
          question: q.question,
          answer: q.answer,
          expectations: q.expectations || [],
          commonMistakes: q.common_mistakes || [],
          followUps: q.follow_ups || [],
          codeExample: q.code_example || null,
          tags: q.tags || [],
        }));
        setTopicQuestions(mappedQuestions);
        if (mappedQuestions.length > 0) {
          setSelectedQuestionId(mappedQuestions[0].id);
        }

        // 3. Fetch Related Coding Problems
        const problemsData = await apiFetch<any[]>("/api/problems");
        const mappedProblems: CodingProblem[] = problemsData
          .filter((p) => p.track === trackSlug)
          .map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            difficulty: p.difficulty,
            track: p.track,
            acceptanceRate: p.acceptance_rate ?? 50,
          }));
        setRelatedProblems(mappedProblems);

      } catch (err) {
        console.error("Failed to load topic details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [trackSlug, topicSlug]);

  const selectedQuestion = topicQuestions.find((q) => q.id === selectedQuestionId);

  const toggleSolved = (qId: string) => {
    setSolvedStatus((prev) => {
      const current = prev[qId];
      if (current === "solved") return { ...prev, [qId]: "unsolved" };
      if (current === "in-progress") return { ...prev, [qId]: "solved" };
      return { ...prev, [qId]: "in-progress" };
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (qId: string) => {
    const status = solvedStatus[qId] ?? "unsolved";
    if (status === "solved") {
      return <CheckCircle2 className="w-4 h-4 text-green-600 fill-green-50" />;
    }
    if (status === "in-progress") {
      return <Circle className="w-4 h-4 text-amber-500 fill-amber-50" />;
    }
    return <Circle className="w-4 h-4 text-slate-300" />;
  };

  if (loading) {
    return (
      <>
        <Header title="Loading Topic..." />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  if (error || !track) {
    return notFound();
  }

  const topic = track.topics.find((t) => t.slug === topicSlug);
  if (!topic) return notFound();

  // Calculate stats for this topic
  const totalQs = topicQuestions.length;
  const solvedQs = topicQuestions.filter((q) => solvedStatus[q.id] === "solved").length;
  const progressPercent = totalQs > 0 ? Math.round((solvedQs / totalQs) * 100) : 0;

  return (
    <>
      <Header title={`${track.name} — ${topic.title}`} />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/tracks" className="hover:text-brand-600">
              Tracks
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/tracks/${trackSlug}`} className="hover:text-brand-600">
              {track.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 font-medium">{topic.title}</span>
          </div>

          <Link
            href={`/tracks/${trackSlug}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Track
          </Link>
        </div>

        {/* Topic Banner */}
        <div className="card p-6 mb-6 bg-white border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl">{track.icon}</span>
                <h1 className="text-xl font-bold text-slate-900">{topic.title}</h1>
                {topic.isPremium && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 max-w-3xl">
                {topic.description}
              </p>
            </div>
            <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              <div className="text-right">
                <div className="text-xs text-slate-500">Topic Progress</div>
                <div className="text-sm font-bold text-slate-800">
                  {solvedQs} / {totalQs} Solved
                </div>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200">
                <span className="text-xs font-semibold text-brand-600">{progressPercent}%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {topic.subtopics?.map((sub) => (
              <span
                key={sub}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-medium"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Main Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: Questions listing (col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-slate-800">
                Questions ({topicQuestions.length})
              </h2>
              <span className="text-[11px] text-slate-400">Select to study</span>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {topicQuestions.length === 0 ? (
                <div className="card p-6 text-center text-slate-500 text-sm">
                  No conceptual questions seeded for this topic yet.
                </div>
              ) : (
                topicQuestions.map((q) => {
                  const isSelected = q.id === selectedQuestionId;
                  const status = solvedStatus[q.id] ?? "unsolved";

                  return (
                    <div
                      key={q.id}
                      onClick={() => {
                        setSelectedQuestionId(q.id);
                        setRevealAnswer(false);
                      }}
                      className={`card p-3.5 transition-all text-left flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? "border-brand-500 bg-brand-50/10 shadow-sm"
                          : "hover:border-slate-300"
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSolved(q.id);
                        }}
                        className="mt-0.5 hover:opacity-80 transition-opacity flex-shrink-0"
                        title={`Status: ${status}. Click to change.`}
                      >
                        {getStatusIcon(q.id)}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={
                              q.difficulty === "Easy"
                                ? "text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100"
                                : q.difficulty === "Medium"
                                ? "text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100"
                                : "text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100"
                            }
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {q.id.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
                          {q.title}
                        </h3>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Middle panel: Selected Question detail (col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            {selectedQuestion ? (
              <div className="card p-6 bg-white border-slate-200 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-500 font-mono">
                      CONCEPT STUDY
                    </span>
                    <span className="text-slate-300">•</span>
                    <span
                      className={`text-[10px] font-bold ${
                        selectedQuestion.difficulty === "Easy"
                          ? "text-green-600"
                          : selectedQuestion.difficulty === "Medium"
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedQuestion.difficulty}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {selectedQuestion.title}
                  </h2>
                </div>

                {/* Question Prompt */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Interview Question:
                  </h3>
                  <p className="text-sm text-slate-800 font-medium italic">
                    &ldquo;{selectedQuestion.question}&rdquo;
                  </p>
                </div>

                {/* Show/Hide Answer Button */}
                <div>
                  <button
                    onClick={() => setRevealAnswer(!revealAnswer)}
                    className={`w-full py-2.5 px-4 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                      revealAnswer
                        ? "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    {revealAnswer ? "Hide Suggested Answer" : "Reveal Suggested Answer"}
                  </button>
                </div>

                {revealAnswer && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Suggested Answer Detail */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        Suggested Answer Explanation
                      </h3>
                      <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-4 border border-slate-100 rounded-lg">
                        {selectedQuestion.answer}
                      </div>
                    </div>

                    {/* Code Example */}
                    {selectedQuestion.codeExample && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Code Demonstration
                          </h3>
                          <button
                            onClick={() => copyToClipboard(selectedQuestion.codeExample || "")}
                            className="text-slate-500 hover:text-slate-700 text-xs flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 transition-all"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-green-600 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="bg-slate-950 text-slate-200 p-4 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-[350px]">
                          <code>{selectedQuestion.codeExample}</code>
                        </pre>
                      </div>
                    )}

                    {/* Expectations */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        What Interviewers Look For
                      </h3>
                      <ul className="space-y-2">
                        {selectedQuestion.expectations?.map((exp, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-green-600 fill-green-50 mt-0.5 flex-shrink-0" />
                            <span>{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Mistakes */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Red Flags & Common Pitfalls
                      </h3>
                      <ul className="space-y-2">
                        {selectedQuestion.commonMistakes?.map((mistake, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                            <AlertTriangle className="w-4 h-4 text-rose-500 fill-rose-50 mt-0.5 flex-shrink-0" />
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Follow-up Questions */}
                    {selectedQuestion.followUps && selectedQuestion.followUps.length > 0 && (
                      <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                          Likely Follow-up Questions
                        </h3>
                        <div className="space-y-2">
                          {selectedQuestion.followUps.map((fu, i) => (
                            <div
                              key={i}
                              className="text-xs text-slate-600 bg-slate-50 border border-slate-150 p-2.5 rounded flex items-start gap-2 font-medium"
                            >
                              <HelpCircle className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                              <span>{fu}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Controls */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Mark status for this question:
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setSolvedStatus((prev) => ({ ...prev, [selectedQuestion.id]: "in-progress" }))
                          }
                          className={`text-xs px-2.5 py-1.5 rounded font-semibold border ${
                            solvedStatus[selectedQuestion.id] === "in-progress"
                              ? "bg-amber-50 border-amber-300 text-amber-700"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() =>
                            setSolvedStatus((prev) => ({ ...prev, [selectedQuestion.id]: "solved" }))
                          }
                          className={`text-xs px-2.5 py-1.5 rounded font-semibold border ${
                            solvedStatus[selectedQuestion.id] === "solved"
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Mark Solved
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-8 text-center text-slate-500 text-sm bg-white">
                Please select a question from the left sidebar to view its details and answers.
              </div>
            )}
          </div>

          {/* Right panel: Navigation & Integrations (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Action Card: Mock Interview */}
            <div className="card p-4 bg-slate-900 border-slate-800 text-white">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">
                AI MOCK INTERVIEW
              </span>
              <h3 className="font-bold text-sm mt-1 mb-2">
                Simulate a live technical interview
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Test your knowledge of <strong className="text-slate-200 font-semibold">{topic.title}</strong> with our AI interviewer. Get scored on depth, correctness, and speed.
              </p>
              <Link
                href={`/interview?track=${trackSlug}&topic=${topic.slug}`}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-500 py-2.5 rounded text-white transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Start AI Session
              </Link>
            </div>

            {/* Related Coding Challenges */}
            {relatedProblems.length > 0 && (
              <div className="card p-4 bg-white border-slate-200">
                <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-brand-600" />
                  Coding Challenges
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Implement concepts programmatically in our playground:
                </p>
                <div className="space-y-2">
                  {relatedProblems.slice(0, 3).map((problem) => (
                    <Link
                      key={problem.id}
                      href={`/playground/${problem.slug}`}
                      className="group flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-700 truncate group-hover:text-brand-600">
                          {problem.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Acceptance: {problem.acceptanceRate}%
                        </div>
                      </div>
                      <span
                        className={
                          problem.difficulty === "Easy"
                            ? "text-[9px] font-semibold text-green-700"
                            : problem.difficulty === "Medium"
                            ? "text-[9px] font-semibold text-amber-700"
                            : "text-[9px] font-semibold text-red-700"
                        }
                      >
                        {problem.difficulty}
                      </span>
                    </Link>
                  ))}
                </div>
                {relatedProblems.length > 3 && (
                  <Link
                    href="/playground"
                    className="text-xs text-brand-600 mt-3 inline-flex items-center gap-1 hover:text-brand-700 font-semibold"
                  >
                    View all coding challenges
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}

            {/* Track Navigation / Syllabus */}
            <div className="card p-4 bg-white border-slate-200">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">
                Track Syllabus
              </h3>
              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                {track.topics.map((t, idx) => {
                  const isActive = t.slug === topicSlug;
                  return (
                    <Link
                      key={t.id}
                      href={`/tracks/${trackSlug}/${t.slug}`}
                      className={`flex items-center justify-between p-2 rounded text-xs transition-colors ${
                        isActive
                          ? "bg-slate-100 font-semibold text-slate-900 border-l-2 border-brand-600 pl-1.5"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono w-4 text-right">
                          {idx + 1}.
                        </span>
                        {t.title}
                      </span>
                      {t.isPremium && <Lock className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
