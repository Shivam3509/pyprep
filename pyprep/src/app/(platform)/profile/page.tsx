"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Sidebar";
import {
  User,
  Settings,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "billing">("profile");

  // Profile Form States
  const [name, setName] = useState("Alexander Smith");
  const [email, setEmail] = useState("alexander.smith@example.com");
  const [avatar, setAvatar] = useState("👨‍💻");

  // Preferences
  const [experienceTarget, setExperienceTarget] = useState("Intermediate");
  const [receiveReminders, setReceiveReminders] = useState(true);

  // Billing
  const [subTier, setSubTier] = useState<"Free" | "Pro" | "Premium">("Free");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile settings saved successfully!");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Onboarding & technical preferences updated!");
  };

  const handleUpgrade = (tier: "Pro" | "Premium") => {
    setSubTier(tier);
    alert(`Thank you for upgrading! You are now subscribed to the ${tier} Tier.`);
  };

  const handleResetHistory = () => {
    if (confirm("WARNING: This will permanently wipe all your solved questions, mock interview results, and resume history. This action cannot be undone. Are you sure?")) {
      alert("All local practice history has been successfully reset.");
      window.location.reload();
    }
  };

  return (
    <>
      <Header title="Account Settings" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Profile Card Header */}
        <div className="card p-6 bg-white border-slate-200 shadow-xs flex items-center gap-4">
          <div className="text-4xl p-3 bg-slate-100 rounded-full flex-shrink-0 select-none">
            {avatar}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">{name}</h1>
            <p className="text-xs text-slate-400">Account status: {subTier === "Free" ? "Standard Free Tier" : `${subTier} Subscription`}</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="tab-list">
          <button
            onClick={() => setActiveTab("profile")}
            className="tab-trigger flex items-center gap-1.5 text-xs font-semibold"
            data-state={activeTab === "profile" ? "active" : ""}
          >
            <User className="w-4 h-4" />
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className="tab-trigger flex items-center gap-1.5 text-xs font-semibold"
            data-state={activeTab === "preferences" ? "active" : ""}
          >
            <Settings className="w-4 h-4" />
            Interview Target Settings
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className="tab-trigger flex items-center gap-1.5 text-xs font-semibold"
            data-state={activeTab === "billing" ? "active" : ""}
          >
            <CreditCard className="w-4 h-4" />
            Billing & Subscriptions
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="card p-6 bg-white border-slate-200 shadow-xs">
          
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-4 animate-fade-in">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded pl-8 pr-3 py-2 text-sm text-slate-400 select-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avatar Character</label>
                <div className="flex gap-2">
                  {["👨‍💻", "👩‍💻", "🐍", "⚡", "🤖", "🚀"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatar(emoji)}
                      className={`text-xl p-2 rounded border hover:bg-slate-50 transition-colors select-none ${
                        avatar === emoji ? "border-brand-500 bg-brand-50/10" : "border-slate-200"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs py-2.5 px-4 rounded shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </form>
          )}

          {activeTab === "preferences" && (
            <form onSubmit={handleSavePreferences} className="space-y-5 animate-fade-in">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Technical Targeting</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Level Profile</label>
                  <select
                    value={experienceTarget}
                    onChange={(e) => setExperienceTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Fresher">Fresher (0 - 1 years)</option>
                    <option value="Intermediate">Intermediate (1 - 3 years)</option>
                    <option value="Senior">Senior (3 - 5+ years)</option>
                  </select>
                </div>

                <div className="space-y-2.5 pt-4 md:pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={receiveReminders}
                      onChange={(e) => setReceiveReminders(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    Enable daily streak reminder emails
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 space-y-3">
                <h3 className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <ShieldAlert className="w-4.5 h-4.5" /> Danger Zone
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Resetting study progress will permanently wipe all completed topics checklists, coding editor files, scores, and mock interviews metrics history.
                </p>
                <button
                  type="button"
                  onClick={handleResetHistory}
                  className="bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-700 font-semibold text-xs py-2 px-3 rounded transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Practice History
                </button>
              </div>

              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs py-2.5 px-4 rounded shadow-xs transition-colors"
              >
                Save Preferences
              </button>
            </form>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-800">Your Subscription Plan</h2>
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
                  Current Tier: {subTier}
                </span>
              </div>

              {subTier === "Free" ? (
                /* FREE PLAN PROMPTS */
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-150 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      Upgrade to unlock all premium syllabus material
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Pro and Premium subscribers unlock senior-level tracks (Metaclasses, Caching, System Design, RAG pipelines), customized resume evaluations, and unlimited mock interviews with Sarah, David, and Michael.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pro upgrade */}
                    <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col justify-between h-44 shadow-xs">
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-800 text-sm">Pro Membership</h4>
                          <span className="text-xs font-bold text-slate-500">$12/mo</span>
                        </div>
                        <p className="text-[10px] text-slate-450 mt-2">
                          Access intermediate modules, 10 simulated mock sessions per month.
                        </p>
                      </div>
                      <button
                        onClick={() => handleUpgrade("Pro")}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 rounded transition-colors"
                      >
                        Upgrade to Pro
                      </button>
                    </div>

                    {/* Premium Upgrade */}
                    <div className="p-4 bg-slate-900 border border-slate-800 text-white rounded-lg flex flex-col justify-between h-44 shadow-xs">
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-white text-sm flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                            Premium Coach
                          </h4>
                          <span className="text-xs font-bold text-slate-300">$25/mo</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">
                          Resume parsed questions, unlimited mock interviews, senior tracks architecture focus.
                        </p>
                      </div>
                      <button
                        onClick={() => handleUpgrade("Premium")}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-2 rounded transition-colors shadow-sm"
                      >
                        Upgrade to Premium
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ACTIVE PAID SUBSCRIPTION VIEW */
                <div className="p-4 bg-green-50/50 border border-green-200 rounded-lg space-y-4 text-slate-700">
                  <div className="flex items-center gap-2 text-green-800 font-bold text-xs">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Your account is active on the {subTier} subscription.
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Billing details: Next invoice of $25.00 will be billed automatically on July 11, 2026. Payment method on file is Visa ending in 4242.
                  </p>
                  <button
                    onClick={() => setSubTier("Free")}
                    className="text-xs font-semibold border border-slate-350 text-slate-600 bg-white hover:bg-slate-50 py-1.5 px-3 rounded transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </>
  );
}
