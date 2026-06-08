"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "../shared/AnimatedCounter";

const stats = [
  { value: 50, suffix: "+", title: "Career Paths Mapped", desc: "Detailed demand curves and required skills." },
  { value: 200, suffix: "+", title: "Free Learning Assets", desc: "YouTube courses, NPTEL syllabus & Coursera." },
  { value: 90, suffix: " Days", title: "Average Transition Window", desc: "Curated daily tasks to reach entry competence." },
  { value: 95, suffix: "%", title: "Path Completion Rate", desc: "Active users successfully completing milestone projects." },
];

export default function Stats() {
  return (
    <section className="py-20 bg-dark-900/50 border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            className="text-center flex flex-col items-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent mb-3 text-glow-brand">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </span>
            <h3 className="text-sm font-bold text-white mb-1 tracking-tight">
              {stat.title}
            </h3>
            <p className="text-xs text-gray-500 max-w-[180px] leading-relaxed">
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
