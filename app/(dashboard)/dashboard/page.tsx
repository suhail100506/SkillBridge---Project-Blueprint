"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Flame, 
  Trophy, 
  Map, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  FileText,
  Compass,
  ArrowRight,
  User,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import ScoreRing from "@/components/shared/ScoreRing";

export default function DashboardPage() {
  const { data: session } = useSession();

  // 1. Fetch User Profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
    enabled: !!session?.user?.id
  });

  // 2. Fetch Active Roadmaps
  const { data: roadmaps, isLoading: roadmapsLoading } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: async () => {
      const res = await fetch("/api/roadmap/list");
      if (!res.ok) throw new Error("Failed to load roadmaps");
      return res.json();
    },
    enabled: !!session?.user?.id
  });

  // 3. Fetch Internships Preview
  const { data: internships } = useQuery({
    queryKey: ["internships-preview"],
    queryFn: async () => {
      const res = await fetch("/api/internships");
      if (!res.ok) throw new Error("Failed to load internships");
      const list = await res.json();
      return list.slice(0, 2);
    },
    enabled: !!session?.user?.id
  });

  const isLoading = profileLoading || roadmapsLoading;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-mono">Synchronizing widgets...</p>
      </div>
    );
  }

  const userProfile = profile || {};
  const activeRoadmap = roadmaps && roadmaps.length > 0 ? roadmaps[0] : null;

  // Extract today's tasks (first 3 uncompleted tasks from active roadmap)
  const getTodaysTasks = () => {
    if (!activeRoadmap) return [];
    const tasks: any[] = [];
    for (const phase of activeRoadmap.phases) {
      for (const week of phase.weeks) {
        if (week.status !== "completed") {
          for (const task of week.tasks) {
            if (!task.completed) {
              tasks.push({ ...task, weekNumber: week.weekNumber });
              if (tasks.length === 3) return tasks;
            }
          }
        }
      }
    }
    return tasks;
  };

  const todaysTasks = getTodaysTasks();
  const username = session?.user?.name || userProfile.name || "Transitioner";
  const userSkillsCount = (userProfile.skills?.technical?.length || 0) + (userProfile.skills?.soft?.length || 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(120px,_auto)]">
        
        {/* Widget 1: Welcome Banner Card (Col span 8, Row span 2) */}
        <div className="md:col-span-8 md:row-span-2 glass-panel border border-white/10 rounded-3xl p-8 flex flex-col justify-between bg-gradient-to-tr from-brand-500/10 via-dark-900 to-dark-950 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-xs text-brand-500 text-glow-brand font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Personalized Dashboard</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-normal">
              Good morning, {username}!
            </h2>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed font-light">
              {activeRoadmap 
                ? `Your transition to ${activeRoadmap.targetCareer} is ${activeRoadmap.overallProgress}% complete. You have unlocked ${userSkillsCount} core skills so far.`
                : "You haven't mapped a career pathway yet. Upload your CV or complete the profile checklist to build your custom reskilling timeline."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-6">
            {activeRoadmap ? (
              <Link
                href={`/roadmap/${activeRoadmap._id}`}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/15 flex items-center gap-1.5 transition"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/profile"
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/15 flex items-center gap-1.5 transition"
              >
                <span>Setup My Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/careers"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition"
            >
              Explore Careers
            </Link>
          </div>
        </div>

        {/* Widget 2: Streak & XP Gamification Card (Col span 4, Row span 2) */}
        <div className="md:col-span-4 md:row-span-2 glass-panel border border-white/10 rounded-3xl p-8 flex flex-col justify-between items-center text-center">
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Gamification Status</span>
          
          <div className="py-4 space-y-3">
            <div className="flex justify-center items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-md">
                  <Flame className="w-7 h-7 fill-orange-500/20 animate-pulse-glow" />
                </div>
                <span className="text-xs font-bold text-white mt-1.5">{userProfile.streak || 0} Days</span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold">Streak</span>
              </div>

              <div className="w-px h-12 bg-white/15" />

              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-md">
                  <Trophy className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-white mt-1.5">{userProfile.xpPoints || 0} XP</span>
                <span className="text-[9px] text-gray-500 uppercase font-semibold">Total Points</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 font-normal leading-relaxed">
            <span>Keep your daily streaks active to unlock transition badges.</span>
          </div>
        </div>

        {/* Widget 3: Today's Tasks Checklist (Col span 6, Row span 2) */}
        <div className="md:col-span-6 md:row-span-2 glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's Study Checklist</h3>
            {activeRoadmap && (
              <Link href={`/roadmap/${activeRoadmap._id}`} className="text-[10px] text-brand-500 font-bold hover:underline">
                View All
              </Link>
            )}
          </div>

          <div className="flex-1 space-y-3">
            {todaysTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-500 py-6 space-y-2">
                <CheckCircle className="w-8 h-8 text-white/20" />
                <p className="italic">No tasks pending. Start a roadmap to populate your schedule!</p>
              </div>
            ) : (
              todaysTasks.map((task: any) => (
                <Link 
                  href={`/roadmap/${activeRoadmap?._id}`}
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl transition-all group"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-500 group-hover:scale-125 transition-transform" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white leading-snug line-clamp-1">{task.title}</p>
                    <span className="text-[9px] text-gray-500 uppercase font-bold font-mono">Week {task.weekNumber} • {task.estimatedMinutes}m</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Widget 4: Career Match Score circle (Col span 6, Row span 2) */}
        <div className="md:col-span-6 md:row-span-2 glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Top Compatibility Match</h3>
          
          {activeRoadmap ? (
            <div className="flex-1 flex items-center justify-between gap-6 py-2">
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-brand-500 font-bold font-mono">Mapped Pathway</span>
                <h4 className="text-lg font-extrabold text-white tracking-tight leading-none">{activeRoadmap.targetCareer}</h4>
                <p className="text-xs text-gray-500 leading-normal">Your transferable skills match 82% of the requirement constraints.</p>
              </div>
              <ScoreRing value={82} size={80} strokeWidth={6} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-gray-500 py-6 space-y-2">
              <Compass className="w-8 h-8 text-white/20" />
              <p className="italic">No career mapped. Analyze skills first.</p>
            </div>
          )}

          <div className="border-t border-white/5 pt-3 flex justify-end">
            <Link href="/careers" className="text-[10px] text-brand-500 font-bold hover:underline flex items-center gap-0.5">
              <span>Explore 50+ Careers</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Widget 5: Micro-Internships highlights (Col span 7, Row span 2) */}
        <div className="md:col-span-7 md:row-span-2 glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Matching Micro-Internships</h3>
            <Link href="/internships" className="text-[10px] text-brand-500 font-bold hover:underline">
              View Board
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {!internships || internships.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No matching projects loaded. Run seed API to populate.</p>
            ) : (
              internships.map((int: any) => (
                <div key={int._id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{int.logo}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{int.title}</h4>
                      <p className="text-[10px] text-gray-500">{int.company} • {int.duration_weeks} wks</p>
                    </div>
                  </div>
                  <Link 
                    href="/internships"
                    className="p-1.5 bg-white/5 hover:bg-brand-500 hover:text-white rounded-lg border border-white/10 hover:border-brand-500 text-gray-400 transition"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Widget 6: Quick Actions (Col span 5, Row span 2) */}
        <div className="md:col-span-5 md:row-span-2 glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Shortcuts</h3>
          
          <div className="grid grid-cols-2 gap-3 flex-grow">
            <Link 
              href="/profile" 
              className="p-4 bg-white/5 border border-white/5 hover:border-brand-500/30 hover:bg-brand-500/5 rounded-xl flex flex-col justify-between transition-all group"
            >
              <FileText className="w-5 h-5 text-brand-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white mt-4">Upload CV</span>
            </Link>

            <Link 
              href="/resources" 
              className="p-4 bg-white/5 border border-white/5 hover:border-accent-500/30 hover:bg-accent-500/5 rounded-xl flex flex-col justify-between transition-all group"
            >
              <BookOpen className="w-5 h-5 text-accent-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white mt-4">Free Library</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
