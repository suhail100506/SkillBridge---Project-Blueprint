"use client";

import { useState } from "react";
import { Plus, X, Send } from "lucide-react";

interface SkillProfileFormProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
}

export default function SkillProfileForm({ onSubmit, loading }: SkillProfileFormProps) {
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [industry, setIndustry] = useState("Tech");
  const [yearsExperience, setYearsExperience] = useState(2);
  const [education, setEducation] = useState("Bachelor's");
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [location, setLocation] = useState("Remote");
  const [preferredWorkType, setPreferredWorkType] = useState("remote");
  const [hoursPerWeekForLearning, setHoursPerWeekForLearning] = useState(8);
  const [targetSalaryMin, setTargetSalaryMin] = useState(450000);
  const [targetSalaryMax, setTargetSalaryMax] = useState(1200000);
  const [careerGoal, setCareerGoal] = useState("");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter(s => s !== skill));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillsList.length < 3) {
      alert("Please select or add at least 3 skills to build an accurate career profile.");
      return;
    }
    onSubmit({
      currentJobTitle,
      industry,
      yearsExperience,
      education,
      skills: skillsList,
      location,
      preferredWorkType,
      hoursPerWeekForLearning,
      targetSalaryMin,
      targetSalaryMax,
      careerGoal
    });
  };

  const loadTeaserSkills = () => {
    if (typeof window !== "undefined") {
      const teaser = sessionStorage.getItem("teaser_skills");
      if (teaser) {
        try {
          const parsed = JSON.parse(teaser);
          if (Array.isArray(parsed)) {
            setSkillsList(parsed);
            sessionStorage.removeItem("teaser_skills");
          }
        } catch {}
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Autopopulate teaser skills trigger */}
      {typeof window !== "undefined" && sessionStorage.getItem("teaser_skills") && (
        <div className="flex justify-between items-center bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-2.5 text-xs text-brand-300">
          <span>Found skills selected on the landing page!</span>
          <button 
            type="button" 
            onClick={loadTeaserSkills}
            className="px-2.5 py-1 bg-brand-500 text-white rounded font-bold hover:bg-brand-600 transition"
          >
            Load Skills
          </button>
        </div>
      )}

      {/* Row 1: Job title & Industry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Job Title</label>
          <input
            type="text"
            required
            placeholder="e.g. High School Teacher, Sales Agent..."
            value={currentJobTitle}
            onChange={(e) => setCurrentJobTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Industry Sector</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition"
          >
            <option value="Tech">Tech / Software</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance / Banking</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail & Sales</option>
            <option value="Other">Other Services</option>
          </select>
        </div>
      </div>

      {/* Row 2: Experience & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Years of Experience: <span className="text-white font-mono">{yearsExperience} yrs</span>
          </label>
          <input
            type="range"
            min="0"
            max="25"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500 mt-4"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Education Level</label>
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition"
          >
            <option value="High School">High School</option>
            <option value="Diploma">Diploma / Associate Degree</option>
            <option value="Bachelor's">Bachelor&apos;s Degree</option>
            <option value="Master's">Master&apos;s Degree</option>
            <option value="PhD">PhD / Doctorate</option>
          </select>
        </div>
      </div>

      {/* Skills Input Tag box */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Current Skills <span className="text-red-400">*</span> <span className="text-gray-500 font-normal">(Add at least 3 skills)</span>
        </label>
        
        {/* Chip Box */}
        <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl min-h-[50px] mb-3">
          {skillsList.map((skill) => (
            <span 
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500/15 border border-brand-500/25 text-white text-xs font-bold font-mono"
            >
              <span>{skill}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveSkill(skill)}
                className="text-gray-400 hover:text-red-400 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {skillsList.length === 0 && (
            <span className="text-xs text-gray-500 self-center italic">No skills listed yet. Add skills below.</span>
          )}
        </div>

        {/* Input Add button */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill (e.g. Excel, Communication, Python...)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white font-bold flex items-center justify-center transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 3: Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Work Preference</label>
          <select
            value={preferredWorkType}
            onChange={(e) => setPreferredWorkType(e.target.value)}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition"
          >
            <option value="remote">Remote-first</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Weekly Study Availability</label>
          <select
            value={hoursPerWeekForLearning}
            onChange={(e) => setHoursPerWeekForLearning(parseInt(e.target.value))}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition"
          >
            <option value={3}>2–4 hours / week</option>
            <option value={8}>5–10 hours / week</option>
            <option value={15}>10+ hours / week</option>
          </select>
        </div>
      </div>

      {/* Salary Slider Double representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Min Salary (INR/yr)</label>
          <input
            type="number"
            value={targetSalaryMin}
            onChange={(e) => setTargetSalaryMin(parseInt(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Max Salary (INR/yr)</label>
          <input
            type="number"
            value={targetSalaryMax}
            onChange={(e) => setTargetSalaryMax(parseInt(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition"
          />
        </div>
      </div>

      {/* Goal Statement Textarea */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What kind of work excites you? (Goal Statement)</label>
        <textarea
          placeholder="e.g. I want to build data systems, make interfaces user friendly, and apply analytical skills in an operations setting..."
          value={careerGoal}
          onChange={(e) => setCareerGoal(e.target.value)}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading || skillsList.length < 3}
          className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/40 text-white rounded-xl font-bold shadow-lg shadow-brand-500/10 flex items-center gap-2 group transition-all"
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>Analyse My Profile</span>
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
