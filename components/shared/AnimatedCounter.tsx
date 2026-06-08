"use client";

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number; // in seconds
  suffix?: string;
}

export default function AnimatedCounter({ value, duration = 1.5, suffix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMs = duration * 1000;
    const stepTime = Math.max(Math.floor(totalMs / end), 20);
    const stepValue = Math.ceil(end / (totalMs / stepTime));

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="font-mono">
      {count}
      {suffix}
    </span>
  );
}
