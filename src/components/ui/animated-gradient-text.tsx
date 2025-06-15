"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: {
    from: string;
    to: string;
    animate?: boolean;
  };
}

export function AnimatedGradientText({
  children,
  className,
  gradient = {
    from: "from-blue-600",
    to: "to-purple-600",
    animate: true,
  },
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "inline-flex bg-clip-text text-transparent",
        gradient.animate ? "animate-text-gradient" : "",
        `bg-gradient-to-r ${gradient.from} ${gradient.to}`,
        className
      )}
    >
      {children}
    </span>
  );
}
