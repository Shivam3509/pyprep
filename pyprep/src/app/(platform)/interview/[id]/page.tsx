"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Sidebar";
import {
  Mic,
  MicOff,
  Send,
  Clock,
  User,
  Brain,
  Award,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string | Date;
}

interface Report {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  created_at: string;
}

interface InterviewSession {
  id: string;
  status: string;
  experience_level: string;
  domain: string;
  company_type: string;
  persona_id: string;
  overall_score: number | null;
  messages: Message[];
  reports: Report[];
}

export default function LiveInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sessionId } = use(params);

  // States
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [interviewStatus, setInterviewStatus] = useState<"ongoing" | "review">("ongoing");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load
  useEffect(() => {
    async function loadSession() {
      setLoading(true);
      setError(false);
      try {
        const data = await apiFetch<InterviewSession>(`/api/interviews/${sessionId}`);
        setSession(data);
        setMessages(data.messages || []);
        setInterviewStatus(data.status === "review" ? "review" : "ongoing");
        
        if (data.status === "review" && data.reports && data.reports.length > 0) {
          setReport(data.reports[0]);
        }
      } catch (err) {
        console.error("Failed to load interview session:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [sessionId]);

  // 2. Timer effect
  useEffect(() => {
    if (interviewStatus !== "ongoing") return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [interviewStatus]);

  // 3. Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    const typedMessage = inputVal.trim();
    setInputVal("");
    setIsTyping(true);

    // Optimistically add user message to list
    const userMsg: Message = {
      id: `msg-opt-${Date.now()}`,
      sender: "user",
      text: typedMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const updatedSession = await apiFetch<InterviewSession>(`/api/interviews/${sessionId}/message`, {
        method: "POST",
        body: JSON.stringify({ text: typedMessage }),
      });

      setSession(updatedSession);
      setMessages(updatedSession.messages || []);
      
      if (updatedSession.status === "review") {
        setInterviewStatus("review");
        if (updatedSession.reports && updatedSession.reports.length > 0) {
          setReport(updatedSession.reports[0]);
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Mock typing speech transcription
      setTimeout(() => {
        setInputVal("Based on my experience, mutable types can be modified in-place which means their reference stays the same. Immutable types create a new object when altered. For instance, lists are mutable while tuples are immutable.");
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleEndSession = async () => {
    if (confirm("Are you sure you want to end this interview session? You will receive immediate partial grading feedback.")) {
      setLoading(true);
      try {
        // Send a force-end message or update status directly. In our API message handler:
        // if candidate submits, and we want to end, we can trigger report generation by sending a final message
        const updatedSession = await apiFetch<InterviewSession>(`/api/interviews/${sessionId}/message`, {
          method: "POST",
          body: JSON.stringify({ text: "[Candidate chose to end the session and request grading report]" }),
        });
        
        setSession(updatedSession);
        setMessages(updatedSession.messages || []);
        setInterviewStatus("review");
        if (updatedSession.reports && updatedSession.reports.length > 0) {
          setReport(updatedSession.reports[0]);
        }
      } catch (err) {
        console.error("Failed to end interview session:", err);
        setInterviewStatus("review");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Mock Interview" />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-slate-50">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  if (error || !session) {
    return notFound();
  }

  // Find persona
  const personaName =
    session.persona_id === "sarah"
      ? "Sarah (Analytical & Strict)"
      : session.persona_id === "david"
      ? "David (Cooperative & Encouraging)"
      : "Michael (Socratic & Deep)";
  
  const personaAvatar = session.persona_id === "sarah" ? "👩‍💼" : session.persona_id === "david" ? "👨‍💻" : "👴";
  const domainName = session.domain.replace("-", " ").toUpperCase();
  const level = session.experience_level;

  return (
    <>
      <Header title={`Mock Interview Session — ${sessionId.toUpperCase()}`} />
      
      <div className="p-6 max-w-7xl mx-auto">
        
        {interviewStatus === "ongoing" ? (
          /* ONGOING INTERVIEW INTERFACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-160px)]">
            
            {/* Left Chat Window (col-span-8) */}
            <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden h-full shadow-xs">
              
              {/* Active Header */}
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-slate-150 rounded-lg">{personaAvatar}</span>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">{personaName}</h2>
                    <p className="text-[10px] text-slate-450 font-medium">Interviewer · Active Session</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-slate-200/60 px-3 py-1 rounded text-xs font-mono font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-500 animate-pulse" />
                    {formatTime(seconds)}
                  </div>
                  <button
                    onClick={handleEndSession}
                    className="text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    End Session
                  </button>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/20">
                {messages.map((msg, idx) => {
                  const isAI = msg.sender === "ai";
                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 max-w-[80%] ${isAI ? "self-start" : "self-end ml-auto flex-row-reverse"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                          isAI ? "bg-slate-200 text-slate-700" : "bg-brand-600 text-white"
                        }`}
                      >
                        {isAI ? personaAvatar : <User className="w-4 h-4" />}
                      </div>
                      <div
                        className={`p-3.5 rounded-lg text-sm border leading-relaxed ${
                          isAI
                            ? "bg-white border-slate-155 text-slate-850 rounded-tl-none"
                            : "bg-brand-50 border-brand-200 text-slate-900 rounded-tr-none"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-3 max-w-[80%] self-start">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-755 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {personaAvatar}
                    </div>
                    <div className="bg-white border border-slate-150 p-4 rounded-lg rounded-tl-none flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Message Entry box */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-150 flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                    isRecording
                      ? "bg-rose-100 border-rose-300 text-rose-600 animate-pulse"
                      : "bg-slate-55 bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                  title="Simulate speech to text input"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    isRecording ? "Listening & transcribing spoken response..." : "Type your answer here..."
                  }
                  disabled={isRecording || isTyping}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 disabled:opacity-60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping || isRecording}
                  className="bg-brand-600 hover:bg-brand-700 text-white p-2.5 rounded-md shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

            {/* Right Meta details (col-span-4) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Progress Summary */}
              <div className="card p-5 bg-white space-y-4 border-slate-200 shadow-xs">
                <h3 className="font-semibold text-slate-800 text-sm">Session Progress</h3>
                
                <div className="flex items-center justify-between text-xs font-semibold text-slate-650">
                  <span>Questions Handled</span>
                  <span>
                    {messages.filter(m => m.sender === "user").length} Questions
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, (messages.filter(m => m.sender === "user").length / 6) * 100)}%` }}
                  />
                </div>

                <div className="pt-2 grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="bg-slate-50 border border-slate-150 p-2.5 rounded">
                    <span className="text-slate-450 block font-semibold text-[10px] uppercase">Domain</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">{domainName}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 p-2.5 rounded">
                    <span className="text-slate-450 block font-semibold text-[10px] uppercase">Target Level</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{level}</span>
                  </div>
                </div>
              </div>

              {/* Real-time Assistant Tips */}
              <div className="card p-5 bg-white border-slate-200 shadow-xs space-y-3">
                <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1">
                  <Brain className="w-4 h-4 text-brand-600 animate-pulse" />
                  Live Interview Coach
                </h3>
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <div className="p-2.5 bg-brand-50 border border-brand-100 rounded text-brand-850 font-medium">
                    🔍 <strong>Pro Tip:</strong> Focus on explaining the complexity implications of your choices.
                  </div>
                  <p>
                    Ensure your answers are structured: state the definition, give a code/syntax example mentally, and contrast it with alternatives.
                  </p>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* COMPREHENSIVE FEEDBACK REPORT PANEL */
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            
            {/* Header score card */}
            <div className="card p-6 bg-slate-900 border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950 px-2.5 py-1 rounded">
                  <Award className="w-3.5 h-3.5" /> Interview Completed
                </div>
                <h1 className="text-2xl font-bold">Your Technical Evaluation Report</h1>
                <p className="text-xs text-slate-400">
                  Focus: {domainName} ({level} level) · Assessment Session: {sessionId.toUpperCase()}
                </p>
              </div>

              <div className="text-center p-4 bg-slate-800 rounded-lg border border-slate-700 min-w-36">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Overall Score</div>
                <div className="text-3xl font-extrabold text-green-400 mt-1">
                  {session.overall_score !== null ? `${session.overall_score} / 100` : "Calculating..."}
                </div>
                <div className="text-[10px] text-green-400 mt-0.5 font-semibold">
                  {session.overall_score && session.overall_score >= 70 ? "Strong Performance" : "Needs Practice"}
                </div>
              </div>
            </div>

            {report ? (
              <>
                {/* Detailed metrics split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Strengths Card */}
                  <div className="card p-5 bg-white border-slate-200 space-y-3 shadow-xs">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 fill-green-50" />
                      Key Strengths
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                      {report.strengths?.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses Card */}
                  <div className="card p-5 bg-white border-slate-200 space-y-3 shadow-xs">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 fill-amber-50" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                      {report.weaknesses?.map((weak, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Summary / Improvements */}
                <div className="card p-5 bg-white border-slate-200 shadow-xs space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm">Session Summary & Recommendations</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 border border-slate-100 rounded-lg">
                    {report.summary}
                  </p>
                  
                  <div className="pt-2">
                    <h4 className="font-semibold text-slate-800 text-xs mb-2">Step-by-Step Improvement Plan:</h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {report.improvements?.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-brand-500 font-bold">{idx + 1}.</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="card p-6 text-center text-slate-500 text-sm">
                Generating evaluation report summary...
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/interview"
                className="py-2.5 px-5 rounded font-semibold text-xs bg-brand-600 hover:bg-brand-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                Back to Interview Hub
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </>
  );
}
