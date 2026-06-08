"use client";

import { motion } from "framer-motion";
import { FileText, Cpu, Calendar } from "lucide-react";

const steps = [
  {
    stepNumber: "01",
    title: "Upload CV or Skills Profile",
    description: "Drag & drop your current resume or manually check off your skills. The system parses your technical, soft, and domain competencies.",
    icon: FileText,
    glow: "rgba(108, 92, 231, 0.15)",
    borderGlow: "rgba(108, 92, 231, 0.4)",
  },
  {
    stepNumber: "02",
    title: "Compare 3 Custom Careers",
    description: "Our AI matching engine scores you against 50+ roles. View compatibility ratios, salary ranges, and job vacancy forecast curves.",
    icon: Cpu,
    glow: "rgba(0, 210, 160, 0.15)",
    borderGlow: "rgba(0, 210, 160, 0.4)",
  },
  {
    stepNumber: "03",
    title: "Execute Your 90-Day Plan",
    description: "Follow a daily calendar timeline loaded with curated NPTEL, YouTube, and Coursera tutorials. Track achievements and claim XP rewards.",
    icon: Calendar,
    glow: "rgba(147, 197, 253, 0.15)",
    borderGlow: "rgba(147, 197, 253, 0.4)",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto border-b border-white/5 relative">
      {/* Background gradients */}
      <div className="absolute right-0 top-1/4 w-72 h-72 rounded-full bg-accent-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-accent-500 font-bold mb-3">
          The Platform Mechanics
        </h2>
        <p className="text-3xl sm:text-4xl font-sans font-extrabold text-white">
          Three Steps to Your Next Milestone
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col relative overflow-hidden group border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              {/* Corner Glow background */}
              <div 
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-[20px] transition-all duration-300 group-hover:scale-125"
                style={{ backgroundColor: step.glow }}
              />

              {/* Number and Icon Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-mono font-bold text-white/25 group-hover:text-brand-500/50 transition-colors duration-200">
                  {step.stepNumber}
                </span>
                <div 
                  className="p-3.5 rounded-xl border border-white/10 bg-white/5 text-white flex items-center justify-center transition-colors duration-200"
                  style={{ boxShadow: `0 0 10px ${step.borderGlow}` }}
                >
                  <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>

              {/* Contents */}
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-brand-500 transition-colors duration-200">
                {step.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
