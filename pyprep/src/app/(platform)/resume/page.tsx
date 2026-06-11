"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Sidebar";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  UploadCloud,
  Sparkles,
  Play,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ParsedResume {
  name: string;
  email: string;
  experienceYears: number;
  skills: string[];
  projects: { title: string; tech: string[]; description: string }[];
  suggestedRole: string;
}

const mockTailoredQuestions = [
  {
    id: "rq1",
    question: "In your E-Commerce Order Processing API project, you processed orders asynchronously using FastAPI and Celery. How did you structure the event loop and prevent blocking database calls?",
    expectations: ["Mention asyncio.gather", "Use of non-blocking Redis libraries", "Celery task execution"],
  },
  {
    id: "rq2",
    question: "You mentioned using Redis for cache-aside queues in your backend projects. How did you handle network latency failures or buffer overflows when Redis memory hit limits?",
    expectations: ["Eviction policies (LRU)", "Backpressure handling", "Redis Sentinel / replication"],
  },
  {
    id: "rq3",
    question: "For your database schemas, how did you guarantee transaction isolation and handle concurrency anomalies like dirty reads in PostgreSQL?",
    expectations: ["Database transactional scopes", "Isolation levels", "Row locking"],
  },
];

export default function ResumePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "parsing" | "completed">("idle");
  const [parsingStep, setParsingStep] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [isLaunchingSession, setIsLaunchingSession] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleUpload(acceptedFiles[0]);
      }
    },
  });

  const handleUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setStatus("uploading");
    
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      
      const response = await apiFetch<any>("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      setStatus("parsing");
      setParsingStep(1); // Read PDF text
      
      setTimeout(() => {
        setParsingStep(2); // Extracting entities
        
        setTimeout(() => {
          setParsingStep(3); // Generating personalized questions
          
          setTimeout(() => {
            setStatus("completed");
            setParsedData({
              name: "Candidate Profile",
              email: "Extracted from PDF",
              experienceYears: response.experience_years ?? 3.0,
              skills: response.skills || ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
              suggestedRole: response.suggested_role || "Python Backend Engineer",
              projects: response.projects || [
                {
                  title: "E-Commerce Order Processing API",
                  tech: ["FastAPI", "Celery", "PostgreSQL"],
                  description: "High throughput order API using asyncio with task workers for asynchronous email dispatch.",
                }
              ],
            });
          }, 1200);
        }, 1000);
      }, 1000);

    } catch (err: any) {
      console.error("Failed to upload resume:", err);
      alert(err.message || "Failed to process PDF resume.");
      resetUpload();
    }
  };

  const resetUpload = () => {
    setFile(null);
    setStatus("idle");
    setParsedData(null);
    setParsingStep(0);
  };

  const handleStartSession = async () => {
    if (!parsedData) return;
    setIsLaunchingSession(true);

    try {
      // Determine experience target
      const level = parsedData.experienceYears >= 3.0 ? "Senior" : parsedData.experienceYears >= 1.5 ? "Intermediate" : "Fresher";

      const session = await apiFetch("/api/interviews/start", {
        method: "POST",
        body: JSON.stringify({
          level,
          domain: "python-fundamentals",
          company_type: "startup",
          persona_id: "sarah",
        }),
      });
      router.push(`/interview/${session.id}`);
    } catch (err) {
      console.error("Failed to start session:", err);
      alert("Failed to initialize session. Please try again.");
    } finally {
      setIsLaunchingSession(false);
    }
  };

  return (
    <>
      <Header title="Resume Interview Preparation" />
      
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        
        {/* Banner Card */}
        <div className="card p-6 bg-slate-900 border-slate-800 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-brand-600/30 border border-brand-500/20 text-brand-300 px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3 h-3" /> AI Tailored Questions
            </div>
            <h1 className="text-2xl font-bold mb-2">Practice questions based on your projects</h1>
            <p className="text-sm text-slate-350 leading-relaxed">
              Upload your PDF resume to parse your specific skills, years of experience, and tech stacks. Our AI will automatically construct a customized interview bank targeting your exact work experience, just like real interviewers do.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-600/10 to-transparent hidden sm:block" />
        </div>

        {status === "idle" && (
          /* DRAG & DROP AREA */
          <div className="card bg-white p-8 border-slate-200 shadow-xs">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[300px] ${
                isDragActive
                  ? "border-brand-500 bg-brand-50/10"
                  : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-12 h-12 text-slate-400 mb-4 animate-bounce" />
              <h3 className="font-bold text-slate-800 text-base mb-1.5">
                Drag and drop your PDF resume here
              </h3>
              <p className="text-xs text-slate-450 mb-3">
                Only PDF files are supported. Maximum size limit is 5MB.
              </p>
              <button
                type="button"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs py-2 px-4 rounded shadow-sm transition-colors cursor-pointer"
              >
                Browse Files
              </button>
            </div>
          </div>
        )}

        {(status === "uploading" || status === "parsing") && (
          /* PROCESSING AND PARSING ANIMATIONS */
          <div className="card p-8 bg-white border-slate-200 shadow-xs text-center space-y-6 max-w-lg mx-auto">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">Processing your Resume</h3>
              <p className="text-xs text-slate-400">
                {file ? `Analyzing: ${file.name}` : "Please wait..."}
              </p>
            </div>

            {/* Stepper Status Indicators */}
            <div className="space-y-3 text-left text-xs bg-slate-50 p-4 border border-slate-100 rounded-lg max-w-xs mx-auto">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[9px] ${
                    status === "parsing"
                      ? "bg-green-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {status === "parsing" ? "✓" : "1"}
                </div>
                <span
                  className={
                    status === "parsing"
                      ? "text-slate-800 font-semibold"
                      : "text-slate-400"
                  }
                >
                  Uploading PDF document
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[9px] ${
                    parsingStep >= 2
                      ? "bg-green-600 text-white"
                      : parsingStep === 1
                      ? "bg-brand-600 text-white animate-pulse"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {parsingStep >= 2 ? "✓" : "2"}
                </div>
                <span
                  className={
                    parsingStep >= 1 ? "text-slate-800 font-semibold" : "text-slate-400"
                  }
                >
                  Extracting text and scanning skills
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[9px] ${
                    parsingStep >= 3
                      ? "bg-green-600 text-white"
                      : parsingStep === 2
                      ? "bg-brand-600 text-white animate-pulse"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {parsingStep >= 3 ? "✓" : "3"}
                </div>
                <span
                  className={
                    parsingStep >= 2 ? "text-slate-800 font-semibold" : "text-slate-400"
                  }
                >
                  Parsing experience & project contexts
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[9px] ${
                    parsingStep === 3 ? "bg-brand-600 text-white animate-pulse" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  4
                </div>
                <span
                  className={
                    parsingStep >= 3 ? "text-slate-800 font-semibold animate-pulse" : "text-slate-400"
                  }
                >
                  Generating custom interview pool
                </span>
              </div>
            </div>
          </div>
        )}

        {status === "completed" && parsedData && (
          /* PARSED DATA VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left parsed bio (col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="card p-5 bg-white border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <FileText className="w-4.5 h-4.5 text-brand-600" />
                    Extracted Resume Profile
                  </h2>
                  <button
                    onClick={resetUpload}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    Reupload
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Bio details */}
                  <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed">
                    <div>
                      <span className="text-slate-450 block font-semibold text-[10px] uppercase">Name</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{parsedData.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-450 block font-semibold text-[10px] uppercase">Target Experience</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{parsedData.experienceYears} Years</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-slate-450 block font-semibold text-[10px] uppercase">Role Benchmark</span>
                    <span className="font-bold text-brand-600 text-xs mt-0.5 inline-block">{parsedData.suggestedRole}</span>
                  </div>

                  {/* Skills tags */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-450 block font-semibold text-[10px] uppercase mb-2">Extracted Core Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-brand-50 border border-brand-100 text-brand-700 px-2 py-0.5 rounded font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Projects listed */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-slate-450 block font-semibold text-[10px] uppercase">Projects Found</span>
                    {parsedData.projects.map((proj, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-slate-150 rounded text-xs space-y-1">
                        <div className="font-bold text-slate-800">{proj.title}</div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {proj.tech.map((t) => (
                            <span key={t} className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>

            {/* Right generated questions (col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="card p-5 bg-white border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm">Personalized Question Bank</h2>
                    <p className="text-[10px] text-slate-450 font-medium">Tailored based on your experience levels</p>
                  </div>
                  <button
                    onClick={handleStartSession}
                    disabled={isLaunchingSession}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLaunchingSession ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white" />
                    )}
                    Start Session
                  </button>
                </div>

                <div className="space-y-3.5">
                  {mockTailoredQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3.5 bg-slate-50 border border-slate-150 hover:border-slate-250 transition-colors rounded-lg space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-brand-50 border border-brand-200 text-brand-650 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-semibold text-slate-750 leading-relaxed">
                          {q.question}
                        </p>
                      </div>

                      {/* Expectations sub list */}
                      <div className="pl-7 space-y-1.5">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                          Keywords expected in answer:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {q.expectations.map((exp, i) => (
                            <span
                              key={i}
                              className="text-[9px] bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded font-medium"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}
