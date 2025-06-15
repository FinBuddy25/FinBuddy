"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  children: React.ReactNode;
  className?: string;
  beamColor?: string;
  beamDuration?: number;
  beamSize?: number;
  beamOpacity?: number;
}

export function BorderBeam({
  children,
  className,
  beamColor = "#ffffff",
  beamDuration = 2.5,
  beamSize = 0.25,
  beamOpacity = 0.6,
}: BorderBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationPosition, setRotationPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationPosition((prev) => (prev + 1) % 360);
    }, beamDuration * 1000);

    return () => clearInterval(interval);
  }, [beamDuration]);

  return (
    <div
      ref={containerRef}
      className={cn("relative rounded-xl overflow-hidden", className)}
      style={{
        "--beam-color": beamColor,
        "--beam-size": `${beamSize}rem`,
        "--beam-opacity": beamOpacity,
      } as React.CSSProperties}
    >
      {/* Beam effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          backgroundImage: `linear-gradient(${rotationPosition}deg, transparent, var(--beam-color), transparent)`,
          backgroundSize: "200% 200%",
          backgroundPosition: "center",
          opacity: "var(--beam-opacity)",
          zIndex: 0,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 200%"],
        }}
        transition={{
          duration: beamDuration,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
