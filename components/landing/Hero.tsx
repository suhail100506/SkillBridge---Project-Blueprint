"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Play } from "lucide-react";

const floatingBadges = [
  { text: "Python", color: "border-brand-500/30 text-brand-500 bg-brand-500/10", top: "20%", left: "15%", delay: 0 },
  { text: "Figma", color: "border-accent-500/30 text-accent-500 bg-accent-500/10", top: "25%", left: "75%", delay: 1.5 },
  { text: "SQL queries", color: "border-blue-500/30 text-blue-400 bg-blue-500/10", top: "65%", left: "10%", delay: 0.8 },
  { text: "User Research", color: "border-purple-500/30 text-purple-400 bg-purple-500/10", top: "70%", left: "80%", delay: 2.2 },
  { text: "Agile PM", color: "border-warning/30 text-warning bg-warning/10", top: "50%", left: "85%", delay: 1.1 },
  { text: "Excel Model", color: "border-success/30 text-success bg-success/10", top: "45%", left: "5%", delay: 1.9 },
];

export default function Hero() {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden flex flex-col items-center justify-center border-b border-white/5">
      {/* Background radial glow effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[120px] top-10 left-1/2 -translate-x-1/2 animate-pulse-glow" />
      </div>

      {/* Floating interactive skill badges */}
      {floatingBadges.map((badge, idx) => (
        <motion.div
          key={idx}
          className={`absolute z-10 px-3 py-1.5 rounded-full border text-xs font-mono font-bold select-none max-md:hidden shadow-lg ${badge.color}`}
          style={{ top: badge.top, left: badge.left }}
          initial={{ y: 0 }}
          animate={{ y: [-8, 8, -8] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: badge.delay,
            ease: "easeInOut",
          }}
        >
          {badge.text}
        </motion.div>
      ))}

      {/* Inner Container */}
      <div className="max-w-4xl px-6 relative z-10 text-center flex flex-col items-center">
        {/* Ticker badge */}
        <motion.div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-white/10 text-xs font-medium text-brand-500 mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-glow-brand animate-pulse" />
          <span>Built for the Post-Automation Workforce</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-6xl font-sans font-extrabold tracking-tight text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Turn Your Skills Into Your{" "}
          <span className="bg-gradient-to-r from-brand-500 via-pink-500 to-accent-500 bg-clip-text text-transparent text-glow-brand">
            Next Career
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-gray-400 font-normal max-w-2xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          AI analyses your CV, maps your transferable skills, and builds a personalised 90-day reskilling roadmap with free learning pathways.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 group transition-all duration-200"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            onClick={() => {
              const el = document.getElementById("how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-4 glass-panel hover:bg-white/5 border-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Play className="w-4 h-4 text-accent-500 fill-accent-500/20" />
            <span>How it Works</span>
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="flex flex-col items-center gap-3 border-t border-white/5 pt-8 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
            Trusted by 14,200+ Career Changers
          </p>
          <div className="flex items-center gap-8 text-sm font-semibold text-gray-500 font-mono">
            <span>Tech transitioners</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>Non-tech professionals</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>Freelance pivoters</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
