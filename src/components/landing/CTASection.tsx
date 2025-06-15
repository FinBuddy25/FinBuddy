"use client";

import React from "react"; 
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-background py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <FlickeringGrid
          className="absolute inset-0 h-full w-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.3}
          flickerChance={0.1}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-blue-50 p-6 shadow-sm dark:bg-blue-950/20 sm:p-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Streamline Your Financial Operations?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of businesses that trust FinBuddy for their
              financial management needs.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <ShimmerButton
                  shimmerColor="var(--shimmer-to)"
                  shimmerSize="0.03em"
                  shimmerDuration="2.5s"
                  background="var(--primary)"
                  className="font-medium"
                  size="lg"
                >
                  Get Started
                </ShimmerButton>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="group">
                  Request Demo
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
