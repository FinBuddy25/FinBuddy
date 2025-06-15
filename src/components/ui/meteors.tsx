"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export function Meteors({ number = 20, className }: MeteorsProps) {
  const [meteorStyles, setMeteorStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const styles = [...Array(number)].map(() => ({
      top: `${Math.floor(Math.random() * 100)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${Math.random() * 2 + 0.5}s`,
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className="absolute h-0.5 w-0.5 rounded-full bg-primary opacity-50 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            ...style,
            transform: "rotate(-45deg)",
            animation: `meteor linear forwards`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes meteor {
          0% {
            transform: rotate(-45deg) translateX(0);
            opacity: 1;
            height: 0px;
            width: 0px;
          }
          10% {
            height: 1px;
            width: 100px;
            opacity: 1;
          }
          100% {
            transform: rotate(-45deg) translateX(1000px);
            opacity: 0;
            height: 1px;
            width: 300px;
          }
        }
      `}</style>
    </div>
  );
}
