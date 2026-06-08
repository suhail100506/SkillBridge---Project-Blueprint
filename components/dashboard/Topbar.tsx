"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { Flame, Trophy, Bell, Search } from "lucide-react";

export default function Topbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { xp, streak, setXp, setStreak } = useAppStore();

  // Sync user XP/Streak with state store once loaded
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const profile = await res.json();
          setXp(profile.xpPoints || 0);
          setStreak(profile.streak || 0);
        }
      } catch (error) {
        console.error("Failed to load profile details in topbar:", error);
      }
    };
    fetchUserData();
  }, [session, setXp, setStreak]);

  // Format page title based on active path
  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return "Home";
    const lastPart = parts[parts.length - 1];
    
    // Check if ID (Mongoose ObjectID or hex slug)
    if (lastPart.length === 24 || lastPart.startsWith('demo-')) {
      const parent = parts[parts.length - 2];
      return parent === 'roadmap' ? "90-Day Roadmap Timeline" : "Skill Analysis Report";
    }
    
    return lastPart
      .replace(/-/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const username = session?.user?.name || "Transitioner";
  const userInitials = username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <header className="h-16 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8 glass-panel border-b border-white/10 bg-dark-950/40">
      {/* Title */}
      <div>
        <h1 className="text-xl font-sans font-bold text-white tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Gamification, Search & User Avatar */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative w-64 max-md:hidden">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search skills, careers, resources..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 transition-all duration-200"
          />
        </div>

        {/* Gamification Badges */}
        <div className="flex items-center gap-4">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400" title="Active Streak">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20 animate-pulse-glow" />
            <span className="text-xs font-bold font-mono">{streak}d Streak</span>
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400" title="Total Skill XP Earned">
            <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-500/20" />
            <span className="text-xs font-bold font-mono">{xp} XP</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
          <Bell className="w-4 h-4" />
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="text-right">
            <p className="text-xs font-bold text-white max-sm:hidden">{username}</p>
            <p className="text-[10px] text-gray-400 max-sm:hidden">{session?.user?.email || "transitioning"}</p>
          </div>
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={username}
              className="w-8 h-8 rounded-full border border-white/15 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-brand-600 border border-white/15 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-brand-500/10">
              {userInitials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
