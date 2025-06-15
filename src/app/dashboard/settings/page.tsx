"use client"

import Link from "next/link"
import { Settings, User, Building, Shield, Bell, Wallet } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {

  // Define the settings categories
  const settingsCategories = [
    {
      id: "general",
      name: "General",
      description: "Manage your general settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
    {
      id: "profile",
      name: "My Profile",
      description: "Manage your business information",
      icon: Building,
      href: "/dashboard/settings/profile",
    },
    {
      id: "account",
      name: "Account",
      description: "Manage your account settings",
      icon: User,
      href: "/dashboard/settings/account",
    },
    {
      id: "security",
      name: "Security",
      description: "Manage your security settings",
      icon: Shield,
      href: "/dashboard/settings/security",
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "Manage your notification preferences",
      icon: Bell,
      href: "/dashboard/settings/notifications",
    },
    {
      id: "billing",
      name: "Billing",
      description: "Manage your billing information",
      icon: Wallet,
      href: "/dashboard/settings/billing",
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {settingsCategories.map((category) => (
          <Link key={category.id} href={category.href}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
