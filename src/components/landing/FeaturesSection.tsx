"use client";

import React from "react";
import {
  BarChart3,
  Receipt,
  Wallet,
  FileText,
  CreditCard,
  Shield,
} from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { GridPattern } from "@/components/ui/grid-pattern";

const features = [
  {
    name: "Invoice Management",
    description:
      "Create, manage, and track invoices with ease. Support for GST/tax calculations and multiple templates.",
    icon: Receipt,
    href: "#invoice-management",
    cta: "Learn More",
    className: "md:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Receipt className="h-56 w-56 text-primary" />
        <GridPattern
          width={20}
          height={20}
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(white,transparent_85%)]"
        />
      </div>
    ),
  },
  {
    name: "Expense Tracking",
    description:
      "Monitor and categorize all business expenses. Generate reports and analyze spending patterns.",
    icon: Wallet,
    href: "#expense-tracking",
    cta: "Learn More",
    className: "md:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Wallet className="h-56 w-56 text-primary" />
        <GridPattern
          width={20}
          height={20}
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(white,transparent_85%)]"
        />
      </div>
    ),
  },
  {
    name: "Financial Reporting",
    description:
      "Generate comprehensive financial reports with customizable templates and visualization options.",
    icon: BarChart3,
    href: "#financial-reporting",
    cta: "Learn More",
    className: "md:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <BarChart3 className="h-56 w-56 text-primary" />
        <GridPattern
          width={20}
          height={20}
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(white,transparent_85%)]"
        />
      </div>
    ),
  },
  {
    name: "Document Management",
    description:
      "Store, organize, and retrieve financial documents securely. AI-powered document extraction.",
    icon: FileText,
    href: "#document-management",
    cta: "Learn More",
    className: "md:col-span-1 md:row-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <FileText className="h-56 w-56 text-primary" />
        <GridPattern
          width={20}
          height={20}
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(white,transparent_85%)]"
        />
      </div>
    ),
  },
  {
    name: "Bank Integration",
    description:
      "Connect your bank accounts for automatic transaction imports and reconciliation.",
    icon: CreditCard,
    href: "#bank-integration",
    cta: "Learn More",
    className: "md:col-span-1 md:row-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <CreditCard className="h-56 w-56 text-primary" />
        <GridPattern
          width={20}
          height={20}
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(white,transparent_85%)]"
        />
      </div>
    ),
  },
  {
    name: "Tax Compliance",
    description:
      "Stay compliant with tax regulations. Automated GST calculations and filing assistance.",
    icon: Shield,
    href: "#tax-compliance",
    cta: "Learn More",
    className: "md:col-span-1 md:row-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Shield className="h-56 w-56 text-primary" />
        <GridPattern
          width={20}
          height={20}
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(white,transparent_85%)]"
        />
      </div>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powerful Features for Your Business
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            FinBuddy provides all the tools you need to manage your business
            finances efficiently and accurately.
          </p>
        </div>

        <BentoGrid className="mx-auto max-w-5xl auto-rows-[20rem] md:auto-rows-[15rem]">
          {features.map((feature) => (
            <BentoCard
              key={feature.name}
              name={feature.name}
              description={feature.description}
              Icon={feature.icon}
              href={feature.href}
              cta={feature.cta}
              className={feature.className}
              background={feature.background}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
