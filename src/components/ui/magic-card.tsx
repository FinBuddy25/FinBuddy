"use client";

import { cn } from "@/lib/utils";
import React, { HTMLAttributes, forwardRef } from "react";

export interface MagicCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the card.
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes to apply to the card.
   */
  className?: string;
  /**
   * Whether to add a hover effect to the card.
   * @default true
   */
  hover?: boolean;
  /**
   * Whether to add a gradient border to the card.
   * @default false
   */
  gradientBorder?: boolean;
}

export const MagicCard = forwardRef<HTMLDivElement, MagicCardProps>(
  ({ children, className, hover = true, gradientBorder = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl bg-white shadow-md dark:bg-black",
          hover && "transition-all duration-300 ease-in-out hover:shadow-xl",
          gradientBorder && "border border-transparent bg-gradient-to-r from-primary/20 to-primary/10 p-[1px]",
          className
        )}
        {...props}
      >
        <div className={cn(
          "h-full w-full rounded-xl bg-white dark:bg-black",
          gradientBorder && "p-4"
        )}>
          {children}
        </div>
      </div>
    );
  }
);

MagicCard.displayName = "MagicCard";
