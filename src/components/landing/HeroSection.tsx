"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, Receipt, Wallet } from "lucide-react";
import { RetroGrid } from "@/components/ui/retro-grid";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <RetroGrid
          angle={75}
          cellSize={40}
          opacity={0.3}
          lightLineColor="rgba(59, 130, 246, 0.2)"
          darkLineColor="rgba(59, 130, 246, 0.3)"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/10" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8 lg:gap-16">
          {/* Hero Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-400">
              <span className="font-medium">
                FinBuddy Entreprise Resource Planning
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Streamline Your Financial Management
            </h1>
            <p className="mb-8 max-w-md text-xl text-muted-foreground">
              A comprehensive ERP solution for invoicing, expense tracking, and
              financial reporting. Simplify your business operations today.
            </p>

            {/* Feature Pills */}
            <div className="mb-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <BarChart3 className="mr-1.5 h-4 w-4" />
                <span>Financial Reporting</span>
              </div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Receipt className="mr-1.5 h-4 w-4" />
                <span>Invoice Management</span>
              </div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Wallet className="mr-1.5 h-4 w-4" />
                <span>Expense Tracking</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/login" className="sm:w-auto">
                <ShimmerButton
                  shimmerColor="var(--shimmer-to)"
                  shimmerSize="0.03em"
                  shimmerDuration="2.5s"
                  background="var(--primary)"
                  className="w-full font-medium sm:w-auto sm:min-w-32"
                  size="lg"
                >
                  Get Started
                </ShimmerButton>
              </Link>
              <Link href="#features" className="sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full group sm:w-auto sm:min-w-32"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-[fit-content] w-full overflow-hidden rounded-xl border bg-background/50 p-2 shadow-xl md:h-[fit-content]">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20"></div>
              <div className="relative h-full w-full rounded-lg bg-white shadow-sm dark:bg-gray-900">
                <div className="h-8 border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                  <div className="flex h-full items-center px-4">
                    <div className="flex space-x-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    <div className="mx-auto text-xs font-medium text-gray-500 dark:text-gray-400">
                      FinBuddy Dashboard
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2">
                  <Image
                    src="/dashboard-preview.png"
                    alt="FinBuddy Dashboard Preview"
                    width={600}
                    height={400}
                    className="h-full w-full rounded object-cover"
                    priority
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
