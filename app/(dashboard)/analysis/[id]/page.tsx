"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";
import ScoreRing from "@/components/shared/ScoreRing";
import { 
  Plus, 
  Map, 
  Briefcase, 
  ChevronRight, 
  Download, 
  Share2, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Info,
  Clock
} from "lucide-react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { setActiveAnalysis, setActiveRoadmap } = useAppStore();
  const [selectedCareerIdx, setSelectedCareerIdx] = useState(0);
  const [generatingRoadmapId, setGeneratingRoadmapId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Client hydration check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch analysis details
  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => {
      const res = await fetch(`/api/analyse/${id}`);
      if (!res.ok) throw new Error("Failed to load analysis report");
      return res.json();
    }
  });

  // Sync with Zustand store
  useEffect(() => {
    if (analysis) {
      setActiveAnalysis(analysis);
    }
  }, [analysis, setActiveAnalysis]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-mono">Loading Analysis Report...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 font-bold mb-4">Failed to load analysis report.</p>
        <button onClick={() => router.push("/profile")} className="px-6 py-2 bg-brand-500 rounded-xl font-bold">
          Try Again
        </button>
      </div>
    );
  }

  const selectedCareer = analysis.recommendations?.[selectedCareerIdx];

  // Radar chart data generator based on selected career
  const getRadarData = () => {
    if (!selectedCareer) return [];
    
    // Combine 3 skills you have and 3 skills you need to build overlap axis
    const have = selectedCareer.skillsYouHave.slice(0, 3).map((s: string) => ({
      subject: s,
      "You Have": 100,
      "Target Role": 100
    }));

    const need = selectedCareer.skillsNeeded.slice(0, 3).map((s: string) => ({
      subject: s,
      "You Have": 20,
      "Target Role": 100
    }));

    return [...have, ...need];
  };

  // Generate 90-Day Plan Action
  const handleGenerateRoadmap = async () => {
    if (!selectedCareer) return;
    setGeneratingRoadmapId(selectedCareer.careerSlug);
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: id,
          targetCareer: selectedCareer.careerTitle,
          targetCareerSlug: selectedCareer.careerSlug,
          hoursPerWeek: 8
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveRoadmap(data.roadmap);
        router.push(`/roadmap/${data.roadmapId}`);
      } else {
        throw new Error("Failed to generate plan");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to build roadmap. Redirecting to demo plan.");
      router.push("/roadmap/demo-roadmap-id");
    } finally {
      setGeneratingRoadmapId(null);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/analysis/shared/${analysis.shareToken || 'demo-token'}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Public read-only share link copied to clipboard:\n${shareUrl}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 print:p-0 print:bg-white print:text-black">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-brand-500 text-glow-brand font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Mapping Complete</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Career Transition Blueprint</h2>
          <p className="text-sm text-gray-400">Review your compatibility scores and generate your 90-day learning curriculum.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleShare}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Link</span>
          </button>
          <button 
            onClick={handlePrint}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-brand-500/15 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Grid: Skill summary & AI narrative */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Readiness Card */}
        <div className="md:col-span-4 glass-panel border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Transition Readiness</span>
          <ScoreRing value={analysis.overallScore || 78} size={110} strokeWidth={8} />
          <div>
            <h4 className="text-sm font-bold text-white">Career Readiness Score</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-[200px] leading-relaxed">Composite match based on transferable skills, experience, and educational background.</p>
          </div>
        </div>

        {/* Skill Clusters Badge summary */}
        <div className="md:col-span-8 glass-panel border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Extracted Skill Clusters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span>Strong / Verified ({analysis.extractedSkills?.strong?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysis.extractedSkills?.strong?.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono font-bold rounded">
                      {s}
                    </span>
                  )) || <span className="text-xs text-gray-500 italic">None</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span>Developing ({analysis.extractedSkills?.developing?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysis.extractedSkills?.developing?.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-mono font-bold rounded">
                      {s}
                    </span>
                  )) || <span className="text-xs text-gray-500 italic">None</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Transferable Soft ({analysis.extractedSkills?.transferable?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysis.extractedSkills?.transferable?.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold rounded">
                      {s}
                    </span>
                  )) || <span className="text-xs text-gray-500 italic">None</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>Skill Gaps ({analysis.extractedSkills?.gaps?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysis.extractedSkills?.gaps?.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold rounded">
                      {s}
                    </span>
                  )) || <span className="text-xs text-gray-500 italic">None</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 items-start text-xs text-gray-400">
            <Info className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed"><strong className="text-white">AI Analysis:</strong> {analysis.aiSummary}</p>
          </div>
        </div>
      </div>

      {/* Grid: 3 Recommended Career Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">3 Recommended Transitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analysis.recommendations?.map((rec: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedCareerIdx(idx)}
              className={`p-6 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between items-stretch gap-4 ${
                selectedCareerIdx === idx
                  ? "bg-brand-500/10 border-brand-500/40 shadow-lg shadow-brand-500/5"
                  : "glass-panel border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold font-mono px-2 py-0.5 bg-white/5 rounded border border-white/5 text-gray-400">Option {idx+1}</span>
                <span className="text-xs font-bold text-accent-500 bg-accent-500/10 px-2 py-0.5 rounded border border-accent-500/10">{rec.matchPercentage}% match</span>
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white tracking-tight">{rec.careerTitle}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">{rec.whyItFits}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold border-t border-white/5 pt-3 mt-1">
                <span>{rec.skillsNeeded?.length || 0} skills to bridge</span>
                <span className="flex items-center text-brand-500">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Career detail: Split layout */}
      {selectedCareer && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Highlights, skills checklist & roadmap callout */}
          <div className="lg:col-span-7 space-y-8">
            <div className="glass-panel border border-white/10 rounded-3xl p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedCareer.careerTitle} Overview</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{selectedCareer.whyItFits}</p>
              </div>

              {/* Salary Indicator bar */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Annual Salary Band (INR)</span>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-xs font-semibold text-white">
                    <span>Entry: ₹{(selectedCareer.salaryRange.min / 100000).toFixed(1)}L</span>
                    <span>Average: ₹{(selectedCareer.salaryRange.mid / 100000).toFixed(1)}L</span>
                    <span>Lead: ₹{(selectedCareer.salaryRange.max / 100000).toFixed(1)}L</span>
                  </div>
                  {/* Visual Bar representation */}
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative border border-white/5">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full" style={{ width: "70%", marginLeft: "15%" }} />
                  </div>
                </div>
              </div>

              {/* Transferable Skills comparison checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-white/5 py-6">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-wider text-green-400 font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Skills You Have</span>
                  </span>
                  <ul className="space-y-1.5">
                    {selectedCareer.skillsYouHave.map((s: string) => (
                      <li key={s} className="text-xs text-gray-300 font-medium font-mono">{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-red-400 animate-pulse" />
                    <span>Skills You Need</span>
                  </span>
                  <ul className="space-y-1.5">
                    {selectedCareer.skillsNeeded.map((s: string) => (
                      <li key={s} className="text-xs text-gray-300 font-medium font-mono">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Generating Roadmap Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-400 leading-normal max-w-sm">
                  <span>Build your custom learning pathway mapping this role's study resources.</span>
                </div>
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={generatingRoadmapId !== null}
                  className="px-6 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-500/10 flex items-center gap-2 group transition-all"
                >
                  {generatingRoadmapId ? (
                    <span>Creating Plan...</span>
                  ) : (
                    <>
                      <span>Generate 90-Day Plan</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Recharts Radar overlap & Market intelligence line chart */}
          <div className="lg:col-span-5 space-y-8">
            {/* Interactive Radar */}
            <div className="glass-panel border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[300px]">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-4">Transferable Overlap Map</span>
              {mounted ? (
                <div className="w-full h-64 text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={getRadarData()}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" stroke="#a6adc8" fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" fontSize={8} />
                      <Radar name="You" dataKey="You Have" stroke="#00D2A0" fill="#00D2A0" fillOpacity={0.2} />
                      <Radar name="Target Role" dataKey="Target Role" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.15} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-gray-500 italic">Rendering radar chart...</div>
              )}
            </div>

            {/* D3/Recharts Job Demand Forecast Line Chart */}
            <div className="glass-panel border border-white/10 rounded-3xl p-6 flex flex-col items-stretch min-h-[300px]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Job Postings Demand Trend</span>
                <span className="text-xs font-bold text-accent-500 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{selectedCareer.demandGrowth}% Growth</span>
                </span>
              </div>

              {mounted ? (
                <div className="w-full h-64 text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedCareer.jobsDemandData || []} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="year" stroke="#a6adc8" />
                      <YAxis stroke="#a6adc8" />
                      <Tooltip 
                        contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                        labelClassName="text-white font-bold text-xs"
                      />
                      <Line type="monotone" dataKey="count" stroke="#6C5CE7" strokeWidth={3} dot={{ stroke: '#6C5CE7', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-gray-500 italic">Rendering line chart...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
