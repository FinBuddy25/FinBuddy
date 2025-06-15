"use client";

import React from "react";
import { ClipboardCheck, BarChart3, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-pattern";

const steps = [
  {
    title: "Input Your Data",
    description:
      "Easily enter or import your financial data, including invoices, expenses, and bank transactions.",
    icon: FileText,
  },
  {
    title: "Automated Processing",
    description:
      "Our system automatically categorizes and processes your data, saving you time and reducing errors.",
    icon: ClipboardCheck,
  },
  {
    title: "Generate Insights",
    description:
      "Access comprehensive reports and dashboards to gain valuable insights into your financial health.",
    icon: BarChart3,
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-blue-50 py-12 dark:bg-blue-950/10"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <DotPattern
          className="absolute inset-0 h-full w-full text-blue-300/20 dark:text-blue-600/20 [mask-image:radial-gradient(white,transparent_85%)]"
          width={20}
          height={20}
        />
      </div>

      {/* Additional background elements */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How FinBuddy Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A simple, streamlined process to manage your financial operations
            efficiently.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="relative grid gap-4 md:grid-cols-3 md:gap-10">
            {/* Connector Line (visible only on desktop) */}
            <div className="absolute top-1/2 left-0 right-0 hidden h-0.5 -translate-y-1/2 transform bg-gradient-to-r from-blue-200/0 via-blue-200/80 to-blue-200/0 md:block"></div>

            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <Card className="relative z-10 h-full bg-white dark:bg-gray-900">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="mb-2 flex items-center">
                      <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Arrow connector (hide on last item and on mobile) */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-7 top-1/2 hidden -translate-y-1/2 transform md:block">
                    <div className="relative">
                      <div className="absolute -inset-3 rounded-full bg-blue-100/50 blur-sm dark:bg-blue-900/30"></div>
                      <ArrowRight className="relative h-6 w-6 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-foreground">
              Start streamlining your financial management today!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
