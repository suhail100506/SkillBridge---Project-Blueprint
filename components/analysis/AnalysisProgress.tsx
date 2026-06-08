"use client";

import { useEffect, useState } from "react";
import { Cpu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { text: "Reading your skill profile...", duration: 2000 },
  { text: "Identifying transferable skills...", duration: 2000 },
  { text: "Matching to career opportunities...", duration: 2000 },
  { text: "Building your transition report...", duration: 2000 }
];

export default function AnalysisProgress() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      if (index < steps.length) {
        setCurrentStep(index);
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 max-w-md mx-auto text-center space-y-8">
      {/* Animated Glowing Brain/Neural Illustration */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Outer pulse circles */}
        <div className="absolute inset-0 rounded-full border border-brand-500/20 animate-ping" />
        <div className="absolute inset-4 rounded-full border border-accent-500/20 animate-pulse-glow" />
        
        {/* Core rotating wireframe node */}
        <motion.div 
          className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative shadow-lg shadow-brand-500/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          {/* Neural dots */}
          <div className="absolute top-1 left-1/2 w-2 h-2 rounded-full bg-brand-500" />
          <div className="absolute bottom-1 left-1/2 w-2 h-2 rounded-full bg-brand-500" />
          <div className="absolute left-1 top-1/2 w-2 h-2 rounded-full bg-accent-500" />
          <div className="absolute right-1 top-1/2 w-2 h-2 rounded-full bg-accent-500" />
        </motion.div>

        {/* Center icon */}
        <div className="absolute w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Ticker Text */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent-500 animate-pulse" />
          <span>Generating Career Mapping</span>
        </h3>
        
        <div className="h-6 overflow-hidden relative">
          <p className="text-sm text-gray-400 font-mono transition-all duration-500">
            {steps[currentStep]?.text}
          </p>
        </div>
      </div>

      {/* Progress timeline dots */}
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <div 
            key={i}
            className={`w-3 h-1.5 rounded-full transition-all duration-300 ${
              i <= currentStep ? "bg-brand-500 w-6" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
