"use client";

import { motion } from "framer-motion";
import ScoreRing from "../shared/ScoreRing";
import { TrendingUp, Award, Laptop } from "lucide-react";

const previewCareers = [
  {
    title: "Data Analyst",
    avgSalary: "₹4.5L - ₹14L / yr",
    growth: "+23% demand by 2027",
    match: 82,
    skills: ["SQL Data querying", "Tableau visualizations", "Introductory Statistics"],
    color: "rgba(108, 92, 231, 0.3)",
    icon: Laptop,
  },
  {
    title: "UX Designer",
    avgSalary: "₹5L - ₹16L / yr",
    growth: "+18% growth index",
    match: 74,
    skills: ["Figma layouts", "Interaction Wireframes", "User Interviews"],
    color: "rgba(0, 210, 160, 0.3)",
    icon: Award,
  },
  {
    title: "Cybersecurity Analyst",
    avgSalary: "₹5.5L - ₹18L / yr",
    growth: "+32% security hires",
    match: 71,
    skills: ["Firewall routing", "Linux Shell commands", "Incident auditing"],
    color: "rgba(147, 197, 253, 0.3)",
    icon: TrendingUp,
  },
];

export default function CareerPreview() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-b border-white/5 relative">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-brand-500 font-bold mb-3">
          Explore Potential Pathways
        </h2>
        <p className="text-3xl sm:text-4xl font-sans font-extrabold text-white">
          Preview Compatibility Matchings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {previewCareers.map((c, idx) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col justify-between group transition-all duration-300 hover:border-white/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <ScoreRing value={c.match} />
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-500 transition-colors">
                  {c.title}
                </h3>
                
                <div className="flex flex-col gap-1.5 mb-6 text-xs font-semibold">
                  <span className="text-gray-400">Salary: <strong className="text-white font-normal">{c.avgSalary}</strong></span>
                  <span className="text-accent-500 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{c.growth}</span>
                  </span>
                </div>

                {/* Skills list */}
                <div className="space-y-2 mb-6">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Bridge Gaps</p>
                  <ul className="space-y-1.5">
                    {c.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="text-xs text-gray-300 flex items-center gap-2 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-white/5">
                <span className="text-xs text-brand-500 font-bold group-hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors">
                  <span>View Full Curriculum</span>
                  <span>→</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
