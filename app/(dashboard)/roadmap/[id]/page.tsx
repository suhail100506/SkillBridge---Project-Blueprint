"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";
import { 
  CheckSquare, 
  Square, 
  Tv, 
  BookOpen, 
  Terminal, 
  Hammer, 
  Users, 
  Award, 
  Flame, 
  Trophy, 
  Check, 
  Compass, 
  ChevronRight,
  MessageSquare,
  Sparkles,
  ArrowRight
} from "lucide-react";

const typeBadges: { [key: string]: { icon: any, label: string, color: string } } = {
  watch: { icon: Tv, label: "Watch", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  read: { icon: BookOpen, label: "Read", color: "bg-teal-500/10 border-teal-500/20 text-teal-400" },
  practice: { icon: Terminal, label: "Practice", color: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
  build: { icon: Hammer, label: "Build", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
  network: { icon: Users, label: "Network", color: "bg-pink-500/10 border-pink-500/20 text-pink-400" }
};

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { addXp, setXp, setStreak } = useAppStore();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showReflection, setShowReflection] = useState(false);

  // Fetch roadmap details
  const { data: roadmap, isLoading, error } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: async () => {
      const res = await fetch(`/api/roadmap/${id}`);
      if (!res.ok) throw new Error("Failed to load roadmap");
      return res.json();
    }
  });

  // Task checkoff mutation
  const progressMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string, completed: boolean }) => {
      const res = await fetch(`/api/roadmap/${id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed })
      });
      if (!res.ok) throw new Error("Failed to update task checkoff");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["roadmap", id], data.roadmap);
      // Sync global Zustand store variables
      setXp(data.xpPoints);
      setStreak(data.streak);
    }
  });

  const handleToggleTask = (taskId: string, currentCompleted: boolean) => {
    progressMutation.mutate({ taskId, completed: !currentCompleted });
  };

  const getActiveWeekData = () => {
    if (!roadmap) return null;
    for (const phase of roadmap.phases) {
      const week = phase.weeks.find((w: any) => w.weekNumber === selectedWeek);
      if (week) return { phase, week };
    }
    return null;
  };

  const activeWeekInfo = getActiveWeekData();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-mono">Assembling 90-Day Timeline...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 font-bold mb-4">Failed to load learning roadmap.</p>
        <button onClick={() => router.push("/roadmap")} className="px-6 py-2 bg-brand-500 rounded-xl font-bold">
          Explore Roadmaps
        </button>
      </div>
    );
  }

  // Count metrics
  const totalTasks = roadmap.phases.reduce((acc: number, p: any) => 
    acc + p.weeks.reduce((wAcc: number, w: any) => wAcc + w.tasks.length, 0)
  , 0);
  const completedTasks = roadmap.phases.reduce((acc: number, p: any) => 
    acc + p.weeks.reduce((wAcc: number, w: any) => wAcc + w.tasks.filter((t: any) => t.completed).length, 0)
  , 0);

  const reflectionPrompts: { [key: string]: string[] } = {
    "data-analyst": [
      "How comfortable do you feel writing SQL SELECT and JOIN queries from scratch?",
      "What did you learn about data distributions during your statistics studies this week?",
      "How did your e-commerce dataset cleaning flow translate in Excel formulas?"
    ],
    default: [
      "What was the most challenging tool protocol you studied this week?",
      "How can you apply these learnings to a micro-internship target project?",
      "Which learning platforms (NPTEL, YouTube) did you find most helpful this week?"
    ]
  };

  const activePrompts = reflectionPrompts[roadmap.targetCareerSlug] || reflectionPrompts.default;

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none">
      {/* Overview stats header */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-accent-500 text-glow-accent font-bold text-xs uppercase tracking-widest mb-1">
            <Award className="w-4 h-4" />
            <span>Target Path: {roadmap.targetCareer}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Your 90-Day Reskilling Plan</h2>
          <p className="text-sm text-gray-400">Complete tasks daily to unlock competencies and earn transition points.</p>
        </div>

        {/* Gamification indicators */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div>
            <span className="text-[10px] uppercase text-gray-400 font-bold">Progress Rate</span>
            <p className="text-lg font-extrabold text-white font-mono mt-0.5">{roadmap.overallProgress}%</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <span className="text-[10px] uppercase text-gray-400 font-bold">Lessons Complete</span>
            <p className="text-lg font-extrabold text-white font-mono mt-0.5">{completedTasks} / {totalTasks}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <span className="text-[10px] uppercase text-gray-400 font-bold">Points Scored</span>
            <p className="text-lg font-extrabold text-accent-500 font-mono mt-0.5">+{roadmap.earnedXP} XP</p>
          </div>
        </div>
      </div>

      {/* Main Roadmap Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Horizontal scrollable timeline list (SHOWSTOPPER) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel border border-white/10 rounded-3xl p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">90-Day Transition Timeline</h3>
            
            {/* Scroll Area container */}
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 timeline-scroll">
              {roadmap.phases.map((phase: any, pIdx: number) => {
                const phaseColors = ["border-green-500/20", "border-blue-500/20", "border-purple-500/20"];
                const headerColors = ["text-green-400 bg-green-500/10", "text-blue-400 bg-blue-500/10", "text-purple-400 bg-purple-500/10"];

                return (
                  <div 
                    key={phase.phaseNumber}
                    className={`flex-shrink-0 flex gap-4 border-l-2 pl-4 ${phaseColors[pIdx]}`}
                  >
                    {phase.weeks.map((week: any) => {
                      const isSelected = selectedWeek === week.weekNumber;
                      const isCompleted = week.status === "completed";
                      const isInProgress = week.status === "in_progress";

                      return (
                        <button
                          key={week.weekNumber}
                          onClick={() => setSelectedWeek(week.weekNumber)}
                          className={`w-44 text-left p-4 rounded-2xl border transition-all duration-300 ${
                            isSelected 
                              ? "bg-brand-500/10 border-brand-500 shadow-md shadow-brand-500/5" 
                              : isCompleted 
                                ? "bg-accent-500/5 border-accent-500/30 hover:border-accent-500/50" 
                                : "glass-panel border-white/5 hover:border-white/15"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-mono font-bold text-gray-500">WEEK {week.weekNumber}</span>
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5 text-accent-500" />
                            ) : isInProgress ? (
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                            ) : null}
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">{week.theme}</h4>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Week Task Lists Panel */}
          {activeWeekInfo && (
            <div className="glass-panel border border-white/10 rounded-3xl p-8 space-y-6">
              {/* Active week header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-500 font-mono">
                    Phase {activeWeekInfo.phase.phaseNumber} • Week {activeWeekInfo.week.weekNumber}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-1">{activeWeekInfo.week.theme}</h3>
                </div>

                <button 
                  onClick={() => setShowReflection(true)}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-4 h-4 text-brand-500" />
                  <span>AI Reflections</span>
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                {activeWeekInfo.week.tasks.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No specific daily tasks configured for this week. Use resources explorer to study related topics.</p>
                ) : (
                  activeWeekInfo.week.tasks.map((task: any) => {
                    const Badge = typeBadges[task.type] || { icon: BookOpen, label: "Read", color: "bg-white/5 text-white" };
                    const Icon = Badge.icon;
                    return (
                      <div 
                        key={task.id}
                        className={`flex items-start gap-4 p-4 bg-white/5 border rounded-2xl transition-all ${
                          task.completed 
                            ? "border-accent-500/20 bg-accent-500/5 opacity-70" 
                            : "border-white/5 hover:border-white/10"
                        }`}
                      >
                        {/* Checkbox Trigger */}
                        <button 
                          onClick={() => handleToggleTask(task.id, task.completed)}
                          className="mt-0.5 text-gray-400 hover:text-white transition"
                        >
                          {task.completed ? (
                            <CheckSquare className="w-5 h-5 text-accent-500 fill-accent-500/10" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>

                        {/* Contents */}
                        <div className="flex-grow space-y-1">
                          <p className={`text-sm font-bold leading-tight ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
                            {task.title}
                          </p>
                          
                          {/* Task details bar */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-gray-500 font-semibold font-mono">
                            <span className={`px-2 py-0.5 border rounded ${Badge.color} flex items-center gap-1`}>
                              <Icon className="w-3 h-3" />
                              <span>{Badge.label}</span>
                            </span>
                            <span>⏳ {task.estimatedMinutes} mins</span>
                            <span>🎯 +{task.xpReward || 10} XP</span>
                            
                            {task.resource?.url && (
                              <a 
                                href={task.resource.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-brand-500 hover:underline hover:text-brand-600 flex items-center gap-0.5"
                              >
                                <span>Link ({task.resource.platform})</span>
                                <ChevronRight className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Milestone Flag */}
              {activeWeekInfo.week.milestone && (
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl flex items-start gap-3 mt-4">
                  <Award className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Weekly Deliverable Milestone</h4>
                    <p className="text-xs text-gray-400 mt-1">{activeWeekInfo.week.milestone}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Unlocked skills & streak trackers */}
        <div className="lg:col-span-4 space-y-8">
          {/* Milestone checklist tracker */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Timeline Checklist</h3>
            <div className="space-y-3">
              {roadmap.phases.map((phase: any, idx: number) => {
                const phaseProgress = Math.round(
                  (phase.weeks.filter((w: any) => w.status === "completed").length / phase.weeks.length) * 100
                );
                return (
                  <div key={phase.phaseNumber} className="space-y-2 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>Phase {phase.phaseNumber}</span>
                      <span className="font-mono text-accent-500">{phaseProgress}%</span>
                    </div>
                    {/* Visual Bar representation */}
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full" style={{ width: `${phaseProgress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gamification badges display */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Earned Transition Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center gap-1.5 opacity-90 shadow-md">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 text-glow-brand">
                  <Flame className="w-5 h-5 fill-brand-500/20" />
                </div>
                <span className="text-[10px] font-bold text-white">First Step</span>
                <span className="text-[8px] text-gray-500">Began timeline</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center gap-1.5 opacity-90 shadow-md">
                <div className="w-10 h-10 rounded-full bg-accent-500/10 border border-accent-500/30 flex items-center justify-center text-accent-500 text-glow-accent">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-white">Halfway Hero</span>
                <span className="text-[8px] text-gray-500">Complete 1 week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Reflections Dialog Modal */}
      {showReflection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div className="glass-panel border border-white/10 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="w-5 h-5 text-brand-500 text-glow-brand animate-pulse" />
              <span>AI Weekly Study Reflections</span>
            </h3>

            <p className="text-xs text-gray-400 leading-relaxed">
              Consolidate your learning by testing yourself with these AI prompts from your curriculum builder:
            </p>

            <ul className="space-y-4">
              {activePrompts.map((prompt, idx) => (
                <li key={idx} className="text-xs text-gray-300 flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5 leading-normal">
                  <span className="font-bold text-brand-500 font-mono">{idx+1}.</span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowReflection(false)}
                className="px-6 py-2 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-bold text-white transition"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
