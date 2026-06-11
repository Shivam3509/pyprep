"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Sidebar";
import {
  Brain,
  ChevronRight,
  Shield,
  ArrowRight,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Star,
  Settings,
  Sparkles,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const personas = [
  {
    id: "sarah",
    name: "Sarah (Analytical & Strict)",
    role: "Senior Staff Engineer, Google",
    avatar: "👩‍💼",
    description: "Sarah focuses heavily on trade-offs, edge cases, and runtime optimizations. She offers critical feedback and expects concise explanations.",
  },
  {
    id: "david",
    name: "David (Cooperative & Encouraging)",
    role: "Tech Lead, Stripe",
    avatar: "👨‍💻",
    description: "David likes to collaborate. He guides you with subtle hints if you get stuck and evaluates how you adapt your approach during discussion.",
  },
  {
    id: "michael",
    name: "Michael (Socratic & Deep)",
    role: "Principal Architect, Netflix",
    avatar: "👴",
    description: "Michael asks open-ended conceptual questions and loves drilling down into architectural details, system behaviors, and standard library internals.",
  },
];

interface Track {
  slug: string;
  name: string;
}

export default function InterviewSetupPage() {
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [level, setLevel] = useState("Fresher");
  const [domain, setDomain] = useState("python-fundamentals");
  const [companyType, setCompanyType] = useState("faang");
  const [personaId, setPersonaId] = useState("sarah");
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    async function loadTracks() {
      try {
        const data = await apiFetch<any[]>("/api/tracks");
        setTracks(data.map((t) => ({ slug: t.slug, name: t.name })));
        if (data.length > 0) {
          setDomain(data[0].slug);
        }
      } catch (err) {
        console.error("Failed to load tracks:", err);
      } finally {
        setLoadingTracks(false);
      }
    }
    loadTracks();
  }, []);

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);

    try {
      const session = await apiFetch("/api/interviews/start", {
        method: "POST",
        body: JSON.stringify({
          level,
          domain,
          company_type: companyType,
          persona_id: personaId,
        }),
      });
      router.push(`/interview/${session.id}`);
    } catch (err) {
      console.error("Failed to start mock session:", err);
      alert("Failed to initialize mock interview. Please sign in first.");
    } finally {
      setIsLaunching(false);
    }
  };

  if (loadingTracks) {
    return (
      <>
        <Header title="AI Mock Interview" />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="AI Mock Interview" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        
        {/* Banner header */}
        <div className="card p-6 bg-slate-900 border-slate-800 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-brand-600/30 border border-brand-500/20 text-brand-300 px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3 h-3" /> Live Evaluation
            </div>
            <h1 className="text-2xl font-bold mb-2">Simulate real technical rounds with AI</h1>
            <p className="text-sm text-slate-350 leading-relaxed">
              Configure your interview settings, choose an interviewer persona, and sit for a mock session. Get real-time conversational questions, follow-ups, and a comprehensive breakdown of your performance.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-600/10 to-transparent hidden sm:block" />
        </div>

        {/* Content split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Setup Form (col-span-2) */}
          <div className="lg:col-span-2">
            <form onSubmit={handleStartInterview} className="card p-6 bg-white space-y-6 border-slate-200">
              <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-600" />
                Interview Configuration
              </h2>

              {/* Row 1: Level and Track */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Level */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Experience Target
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Fresher">Fresher (0 - 1 years)</option>
                    <option value="Intermediate">Intermediate (1 - 3 years)</option>
                    <option value="Senior">Senior (3 - 5+ years)</option>
                  </select>
                </div>

                {/* Track Domain */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Technical Domain Focus
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-brand-500"
                  >
                    {tracks.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Company Type */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Target Company Environment
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "faang", label: "Big Tech / FAANG", desc: "Heavy algorithms" },
                    { id: "startup", label: "Fast-Growth Startup", desc: "Fast-paced, practical" },
                    { id: "fintech", label: "Financial / Enterprise", desc: "Stability & scale" },
                    { id: "general", label: "Standard Assessment", desc: "General conceptual" },
                  ].map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => setCompanyType(comp.id)}
                      className={`card p-3 text-center cursor-pointer flex flex-col justify-center items-center h-20 transition-all ${
                        companyType === comp.id
                          ? "border-brand-500 bg-brand-50/10 shadow-sm"
                          : "hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800">{comp.label}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{comp.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Persona selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  AI Interviewer Persona
                </label>
                <div className="space-y-3">
                  {personas.map((persona) => {
                    const isSelected = personaId === persona.id;
                    return (
                      <div
                        key={persona.id}
                        onClick={() => setPersonaId(persona.id)}
                        className={`card p-4 flex items-start gap-4 cursor-pointer transition-all ${
                          isSelected
                            ? "border-brand-500 bg-brand-50/10 shadow-sm"
                            : "hover:border-slate-300"
                        }`}
                      >
                        <div className="text-3xl p-1.5 bg-slate-100 rounded-lg flex-shrink-0">
                          {persona.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-800">{persona.name}</h3>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-semibold">
                              {persona.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {persona.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLaunching}
                className="w-full py-3 rounded-md font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLaunching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Custom Interview Session...
                  </>
                ) : (
                  <>
                    Start Live Mock Interview
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar Guidelines (col-span-1) */}
          <div className="space-y-4">
            
            {/* Guidelines Card */}
            <div className="card p-5 bg-white space-y-4 border-slate-200">
              <h2 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-brand-600" />
                Session Rules
              </h2>
              <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Duration:</strong> Usually contains 8 to 12 questions including follow-up items. Takes about 30 minutes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Scoring:</strong> You are scored on conceptual correctness, depth, terminology, and how you respond to follow-ups.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Exit Policy:</strong> You can click &ldquo;End Session&rdquo; at any time to receive a partial scorecard and report.
                  </span>
                </li>
              </ul>
            </div>

            {/* Preparation widget */}
            <div className="card p-5 bg-slate-50 border-slate-200">
              <h3 className="font-semibold text-slate-850 text-xs mb-2 uppercase tracking-wide">
                Interviews tip:
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When answering, follow the <strong>STAR method</strong> (Situation, Task, Action, Result) for behavioral questions, or structure your technical answers from high-level definition to low-level implementation details.
              </p>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}
