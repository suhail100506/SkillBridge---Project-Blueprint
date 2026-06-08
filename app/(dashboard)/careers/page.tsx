"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Compass, Shield, Laptop, DollarSign, ArrowRight, TrendingUp, Info } from "lucide-react";

const industries = ["All", "Tech & Business", "Design & Product", "Tech & Security", "Product & Business", "Tech & Software"];

export default function CareerExplorerPage() {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [sortBy, setSortBy] = useState("match"); // match, salary, growth
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Fetch career pathways list
  const { data: careers, isLoading } = useQuery({
    queryKey: ["careers", search, selectedIndustry],
    queryFn: async () => {
      const res = await fetch(`/api/careers?search=${search}&industry=${selectedIndustry}`);
      if (!res.ok) throw new Error("Failed to load careers list");
      return res.json();
    }
  });

  const activeCareers = careers || [];

  // Filter and sort client-side
  const processedCareers = activeCareers
    .filter((c: any) => !remoteOnly || c.remotePercentage >= 75)
    .sort((a: any, b: any) => {
      if (sortBy === "salary") {
        return b.salaryIndia.mid - a.salaryIndia.mid;
      }
      if (sortBy === "growth") {
        return b.demandGrowthRate - a.demandGrowthRate;
      }
      // Default: title alphabetical or mock compatibility match
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Career Explorer</h2>
          <p className="text-sm text-gray-400">Search and compare 50+ career paths with global salary insights and demand trends.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-6">
        {/* Search & Sort controllers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search careers, required skills, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>

          {/* Sort dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
            >
              <option value="match">Alphabetical</option>
              <option value="salary">Sort by: High Salary</option>
              <option value="growth">Sort by: Growth Trend</option>
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="md:col-span-3 flex items-center justify-end">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-400 hover:text-white transition">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 accent-brand-500 cursor-pointer"
              />
              <span>High Remote availability (75%+)</span>
            </label>
          </div>
        </div>

        {/* Industry chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                selectedIndustry === ind
                  ? "bg-brand-500/20 border-brand-500 text-white"
                  : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Careers Cards Grid */}
      {isLoading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-mono">Loading Careers...</p>
        </div>
      ) : processedCareers.length === 0 ? (
        <div className="text-center py-20 text-xs text-gray-500 italic">No career paths matched the active filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processedCareers.map((c: any) => (
            <div
              key={c._id}
              className="glass-panel border border-white/10 rounded-3xl p-6 flex flex-col justify-between items-stretch gap-6 transition-all duration-300 hover:border-white/15 group"
            >
              <div>
                {/* Heading */}
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-brand-500/10 border border-brand-500/10 text-brand-500 rounded">
                    {c.industry}
                  </span>
                  <span className="text-[10px] font-bold text-accent-500 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{c.demandGrowthRate}% Demand</span>
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white mt-4 group-hover:text-brand-500 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mt-2 font-light">
                  {c.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {c.tags.slice(0, 3).map((t: string) => (
                    <span key={t} className="px-2 py-0.5 bg-white/5 text-[9px] font-mono text-gray-400 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action and salary range summary */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[11px] font-bold text-gray-500">
                <div>
                  <span className="text-[9px] uppercase text-gray-500 block font-bold leading-none mb-1">Average Salary</span>
                  <span className="text-white">₹{(c.salaryIndia.entry / 100000).toFixed(1)}L - ₹{(c.salaryIndia.senior / 100000).toFixed(1)}L</span>
                </div>
                <Link
                  href={`/careers/${c.slug}`}
                  className="px-3 py-2 bg-brand-500/15 group-hover:bg-brand-500 text-brand-500 group-hover:text-white rounded-lg flex items-center gap-1 transition-all"
                >
                  <span>Explore Path</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
