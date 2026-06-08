"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

export default function ScoreRing({ value, size = 50, strokeWidth = 4 }: ScoreRingProps) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 200);
    return () => clearTimeout(timer);
  }, [value]);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background track circle */}
        <circle
          className="text-white/15"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Active progress indicator circle */}
        <circle
          className="text-accent-500 transition-all duration-1000 ease-out text-glow-accent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute text-[10px] font-bold font-mono text-white leading-none">
        {progress}%
      </div>
    </div>
  );
}
