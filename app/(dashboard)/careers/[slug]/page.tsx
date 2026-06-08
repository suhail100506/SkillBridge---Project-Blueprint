"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { 
  ArrowLeft, 
  TrendingUp, 
  Map, 
  Briefcase, 
  Award, 
  CheckCircle,
  HelpCircle,
  Building,
  Layers,
  Laptop
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [region, setRegion] = useState<"India" | "Global">("India");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch career detail by slug
  const { data: career, isLoading, error } = useQuery({
    queryKey: ["career", slug],
    queryFn: async () => {
      const res = await fetch(`/api/careers/${slug}`);
      if (!res.ok) throw new Error("Failed to load career detail");
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-mono">Fetching Career profile...</p>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 font-bold mb-4">Failed to load career pathway details.</p>
        <button onClick={() => router.push("/careers")} className="px-6 py-2 bg-brand-500 rounded-xl font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const salaries = region === "India" ? career.salaryIndia : career.salaryGlobal;
  const salarySuffix = region === "India" ? "L / yr" : "k / yr";
  const salaryDivider = region === "India" ? 100000 : 1000;

  // Filter skills
  const mustSkills = career.requiredSkills?.filter((s: any) => s.priority === "must") || [];
  const niceSkills = career.requiredSkills?.filter((s: any) => s.priority === "nice") || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none">
      {/* Back button */}
      <Link href="/careers" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explorer</span>
      </Link>

      {/* Main Header summary block */}
      <div className="glass-panel border border-white/10 rounded-3xl p-8 relative overflow-hidden bg-gradient-to-tr from-brand-500/5 to-dark-900">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-brand-500 font-mono tracking-widest px-2 py-1 bg-brand-500/10 rounded border border-brand-500/10">
              {career.industry}
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{career.title} Path</h2>
            <p className="text-sm text-gray-400 leading-relaxed font-light max-w-2xl">{career.description}</p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/profile"
              className="px-6 py-3.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-brand-500/15 flex items-center gap-1.5 transition"
            >
              <Map className="w-4 h-4" />
              <span>Generate 90-Day Plan</span>
            </Link>
          </div>
        </div>

        {/* Info stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 mt-8 border-t border-white/5 relative z-10">
          <div>
            <span className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Growth Forecast</span>
            <span className="text-sm font-bold text-accent-500 flex items-center gap-0.5">
              <TrendingUp className="w-4 h-4" />
              <span>+{career.demandGrowthRate}% by 2027</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Remote Friendly</span>
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-brand-500" />
              <span>{career.remotePercentage}% availability</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Study Effort</span>
            <span className="text-sm font-bold text-white">
              ~{career.requiredSkills?.reduce((acc: number, s: any) => acc + s.learningHours, 0) || 120} hours
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Certifications</span>
            <span className="text-sm font-bold text-white">
              {career.topCertifications?.length || 0} Recommended
            </span>
          </div>
        </div>
      </div>

      {/* Salary & Demand charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Salary Bands (Col span 6) */}
        <div className="lg:col-span-6 glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Salary Intelligence</h3>
            
            {/* Region toggle */}
            <div className="flex bg-white/5 border border-white/15 rounded-lg p-1">
              <button
                onClick={() => setRegion("India")}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  region === "India" ? "bg-brand-500 text-white" : "text-gray-400"
                }`}
              >
                India (INR)
              </button>
              <button
                onClick={() => setRegion("Global")}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  region === "Global" ? "bg-brand-500 text-white" : "text-gray-400"
                }`}
              >
                Global (USD)
              </button>
            </div>
          </div>

          {/* Salary bands details */}
          <div className="space-y-4 flex-grow">
            {[
              { label: "Entry Level", value: salaries.entry },
              { label: "Mid Career", value: salaries.mid },
              { label: "Senior Specialist", value: salaries.senior },
              { label: "Lead Architect", value: salaries.lead }
            ].map((band, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">{band.label}</span>
                  <span className="text-white">
                    {region === "India" ? "₹" : "$"}{(band.value / salaryDivider).toFixed(1)}{salarySuffix}
                  </span>
                </div>
                {/* Visual Bar representation */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full" style={{ width: `${(band.value / salaries.lead) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demand trendline chart (Col span 6) */}
        <div className="lg:col-span-6 glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div className="border-b border-white/5 pb-4 mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Job Postings Index</h3>
          </div>

          {mounted ? (
            <div className="w-full h-56 text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={career.demandTrend || []} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#a6adc8" />
                  <YAxis stroke="#a6adc8" />
                  <Tooltip 
                    contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelClassName="text-white font-bold text-xs"
                  />
                  <Line type="monotone" dataKey="indexValue" stroke="#6C5CE7" strokeWidth={3} dot={{ stroke: '#6C5CE7', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-xs text-gray-500 italic">Rendering Line Chart...</div>
          )}
        </div>
      </div>

      {/* Grid: Study Requirements & typical day */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Study requirements (Col span 7) */}
        <div className="md:col-span-7 glass-panel border border-white/10 rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/5 pb-3">Reskilling Study Modules</h3>
          
          <div className="space-y-4">
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-accent-500" />
                <span>Must Have Competencies</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mustSkills.map((s: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center text-xs font-semibold">
                    <span className="text-white font-mono">{s.name}</span>
                    <span className="text-gray-500 font-mono">⏳ {s.learningHours} hrs</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>Nice to Have Skills</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {niceSkills.map((s: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center text-xs font-semibold">
                    <span className="text-white font-mono">{s.name}</span>
                    <span className="text-gray-500 font-mono">⏳ {s.learningHours} hrs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Typical Day / Certs (Col span 5) */}
        <div className="md:col-span-5 space-y-6">
          {/* Typical Day */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <span className="text-[10px] uppercase text-gray-400 font-bold block">A Day in the Life</span>
            <p className="text-xs text-gray-300 leading-relaxed font-light">{career.typicalDayDescription}</p>
          </div>

          {/* Certifications list */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <span className="text-[10px] uppercase text-gray-400 font-bold block">Target Industry Certifications</span>
            <ul className="space-y-2">
              {career.topCertifications?.map((cert: string, idx: number) => (
                <li key={idx} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                  <Award className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
