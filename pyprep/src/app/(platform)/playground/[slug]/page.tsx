"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Sidebar";
import Editor from "@monaco-editor/react";
import {
  Play,
  Code2,
  ArrowLeft,
  Settings,
  Sparkles,
  Info,
  ChevronRight,
  RotateCcw,
  Award,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  track: string;
  tags: string[];
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: string;
  hints: string[];
  timeComplexity: string;
  spaceComplexity: string;
  acceptanceRate: number;
  solution?: string;
}

export default function CodeEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  // States
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [activeLeftTab, setActiveLeftTab] = useState<"description" | "solution" | "hints">("description");
  const [activeRightTab, setActiveRightTab] = useState<"testcases" | "output">("testcases");
  
  // Execution status
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Syntax Error" | null;
    message: string;
    stdout?: string;
    passed?: number;
    total?: number;
    timeMs?: number;
  }>({ status: null, message: "" });

  const [activeHintIndex, setActiveHintIndex] = useState(-1);
  const [customInput, setCustomInput] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    async function loadProblem() {
      setLoading(true);
      setError(false);
      try {
        const data = await apiFetch<any>(`/api/problems/${slug}`);
        const mapped: Problem = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          difficulty: data.difficulty,
          track: data.track,
          tags: data.tags || [],
          description: data.description,
          examples: data.examples || [],
          constraints: data.constraints || [],
          starterCode: data.starter_code,
          hints: data.hints || [],
          timeComplexity: data.time_complexity || "O(N)",
          spaceComplexity: data.space_complexity || "O(N)",
          acceptanceRate: data.acceptance_rate ?? 50,
          solution: data.solution || "def solution():\n    # Add optimal solution here\n    pass",
        };
        setProblem(mapped);
        setCode(mapped.starterCode);
        setCustomInput(mapped.examples[0]?.input ?? "");
      } catch (err) {
        console.error("Failed to load problem:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [slug]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRunCode = async () => {
    if (!problem) return;
    setIsExecuting(true);
    setActiveRightTab("output");
    setExecutionResult({ status: null, message: "Compiling and running..." });
    
    try {
      const result = await apiFetch("/api/problems/" + problem.slug + "/run", {
        method: "POST",
        body: JSON.stringify({
          code,
          language,
          custom_input: customInput,
        }),
      });

      setExecutionResult({
        status: result.status,
        message: result.message,
        stdout: result.stdout,
        passed: result.passed,
        total: result.total,
        timeMs: result.time_ms,
      });
    } catch (err: any) {
      setExecutionResult({
        status: "Runtime Error",
        message: err.message || "Failed to execute code.",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setIsExecuting(true);
    setActiveRightTab("output");
    setExecutionResult({ status: null, message: "Evaluating all test cases..." });
    
    try {
      const result = await apiFetch("/api/problems/" + problem.slug + "/submit", {
        method: "POST",
        body: JSON.stringify({
          code,
          language,
        }),
      });

      // Map backend status response: "Accepted" or other
      const isAccepted = result.status === "Accepted";
      setExecutionResult({
        status: result.status,
        message: isAccepted ? "All test cases passed!" : "Some test cases failed on submission.",
        timeMs: result.execution_time_ms ?? 0,
      });

      if (isAccepted) {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      setExecutionResult({
        status: "Runtime Error",
        message: err.message || "Submission failed.",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetCode = () => {
    if (problem && confirm("Are you sure you want to reset the editor to the default starter code?")) {
      setCode(problem.starterCode);
      setExecutionResult({ status: null, message: "" });
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Loading Editor..." />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-slate-900">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      </>
    );
  }

  if (error || !problem) {
    return notFound();
  }

  return (
    <>
      <Header title={`Playground — ${problem.title}`} />
      
      {/* Dynamic full-width split container */}
      <div className="flex flex-col xl:flex-row h-[calc(100vh-60px)] overflow-hidden bg-slate-900 text-slate-100">
        
        {/* LEFT COLUMN: Problem Workspace (Description, Solutions, Hints) */}
        <div className="w-full xl:w-[45%] flex flex-col border-r border-slate-800 bg-slate-950">
          
          {/* Tab Selector */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4 bg-slate-900 h-12 flex-shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveLeftTab("description")}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeLeftTab === "description"
                    ? "border-brand-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveLeftTab("solution")}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeLeftTab === "solution"
                    ? "border-brand-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Optimal Solution
              </button>
              <button
                onClick={() => setActiveLeftTab("hints")}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeLeftTab === "hints"
                    ? "border-brand-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Hints ({problem.hints.length})
              </button>
            </div>
            
            <Link
              href="/playground"
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Problems
            </Link>
          </div>

          {/* Tab Content Panel (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeLeftTab === "description" && (
              <div className="space-y-6 animate-fade-in">
                {/* Title & Metadata */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        problem.difficulty === "Easy"
                          ? "bg-green-950/50 text-green-400 border border-green-900"
                          : problem.difficulty === "Medium"
                          ? "bg-amber-950/50 text-amber-400 border border-amber-900"
                          : "bg-red-950/50 text-red-400 border border-red-900"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">Acceptance Rate: {problem.acceptanceRate}%</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">{problem.title}</h1>
                </div>

                {/* Problem Description Text */}
                <div className="text-sm text-slate-350 whitespace-pre-line leading-relaxed space-y-3">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Examples</h3>
                  {problem.examples.map((ex, index) => (
                    <div key={index} className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-2">
                      <div className="text-xs font-bold text-slate-450">Example {index + 1}:</div>
                      <div className="grid grid-cols-1 gap-1 font-mono text-xs text-slate-300">
                        <div>
                          <strong className="text-slate-500">Input:</strong> {ex.input}
                        </div>
                        <div>
                          <strong className="text-slate-500">Output:</strong> {ex.output}
                        </div>
                        {ex.explanation && (
                          <div className="mt-1 text-slate-400">
                            <strong className="text-slate-500">Explanation:</strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constraints</h3>
                  <ul className="space-y-1 bg-slate-900/30 border border-slate-900 p-3 rounded-lg">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="text-brand-500 font-bold">•</span>
                        <code>{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Complexity */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900">
                  <div className="bg-slate-900/40 p-3 rounded border border-slate-850">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Target Time Complexity</div>
                    <div className="text-sm font-bold text-slate-300 font-mono mt-0.5">{problem.timeComplexity}</div>
                  </div>
                  <div className="bg-slate-900/40 p-3 rounded border border-slate-850">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Target Space Complexity</div>
                    <div className="text-sm font-bold text-slate-300 font-mono mt-0.5">{problem.spaceComplexity}</div>
                  </div>
                </div>

                {/* Related tags */}
                <div className="flex flex-wrap gap-1">
                  {problem.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeLeftTab === "solution" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 p-3 bg-brand-950/20 border border-brand-900/50 rounded-lg text-xs text-brand-300">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Try solving it yourself before checking the optimal solution!
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Optimal Python Solution
                  </h3>
                  <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-slate-850">
                    <code>{problem.solution || "# Optimal solution not public."}</code>
                  </pre>
                </div>
                <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                  <h4 className="font-bold text-slate-200">Complexity Analysis:</h4>
                  <p>
                    <strong>Time Complexity:</strong> {problem.timeComplexity} — We traverse the data structure linear times and use hash lookups which average O(1) time.
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> {problem.spaceComplexity} — Storing state values relative to the input bounds requires allocations up to N elements.
                  </p>
                </div>
              </div>
            )}

            {activeLeftTab === "hints" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Hints ({problem.hints.length})
                </h3>
                <div className="space-y-3">
                  {problem.hints.map((hint, idx) => {
                    const isRevealed = idx <= activeHintIndex;
                    return (
                      <div
                        key={idx}
                        className={`border rounded-lg p-3.5 transition-all ${
                          isRevealed
                            ? "bg-slate-900/40 border-slate-800 text-slate-300"
                            : "bg-slate-950 border-slate-900 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400">Hint {idx + 1}</span>
                          {!isRevealed && idx === activeHintIndex + 1 && (
                            <button
                              onClick={() => setActiveHintIndex(idx)}
                              className="text-[10px] font-bold bg-brand-600 hover:bg-brand-500 text-white px-2 py-0.5 rounded shadow-sm"
                            >
                              Reveal Hint
                            </button>
                          )}
                        </div>
                        {isRevealed ? (
                          <p className="text-xs leading-relaxed">{hint}</p>
                        ) : (
                          <p className="text-xs italic text-slate-600 font-medium">Click reveal to see helper information.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor + Test Panel */}
        <div className="w-full xl:w-[55%] flex flex-col bg-slate-900">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4 h-12 bg-slate-900/60 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-350">
                <Code2 className="w-4 h-4 text-brand-500" />
                <span className="font-semibold">Language:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs rounded px-1.5 py-0.5 text-white focus:outline-none"
                >
                  <option value="python">Python 3.11</option>
                  <option value="postgresql">SQL (PostgreSQL)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reset code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                title="Editor Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[300px] xl:min-h-0 bg-slate-950 relative border-b border-slate-800">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                fontSize: 13,
                fontFamily: "JetBrains Mono",
                minimap: { enabled: false },
                lineNumbers: "on",
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Execution & Output Console Container */}
          <div className="h-64 flex flex-col bg-slate-950 flex-shrink-0">
            
            {/* Console Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-900 px-4 h-10 flex-shrink-0">
              <button
                onClick={() => setActiveRightTab("testcases")}
                className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
                  activeRightTab === "testcases"
                    ? "border-brand-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveRightTab("output")}
                className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
                  activeRightTab === "output"
                    ? "border-brand-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Run Output
                {executionResult.status && (
                  <span
                    className={`ml-1.5 w-2 h-2 rounded-full inline-block ${
                      executionResult.status === "Accepted" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                )}
              </button>
            </div>

            {/* Console Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
              {activeRightTab === "testcases" && (
                <div className="space-y-3">
                  <div className="text-slate-450 uppercase text-[10px] font-bold">Standard Test Inputs:</div>
                  <div className="space-y-2">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="p-2.5 bg-slate-900 border border-slate-850 rounded">
                        <div className="text-[10px] text-slate-500 font-semibold mb-1">Case {i + 1}:</div>
                        <div className="text-slate-350">{ex.input}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <label className="text-slate-450 uppercase text-[10px] font-bold block mb-1">Custom Test Case Input:</label>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-slate-350 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}

              {activeRightTab === "output" && (
                <div className="h-full flex flex-col">
                  {isExecuting ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Executing solution code in sandbox container...</span>
                    </div>
                  ) : executionResult.status ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Result:</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            executionResult.status === "Accepted"
                              ? "bg-green-950 text-green-400 border border-green-900"
                              : "bg-red-950/70 text-red-400 border border-red-900"
                          }`}
                        >
                          {executionResult.status}
                        </span>
                        {executionResult.timeMs !== undefined && (
                          <span className="text-[10px] text-slate-500">({executionResult.timeMs}ms)</span>
                        )}
                      </div>
                      
                      <div className="text-slate-205 font-semibold">{executionResult.message}</div>
                      
                      {executionResult.stdout && (
                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Standard Output:</div>
                          <pre className="p-3 bg-slate-900 text-slate-350 border border-slate-850 rounded overflow-x-auto max-h-[120px] leading-relaxed">
                            {executionResult.stdout}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                      No execution outputs yet. Click "Run Code" or "Submit" to test your solution.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Panel */}
            <div className="h-14 border-t border-slate-800 bg-slate-900 flex items-center justify-between px-4 flex-shrink-0">
              <button
                onClick={() => setCode(problem.starterCode)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Reset Starter Code
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-2 px-4 rounded border border-slate-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Run Code
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isExecuting}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs py-2 px-4 rounded shadow-sm disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  Submit Code
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-green-950 border border-green-800 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Challenge Completed!</h3>
              <p className="text-xs text-slate-400">
                You successfully solved the <strong className="text-white font-semibold">{problem.title}</strong> challenge.
              </p>
            </div>
            
            <div className="p-3 bg-slate-950 rounded border border-slate-850 text-left space-y-2">
              <div className="flex justify-between text-xs text-slate-450">
                <span>Execution Time</span>
                <span className="font-semibold text-white">{executionResult.timeMs}ms</span>
              </div>
              <div className="flex justify-between text-xs text-slate-450">
                <span>Memory usage</span>
                <span className="font-semibold text-white">14.1 MB</span>
              </div>
              <div className="flex justify-between text-xs text-slate-450">
                <span>Rank percentile</span>
                <span className="font-semibold text-green-400">Beats 94.2%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveLeftTab("solution");
                }}
                className="flex-1 py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-750 transition-colors cursor-pointer"
              >
                View Solution
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-2 rounded text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
