"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Zap,
  Star,
  Users,
  ChevronRight,
} from "lucide-react";

const faqItems = [
  {
    q: "Can I upgrade or downgrade my plan at any time?",
    a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your billing portal under settings. If you cancel, your access will remain active until the end of the billing cycle.",
  },
  {
    q: "How does the AI mock interviewer generate questions?",
    a: "The AI interviewer matches questions with your experience target level and chosen focus area. It parses your resume if provided and simulates follow-up scenarios dynamically, analyzing terminology and correctness.",
  },
  {
    q: "Do you have a refund policy?",
    a: "We offer a 7-day money-back guarantee for all new subscriptions. If you are not satisfied with your preparation outcomes, contact our support team and we will issue a full refund.",
  },
  {
    q: "What is included in the Free tier?",
    a: "The Free tier includes full access to the Fresher track syllabus (excluding premium subtopics), 5 coding problems, and 1 mock interview session per month to test the evaluation platform.",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const toggleFaq = (idx: number) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getPrice = (monthly: number) => {
    if (isYearly) {
      return Math.round(monthly * 0.8); // 20% discount
    }
    return monthly;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-900">
            <span className="text-xl font-black tracking-tight text-brand-600">PyPrep</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/tracks" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Tracks
            </Link>
            <Link href="/playground" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Playground
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-brand-650 transition-colors">
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="text-xs font-bold bg-brand-600 text-white px-3.5 py-2 rounded-md hover:bg-brand-700 transition-colors shadow-xs"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main pricing sections */}
      <main className="flex-1 py-12 px-6 max-w-7xl mx-auto space-y-12 w-full">
        
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Choose the right plan for your career success
          </h1>
          <p className="text-sm text-slate-500">
            Get unlimited access to conceptual interview guides, sandbox coding playgrounds, AI mock sessions, and customized resume-based question generation.
          </p>

          {/* Toggle annual */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs font-semibold ${!isYearly ? "text-slate-800" : "text-slate-400"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-10 h-6 rounded-full bg-slate-300 relative transition-all focus:outline-none"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                  isYearly ? "right-1 bg-brand-600" : "left-1"
                }`}
              />
            </button>
            <span className={`text-xs font-semibold ${isYearly ? "text-slate-800" : "text-slate-400"} flex items-center gap-1`}>
              Yearly
              <span className="text-[9px] bg-green-50 border border-green-200 text-green-700 px-1.5 py-0.2 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Free Tier */}
          <div className="card p-6 bg-white border-slate-200 flex flex-col justify-between h-[420px] shadow-xs hover:scale-[1.01] transition-transform">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                Free Basic
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-slate-500 mb-5 leading-normal">
                Perfect for freshers testing Python baseline skills and conceptual Q&As.
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-650">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  50 Interview Q&As
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  5 Coding problems
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  1 AI Mock Session / month
                </li>
              </ul>
            </div>
            
            <Link
              href="/onboarding"
              className="w-full text-center py-2.5 rounded font-semibold text-xs border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors mt-6"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="card p-6 bg-white border-slate-200 flex flex-col justify-between h-[420px] shadow-xs hover:scale-[1.01] transition-transform">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Zap className="w-4 h-4 text-slate-400" />
                Pro Practice
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-extrabold text-slate-900">${getPrice(12)}</span>
                <span className="text-xs text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-slate-500 mb-5 leading-normal">
                For active job seekers targetting Intermediate developer roles.
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-650">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Unlimited Syllabus Q&As
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  All Coding Challenges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  10 AI Mock Sessions / month
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Detailed performance report
                </li>
              </ul>
            </div>
            
            <Link
              href="/onboarding?tier=Pro"
              className="w-full text-center py-2.5 rounded font-semibold text-xs border border-slate-800 text-slate-800 hover:bg-slate-50 transition-colors mt-6"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="card p-6 bg-slate-900 border-slate-800 text-white flex flex-col justify-between h-[420px] shadow-md hover:scale-[1.01] transition-transform relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-brand-655 border border-brand-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
              Most Popular
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">
                <Star className="w-4 h-4 text-brand-400 fill-brand-400" />
                Premium Coach
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-extrabold text-white">${getPrice(25)}</span>
                <span className="text-xs text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-slate-400 mb-5 leading-normal">
                Everything you need to land Senior-level or specialized AI positions.
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  Unlimited AI Mock Interviews
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  Resume PDF Parsing & QA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  All Premium Senior tracks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  Priority LLM responses
                </li>
              </ul>
            </div>
            
            <Link
              href="/onboarding?tier=Premium"
              className="w-full text-center py-2.5 rounded font-bold text-xs bg-brand-600 hover:bg-brand-500 text-white transition-colors mt-6 shadow-sm flex items-center justify-center gap-1"
            >
              Get Premium Access
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Team Tier */}
          <div className="card p-6 bg-white border-slate-200 flex flex-col justify-between h-[420px] shadow-xs hover:scale-[1.01] transition-transform">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Users className="w-4 h-4 text-slate-400" />
                Team & Org
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-extrabold text-slate-900">${getPrice(80)}</span>
                <span className="text-xs text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-slate-500 mb-5 leading-normal">
                For educational bootcamps, recruitment firms, or internal dev teams.
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-650">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Includes 5 seats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Shared Team Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Admin panel & CSV reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  API Integration limits
                </li>
              </ul>
            </div>
            
            <Link
              href="mailto:sales@pyprep.com?subject=Team%20Plan%2520Inquiry"
              className="w-full text-center py-2.5 rounded font-semibold text-xs border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors mt-6"
            >
              Contact Sales
            </Link>
          </div>

        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6 pt-6">
          <h2 className="text-xl font-bold text-slate-900 text-center">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqItems.map((item, idx) => {
              const isOpen = !!faqOpen[idx];
              return (
                <div key={idx} className="accordion-item bg-white">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="accordion-trigger px-5 py-4 text-sm font-semibold flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
                      {item.q}
                    </span>
                    <span
                      className={`text-slate-450 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    >
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="accordion-content px-5 pb-4 text-xs text-slate-600 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-450">
        <div className="max-w-7xl mx-auto px-6">
          © 2026 PyPrep Technical Platforms Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
