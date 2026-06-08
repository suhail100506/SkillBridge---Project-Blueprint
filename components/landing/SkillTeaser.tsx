"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Plus, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Linkedin = (props: any) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const defaultSkills = [
  "Excel", "Python", "SQL", "Communication", "Management", "Figma", "Marketing", "Writing"
];

export default function SkillTeaser() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>(["Excel", "Communication"]);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [customSkill, setCustomSkill] = useState("");

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleCustomSkillAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  const handleTeaserSubmit = () => {
    // Save temporary skills in session storage or state for register route auto-population
    if (typeof window !== "undefined") {
      sessionStorage.setItem("teaser_skills", JSON.stringify(skills));
      sessionStorage.setItem("teaser_linkedin", linkedinUrl);
    }
    router.push("/register");
  };

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-b border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-accent-500 font-bold mb-3">
          Interactive Teaser
        </h2>
        <p className="text-3xl sm:text-4xl font-sans font-extrabold text-white">
          Simulate Your Compatibility Map
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: CV Upload Box */}
        <div className="lg:col-span-6 flex flex-col justify-between p-8 rounded-2xl glass-panel border border-white/10 relative overflow-hidden group">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-500" />
              <span>Option A: Upload Your CV</span>
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Drop your PDF/DOCX to let AI parse your core competencies automatically.
            </p>
          </div>

          <div 
            onClick={handleTeaserSubmit}
            className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/15 hover:border-brand-500/50 rounded-xl p-8 cursor-pointer bg-white/0 hover:bg-white/5 transition-all duration-300 min-h-[180px]"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-3 group-hover:text-brand-500 group-hover:scale-110 transition-all" />
            <p className="text-sm font-semibold text-white mb-1">Drag and drop your CV file</p>
            <p className="text-xs text-gray-500">PDF, DOCX, or TXT up to 5MB</p>
          </div>

          {/* LinkedIn import alternative */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Linkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Or paste LinkedIn Profile URL..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>
              <button 
                onClick={handleTeaserSubmit}
                className="px-4 py-2 bg-brand-500/10 border border-brand-500/30 hover:bg-brand-500 hover:border-brand-500 text-brand-500 hover:text-white rounded-lg text-xs font-bold transition-all"
              >
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Right: Interactive Skill Chips */}
        <div className="lg:col-span-6 p-8 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-500 fill-accent-500/20" />
              <span>Option B: Skill Chip Selector</span>
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Pick your current skills and watch the transition matrix update.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {/* Added Skills container */}
            <div className="min-h-[70px] border border-white/5 bg-dark-900/50 rounded-xl p-4 flex flex-wrap gap-2 items-center">
              {skills.length === 0 ? (
                <span className="text-xs text-gray-500 italic">No skills selected. Click suggestions below.</span>
              ) : (
                <AnimatePresence>
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-white text-xs font-bold font-mono"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <span>{skill}</span>
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleCustomSkillAdd} className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 transition-all"
              />
              <button 
                type="submit"
                className="px-3 py-1.5 bg-accent-500/10 border border-accent-500/30 hover:bg-accent-500 hover:border-accent-500 text-accent-500 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Suggested Chips */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Suggested Core Skills</p>
              <div className="flex flex-wrap gap-2">
                {defaultSkills.map((skill) => {
                  const isSelected = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      disabled={isSelected}
                      onClick={() => addSkill(skill)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                        isSelected 
                          ? "border-white/5 bg-white/5 text-gray-600 cursor-not-allowed" 
                          : "border-white/10 bg-white/0 text-gray-300 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6 flex justify-end">
            <button
              onClick={handleTeaserSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 group shadow-md shadow-brand-500/10"
            >
              <span>Analyze My Profile</span>
              <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
