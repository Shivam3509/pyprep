"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Sidebar";
import { ChevronRight, Lock, Clock, CheckCircle, BookOpen, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimated_minutes: number;
  is_premium: boolean;
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
  common_mistakes: string[];
  follow_ups: string[];
  code_example: string;
  tags: string[];
}

export default function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [track, setTrack] = useState<TrackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [topicQuestionsMap, setTopicQuestionsMap] = useState<Record<string, Question[]>>({});
  const [loadingQuestionsTopic, setLoadingQuestionsTopic] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrackDetail() {
      setLoading(true);
      setError(false);
      try {
        const data = await apiFetch<TrackDetail>(`/api/tracks/${slug}`);
        setTrack(data);
        
        // Expand the first topic and load its questions
        if (data.topics && data.topics.length > 0) {
          const firstTopic = data.topics[0];
          setExpandedTopic(firstTopic.slug);
          
          setLoadingQuestionsTopic(firstTopic.slug);
          const qs = await apiFetch<Question[]>(`/api/topics/${firstTopic.slug}/questions`);
          setTopicQuestionsMap({ [firstTopic.slug]: qs });
          setLoadingQuestionsTopic(null);
        }
      } catch (err) {
        console.error("Failed to load track details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadTrackDetail();
  }, [slug]);

  const handleToggleTopic = async (topicSlug: string) => {
    if (expandedTopic === topicSlug) {
      setExpandedTopic(null);
      return;
    }
    setExpandedTopic(topicSlug);
    
    if (!topicQuestionsMap[topicSlug]) {
      setLoadingQuestionsTopic(topicSlug);
      try {
        const qs = await apiFetch<Question[]>(`/api/topics/${topicSlug}/questions`);
        setTopicQuestionsMap(prev => ({ ...prev, [topicSlug]: qs }));
      } catch (err) {
        console.error("Failed to load topic questions:", err);
      } finally {
        setLoadingQuestionsTopic(null);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Loading Track..." />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  if (error || !track) {
    return notFound();
  }

  return (
    <>
      <Header title={track.name} />
      <div className="p-6 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
          <Link href="/tracks" className="hover:text-brand-600">
            Learn
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700">{track.name}</span>
        </div>

        {/* Track Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{track.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900">
                  {track.name}
                </h1>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
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
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {track.description}
              </p>
              <div className="flex items-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {track.topic_count} topics
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {track.question_count} questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{track.estimated_hours} hours
                </span>
              </div>
            </div>
            {/* Progress */}
            <div className="hidden sm:block text-center">
              <div className="text-2xl font-bold text-brand-600">12%</div>
              <div className="text-xs text-slate-500">Complete</div>
            </div>
          </div>
          <div className="mt-4 progress-bar">
            <div className="progress-bar-fill" style={{ width: "12%" }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topics list */}
          <div className="lg:col-span-2 space-y-2">
            <h2 className="font-semibold text-slate-900 text-sm mb-3">
              Topics in this track
            </h2>
            {track.topics.map((topic, idx) => {
              const isOpen = expandedTopic === topic.slug;
              const topicQs = topicQuestionsMap[topic.slug] || [];
              const isLoadingQs = loadingQuestionsTopic === topic.slug;

              return (
                <div key={topic.id} className="accordion-item">
                  <button
                    className="accordion-trigger"
                    onClick={() => handleToggleTopic(topic.slug)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span>{topic.title}</span>
                          {topic.is_premium && (
                            <Lock className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          {topic.estimated_minutes} min ·{" "}
                          {topic.subtopics?.length || 0} subtopics
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="accordion-content">
                      <p className="text-sm text-slate-600 mb-3">
                        {topic.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {topic.subtopics?.map((s) => (
                          <span
                            key={s}
                            className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Questions in this topic */}
                      {isLoadingQs ? (
                        <div className="flex items-center gap-1.5 py-4 text-xs text-slate-400 font-mono">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                          Loading questions...
                        </div>
                      ) : topicQs.length > 0 ? (
                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            Interview Questions
                          </div>
                          <div className="space-y-1.5">
                            {topicQs.slice(0, 3).map((q) => (
                              <Link
                                key={q.id}
                                href={`/tracks/${slug}/${topic.slug}`}
                                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-slate-50 group"
                              >
                                <span className="text-sm text-slate-700 group-hover:text-brand-600">
                                  {q.title}
                                </span>
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
                          {topicQs.length > 3 && (
                            <Link
                              href={`/tracks/${slug}/${topic.slug}`}
                              className="text-xs text-brand-600 mt-2 inline-block hover:text-brand-700"
                            >
                              +{topicQs.length - 3} more questions →
                            </Link>
                          )}
                        </div>
                      ) : null}

                      <Link
                        href={`/tracks/${slug}/${topic.slug}`}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        Study this topic →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">
                Your progress
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Topics started</span>
                  <span className="font-medium text-slate-700">2 / {track.topic_count}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Questions solved</span>
                  <span className="font-medium text-slate-700">
                    14 / {track.question_count}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Estimated time left</span>
                  <span className="font-medium text-slate-700">
                    ~{Math.round(track.estimated_hours * 0.88)}h
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">
                Mock interview focus
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  "Core concepts",
                  "Code walkthroughs",
                  "Common pitfalls",
                  "Follow-up depth",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link
                href="/interview"
                className="mt-3 block text-center text-xs font-semibold bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700 transition-colors"
              >
                Start mock interview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
