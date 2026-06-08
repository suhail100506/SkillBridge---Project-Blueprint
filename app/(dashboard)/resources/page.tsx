"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpen, Star, Tv, GraduationCap, Clock, ExternalLink, Plus } from "lucide-react";

const platforms = ["All", "YouTube", "NPTEL", "Coursera"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [activeCareerPath, setActiveCareerPath] = useState("All");

  // Fetch resources
  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources", search, selectedPlatform, selectedLevel, activeCareerPath],
    queryFn: async () => {
      const res = await fetch(
        `/api/resources?search=${search}&platform=${selectedPlatform}&level=${selectedLevel}&careerPath=${activeCareerPath}`
      );
      if (!res.ok) throw new Error("Failed to load resources");
      return res.json();
    }
  });

  const activeResources = resources || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Free Resources Library</h2>
        <p className="text-sm text-gray-400">Notion-style database containing curated YouTube playlists, IIT NPTEL courses, and Coursera auditable tracks.</p>
      </div>

      {/* Filter panel */}
      <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics, skills, platforms (e.g. Python, SQL, Excel)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all"
          />
        </div>

        {/* Double row filters: Platform & Levels */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2 border-t border-white/5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase text-gray-500 font-bold mr-2">Platform:</span>
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                  selectedPlatform === p
                    ? "bg-brand-500/20 border-brand-500 text-white"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase text-gray-500 font-bold mr-2">Difficulty:</span>
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLevel(l)}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                  selectedLevel === l
                    ? "bg-brand-500/20 border-brand-500 text-white"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Library items */}
      {isLoading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-mono">Loading assets...</p>
        </div>
      ) : activeResources.length === 0 ? (
        <div className="text-center py-20 text-xs text-gray-500 italic">No resources found matching the current search parameters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeResources.map((res: any, idx: number) => {
            const isNptel = res.platform === "NPTEL";
            const isCoursera = res.platform === "Coursera";
            const isYoutube = res.platform === "YouTube";

            const platformColors = isNptel 
              ? "bg-orange-500/10 border-orange-500/20 text-orange-400" 
              : isCoursera 
                ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400";

            return (
              <div 
                key={idx}
                className="glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between items-stretch gap-6 transition-all duration-300 hover:border-white/15 group"
              >
                <div className="space-y-4">
                  {/* Header badges */}
                  <div className="flex justify-between items-center">
                    <span className={`px-2.5 py-0.5 border rounded-lg text-[10px] font-bold font-mono ${platformColors}`}>
                      {res.platform}
                    </span>
                    <div className="flex items-center text-yellow-400 gap-0.5 text-xs font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-yellow-400/20" />
                      <span>{res.rating || "4.8"}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-white leading-snug tracking-tight group-hover:text-brand-500 transition-colors">
                    {res.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {res.tags.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 bg-white/5 text-[9px] font-mono text-gray-400 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details and CTAs */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[11px] font-bold text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <span>{res.duration}</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg flex items-center gap-1 transition"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
