"use client"

import * as React from "react"
import { ResponsiveContainer } from "recharts"

import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactElement
}

function Chart({ config, className, children, ...props }: ChartProps) {
  return (
    <div
      className={cn("h-full w-full", className)}
      style={
        Object.entries(config).reduce(
          (acc, [key, { color }]) => {
            acc[`--color-${key}`] = color
            return acc
          },
          {} as Record<string, string>
        ) as React.CSSProperties
      }
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export { Chart }
