"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Map, Plus, Compass, Clock, Award, ChevronRight } from "lucide-react";

export default function RoadmapsPage() {
  const { data: session } = useSession();

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: async () => {
      // Connect to DB via API
      const res = await fetch("/api/roadmap/list");
      if (!res.ok) throw new Error("Failed to load roadmaps");
      return res.json();
    },
    enabled: !!session?.user?.id
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-mono">Fetching active programs...</p>
      </div>
    );
  }

  const activeRoadmaps = roadmaps || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Active Roadmaps</h2>
          <p className="text-sm text-gray-400">Manage your ongoing reskilling curricula and daily tasks.</p>
        </div>

        <Link
          href="/profile"
          className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/10 flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Roadmap</span>
        </Link>
      </div>

      {activeRoadmaps.length === 0 ? (
        /* Empty State */
        <div className="glass-panel border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6">
          <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-brand-500 text-glow-brand">
            <Map className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">No Active Roadmaps Found</h3>
            <p className="text-xs text-gray-500 max-w-[280px] mx-auto leading-relaxed">You haven't built a reskilling plan yet. Setup your profile or upload a CV to construct your first pathway.</p>
          </div>
          <Link
            href="/profile"
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-bold text-white transition"
          >
            Create My First Roadmap
          </Link>
        </div>
      ) : (
        /* Grid list */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeRoadmaps.map((r: any) => (
            <div 
              key={r._id}
              className="glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between items-stretch gap-6 transition-all duration-300 hover:border-white/15"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-brand-500 font-mono tracking-wider">Active 90-Day Path</span>
                  <span className="text-xs font-bold text-accent-500 font-mono">{r.overallProgress}% Complete</span>
                </div>
                
                <h3 className="text-xl font-extrabold text-white mt-3 tracking-tight">{r.targetCareer}</h3>
                
                {/* Stats indicators */}
                <div className="flex gap-4 mt-4 text-[10px] text-gray-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <span>Day {r.currentDay || 1} of 90</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-gray-600" />
                    <span>+{r.earnedXP || 0} XP Earned</span>
                  </span>
                </div>
              </div>

              {/* Progress bar and view CTA */}
              <div className="space-y-4 border-t border-white/5 pt-4">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full" style={{ width: `${r.overallProgress}%` }} />
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/roadmap/${r._id}`}
                    className="px-4 py-2.5 bg-brand-500/10 hover:bg-brand-500 text-brand-500 hover:text-white border border-brand-500/20 hover:border-brand-500 text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                  >
                    <span>Open Timeline</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
