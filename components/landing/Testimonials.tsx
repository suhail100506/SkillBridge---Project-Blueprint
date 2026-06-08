"use client";

import { motion } from "framer-motion";
import { Quote, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Ramesh Kumar",
    before: "Laid-off Assembly Operator",
    after: "Data Operations Technician",
    story: "After the plant downsized, I had no tech experience. SkillBridge mapped my precision audit skills into analytics, built my roadmap, and helped me secure a 4-week micro-internship.",
    salaryIncrease: "+85%",
    timeline: "90 Days",
    avatar: "RK",
  },
  {
    name: "Sarah Fernandes",
    before: "High School Biology Teacher",
    after: "EdTech Associate Product Manager",
    story: "As a teacher, I managed lessons and parent demands. The AI identified these as product roadmapping and stakeholder coordination skills, mapping me to PM. The 13-week course list was exact.",
    salaryIncrease: "+120%",
    timeline: "120 Days",
    avatar: "SF",
  },
  {
    name: "Anjali Mehta",
    before: "Call Center Support Agent",
    after: "Junior UX Researcher",
    story: "Listening to customer complaints all day gave me deep empathy. SkillBridge showed me this was user research. I studied Figma and wireframes from free CodeCamp links and got hired immediately.",
    salaryIncrease: "+60%",
    timeline: "75 Days",
    avatar: "AM",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto relative">
      {/* Background decoration */}
      <div className="absolute left-0 bottom-10 w-80 h-80 rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-brand-500 font-bold mb-3">
          Transition Case Studies
        </h2>
        <p className="text-3xl sm:text-4xl font-sans font-extrabold text-white">
          Real Stories, Measured Pivots
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col justify-between group transition-all duration-300 hover:border-brand-500/30"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
          >
            <div>
              {/* Quote Icon */}
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-500 mb-6 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 transition-all">
                <Quote className="w-5 h-5" />
              </div>

              {/* Story */}
              <p className="text-sm text-gray-300 italic leading-relaxed mb-6 font-light">
                &ldquo;{t.story}&rdquo;
              </p>
            </div>

            {/* User Details & Metrics */}
            <div className="border-t border-white/5 pt-6 mt-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500/30 to-brand-600/30 flex items-center justify-center text-white text-xs font-bold font-mono">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none mb-1">{t.name}</h4>
                  <div className="text-[10px] text-gray-500 flex flex-col gap-0.5">
                    <span>From: <strong className="text-red-400/80 font-normal">{t.before}</strong></span>
                    <span>To: <strong className="text-accent-500 font-normal">{t.after}</strong></span>
                  </div>
                </div>
              </div>

              {/* Statistics Pill */}
              <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold">
                <div className="flex items-center gap-1 text-accent-500">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t.salaryIncrease} Salary</span>
                </div>
                <div className="text-gray-400">
                  <span>Pivot: {t.timeline}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
