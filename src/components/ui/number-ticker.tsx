"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface NumberTickerProps {
  value: number;
  className?: string;
  duration?: number;
  delay?: number;
  formatter?: (value: number) => string;
}

export function NumberTicker({
  value,
  className,
  duration = 1,
  delay = 0,
  formatter = (value) => value.toString(),
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Create a spring animation for the number
  const spring = useSpring(0, {
    stiffness: 80,
    damping: 20,
    duration,
  });

  // Transform the spring value to the actual value
  const display = useTransform(spring, (current) => formatter(Math.floor(current)));

  // Start the animation when in view
  useEffect(() => {
    if (inView && !hasAnimated) {
      setTimeout(() => {
        spring.set(value);
        setHasAnimated(true);
      }, delay * 1000);
    }
  }, [inView, spring, value, delay, hasAnimated]);

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}
