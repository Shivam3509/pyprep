"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Brain,
  FileText,
  TrendingUp,
  User,
  CreditCard,
  Settings,
  ChevronDown,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tracks", icon: BookOpen, label: "Learn" },
  { href: "/playground", icon: Code2, label: "Coding" },
  { href: "/interview", icon: Brain, label: "Mock Interview" },
  { href: "/resume", icon: FileText, label: "Resume Interview" },
  { href: "/progress", icon: TrendingUp, label: "Progress" },
];

const bottomItems = [
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/pricing", icon: CreditCard, label: "Upgrade" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleUserPillClick = () => {
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";
  const displayName = user?.name || "Guest Candidate";
  const displaySub = user
    ? `${user.experience_level} • ${user.tier}`
    : "Sign in to track progress";

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-600 rounded-md flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-base tracking-tight">
            PyPrep
          </span>
        </Link>
      </div>

      {/* User pill */}
      <div className="px-3 py-3 border-b border-slate-200">
        <div
          onClick={handleUserPillClick}
          className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-brand-655 flex items-center justify-center text-white text-xs font-semibold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">
              {displayName}
            </div>
            <div className="text-xs text-slate-500 truncate">{displaySub}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-link ${active ? "active" : ""}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 space-y-0.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-2 mb-1">
            Account
          </div>
          
          <Link
            href="/profile"
            className={`sidebar-link ${pathname === "/profile" ? "active" : ""}`}
          >
            <User className="w-4 h-4 flex-shrink-0" />
            Profile
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-left cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 flex-shrink-0 text-red-500" />
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className={`sidebar-link ${pathname === "/login" ? "active" : ""}`}
            >
              <User className="w-4 h-4 flex-shrink-0" />
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Upgrade banner (Only show for Free or Guest users) */}
      {(!user || user.tier === "Free") && (
        <div className="px-3 pb-4">
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-brand-800 mb-1">
              🔓 Unlock Pro
            </div>
            <p className="text-[11px] text-brand-700 leading-relaxed mb-2">
              Get unlimited questions, AI interviews & resume analysis.
            </p>
            <Link
              href="/pricing"
              className="block text-center text-xs font-semibold bg-brand-600 text-white py-1.5 rounded-md hover:bg-brand-700 transition-colors"
            >
              Upgrade — $12/mo
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}

export function Header({ title }: { title?: string }) {
  return (
    <header className="platform-header gap-4">
      {title && (
        <h1 className="text-base font-semibold text-slate-900 flex-1">
          {title}
        </h1>
      )}
      {!title && <div className="flex-1" />}

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 text-sm text-slate-400 w-56 cursor-pointer hover:bg-slate-200 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search questions…</span>
          <kbd className="ml-auto text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-600 rounded-full" />
        </button>
      </div>
    </header>
  );
}
