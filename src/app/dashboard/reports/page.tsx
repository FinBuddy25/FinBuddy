"use client"

import { BarChart3, Construction } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Reports</CardTitle>
              <CardDescription>
                Generate and view financial reports
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <BarChart3 className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Coming Soon</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              The reports feature is currently under development. 
              Check back soon for updates!
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Construction className="mr-2 h-4 w-4" />
              <span>Under Construction</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
