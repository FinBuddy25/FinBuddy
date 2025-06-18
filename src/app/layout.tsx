import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinBuddy - Financial Management System",
  description:
    "A comprehensive financial management system for invoicing, expense tracking, and financial reporting",
  keywords: ["invoice", "finance", "accounting", "GST", "tax", "business"],
  authors: [{ name: "FinBuddy Team" }],
  creator: "FinBuddy",
  publisher: "FinBuddy",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "FinBuddy - Financial Management System",
    description:
      "A comprehensive financial management system for invoicing, expense tracking, and financial reporting",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "FinBuddy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinBuddy - Financial Management System",
    description:
      "A comprehensive financial management system for invoicing, expense tracking, and financial reporting",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
