"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, Calendar, Users, DollarSign, ArrowUpRight, ShieldCheck, HelpCircle } from "lucide-react";

export default function InternshipsPage() {
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [paidOnly, setPaidOnly] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState("All");

  // Fetch internships
  const { data: internships, isLoading } = useQuery({
    queryKey: ["internships", remoteOnly, paidOnly, selectedCareer],
    queryFn: async () => {
      const res = await fetch(
        `/api/internships?remote=${remoteOnly}&paid=${paidOnly}&career=${selectedCareer}`
      );
      if (!res.ok) throw new Error("Failed to load internships");
      return res.json();
    }
  });

  const activeListings = internships || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Micro-Internships Board</h2>
        <p className="text-sm text-gray-400">Short-duration (2–8 week) verified project experiences designed specifically for career transitioners.</p>
      </div>

      {/* Filter Options */}
      <div className="glass-panel border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-6 items-center">
          {/* Remote checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-gray-400 hover:text-white transition">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-white/5 accent-brand-500 cursor-pointer"
            />
            <span>Remote Projects Only</span>
          </label>

          {/* Paid checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-gray-400 hover:text-white transition">
            <input
              type="checkbox"
              checked={paidOnly}
              onChange={(e) => setPaidOnly(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-white/5 accent-brand-500 cursor-pointer"
            />
            <span>Paid (Stipend Available)</span>
          </label>
        </div>

        {/* Mapped career filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Career Filter:</span>
          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="bg-dark-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500 transition-all w-full md:w-48"
          >
            <option value="All">All Transition Paths</option>
            <option value="data-analyst">Data Analyst</option>
            <option value="ux-designer">UX Designer</option>
            <option value="cybersecurity-analyst">Cybersecurity Analyst</option>
            <option value="full-stack-developer">Full Stack Developer</option>
          </select>
        </div>
      </div>

      {/* Grid list */}
      {isLoading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-mono">Loading matching projects...</p>
        </div>
      ) : activeListings.length === 0 ? (
        <div className="text-center py-20 text-xs text-gray-500 italic">No projects found matching the current search parameters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeListings.map((int: any) => {
            const formattedDeadline = new Date(int.deadline).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short"
            });
            const isUnpaid = int.stipend === null || int.stipend === 0;

            return (
              <div 
                key={int._id}
                className="glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between items-stretch gap-6 transition-all duration-300 hover:border-white/15 group"
              >
                <div>
                  {/* Header info */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-md">
                        {int.logo || "💼"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-none mb-1">{int.company}</h4>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{int.remote ? "Remote" : "On-site"}</span>
                        </span>
                      </div>
                    </div>

                    {int.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-500 text-[9px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-white mt-4 tracking-tight group-hover:text-brand-500 transition-colors leading-snug">
                    {int.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mt-2 line-clamp-3">
                    {int.description}
                  </p>

                  {/* Required Gained tags */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase text-gray-500 font-bold block">Skills Required</span>
                      <div className="flex flex-wrap gap-1">
                        {int.skills_required.slice(0, 2).map((s: string) => (
                          <span key={s} className="px-2 py-0.5 bg-white/5 text-[9px] font-mono text-gray-400 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase text-accent-500 font-bold block">Skills You'll Gain</span>
                      <div className="flex flex-wrap gap-1">
                        {int.skills_gained.slice(0, 2).map((s: string) => (
                          <span key={s} className="px-2 py-0.5 bg-accent-500/5 text-[9px] font-mono text-accent-500 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer details & Action */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[10px] font-bold text-gray-500 font-mono">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-600" />
                      <span>{int.duration_weeks} Wks</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-600" />
                      <span>{int.spots_remaining} Spots Left</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-white">
                      <span>Stipend:</span>
                      <span className={isUnpaid ? "text-gray-500" : "text-accent-500"}>
                        {isUnpaid ? "Unpaid" : `₹${int.stipend}`}
                      </span>
                    </span>
                  </div>

                  <a
                    href={int.apply_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500 hover:border-brand-500 text-brand-500 hover:text-white rounded-xl flex items-center gap-1 transition-all font-sans font-bold"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
