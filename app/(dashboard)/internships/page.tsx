"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, Calendar, Users, DollarSign, ArrowUpRight, ShieldCheck, HelpCircle, X, CheckCircle, Send, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

export default function InternshipsPage() {
  const { data: session } = useSession();
  const [selectedInternship, setSelectedInternship] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

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

                  <button
                    onClick={() => {
                      setSelectedInternship(int);
                      setIsSuccess(false);
                      setIsSubmitting(false);
                      setCoverLetter("");
                    }}
                    className="px-3.5 py-2 bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500 hover:border-brand-500 text-brand-500 hover:text-white rounded-xl flex items-center gap-1 transition-all font-sans font-bold"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-scale-in">
            {/* Background ambient glow inside modal */}
            <div className="absolute w-[200px] h-[200px] rounded-full bg-brand-500/10 blur-[60px] -top-10 -right-10 pointer-events-none" />

            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start relative z-10">
              <div>
                <span className="text-[10px] text-brand-500 uppercase tracking-widest font-bold font-mono">Micro-Internship Application</span>
                <h3 className="text-lg font-bold text-white mt-1 leading-tight">{selectedInternship.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{selectedInternship.company} • {selectedInternship.remote ? "Remote" : "On-site"}</p>
              </div>
              <button 
                onClick={() => setSelectedInternship(null)}
                className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 relative z-10">
              {!isSuccess ? (
                <div className="space-y-4">
                  {/* Form fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-gray-500">Full Name</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={session?.user?.name || "Demo Transitioner"}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-gray-400 cursor-not-allowed outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-gray-500">Email Address</label>
                      <input 
                        type="email" 
                        readOnly 
                        value={session?.user?.email || "demo@skillbridge.com"}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-gray-400 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-gray-500">Why are you interested in this project?</label>
                    <textarea 
                      required
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly describe why your skills fit this micro-internship, or how it aligns with your career transition roadmap..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-all resize-none placeholder:text-gray-500"
                    />
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-500 text-sm">
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white leading-none">Extracted Profile Resume.pdf</p>
                      <p className="text-[10px] text-gray-500 mt-1">Profile data & skills will be attached automatically</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={() => setSelectedInternship(null)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={isSubmitting || !coverLetter.trim()}
                      onClick={async () => {
                        setIsSubmitting(true);
                        // Simulate a premium API request sending animation
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        setIsSubmitting(false);
                        setIsSuccess(true);
                      }}
                      className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/40 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/10 flex items-center gap-1.5 transition"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4 animate-float">
                  <div className="mx-auto w-16 h-16 rounded-full bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-500">
                    <CheckCircle className="w-8 h-8 text-glow-accent animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">Application Sent!</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">Your compatibility profile and cover note have been successfully sent to <span className="text-white font-bold">{selectedInternship.company}</span>.</p>
                  </div>

                  {/* Gamified reward alert */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-full text-[10px] font-bold tracking-wider uppercase font-mono shadow-md shadow-brand-500/5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>+15 XP Earned</span>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={() => setSelectedInternship(null)}
                      className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
