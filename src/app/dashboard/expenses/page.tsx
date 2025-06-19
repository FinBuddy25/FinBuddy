"use client"

import { useState } from "react"
import {
  BarChart,
  LineChart,
  PieChart,
  Pie,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Fuel,
  Users,
  Zap,
  Building,
  Wifi,
  Wrench,
  Briefcase,
  Plane,
  Search,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

import {
  expenseCategories,
  monthlyExpensesByCategory,
  forecastData,
  totalExpensesByMonth,
  expenseDistribution,
} from "@/lib/mock-data/expenses"
import { formatCurrency } from "@/lib/utils/invoice"

// Map category IDs to their respective Lucide icons
const categoryIcons: Record<string, React.ReactNode> = {
  fuel: <Fuel className="h-5 w-5" />,
  salaries: <Users className="h-5 w-5" />,
  electricity: <Zap className="h-5 w-5" />,
  rent: <Building className="h-5 w-5" />,
  internet: <Wifi className="h-5 w-5" />,
  maintenance: <Wrench className="h-5 w-5" />,
  supplies: <Briefcase className="h-5 w-5" />,
  travel: <Plane className="h-5 w-5" />,
}

export default function ExpensesPage() {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter categories based on search query
  const filteredCategories = expenseCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Prepare data for monthly trend chart
  const prepareMonthlyTrendData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map(month => {
      // Add index signature to allow dynamic property assignment
      const monthData: { month: string; [key: string]: number | string } = { month }
      expenseCategories.forEach(category => {
        const expense = monthlyExpensesByCategory.find(
          e => e.month === month && e.categoryId === category.id
        )
        if (expense) {
          monthData[category.id] = expense.amount
        }
      })
      return monthData
    })
  }

  // Prepare data for forecast chart
  const prepareForecastData = () => {
    const historicalMonths = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const forecastMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    const historicalData = historicalMonths.map(month => {
      return {
        month,
        actual: totalExpensesByMonth.find(m => m.month === month)?.amount || 0,
        forecast: 0,
      }
    })

    const forecastTotals = forecastMonths.map(month => {
      const monthTotal = expenseCategories.reduce((total, category) => {
        const forecast = forecastData.find(
          f => f.month === month && f.categoryId === category.id
        )
        return total + (forecast?.amount || 0)
      }, 0)

      return {
        month,
        actual: 0,
        forecast: monthTotal,
      }
    })

    return [...historicalData, ...forecastTotals]
  }

  const monthlyTrendData = prepareMonthlyTrendData()
  const forecastChartData = prepareForecastData()

  // Chart configurations
  const expenseDistributionConfig = {
    distribution: {
      label: "Distribution",
      color: "var(--chart-1)",
    },
  }

  const monthlyTrendConfig = {
    trend: {
      label: "Trend",
      color: "var(--chart-2)",
    },
  }

  const forecastConfig = {
    actual: {
      label: "Actual",
      color: "var(--chart-3)",
    },
    forecast: {
      label: "Forecast",
      color: "var(--chart-4)",
    },
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Categories</h1>
          <p className="text-muted-foreground">
            Manage your expense categories, view analytics, and forecast future expenses
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <ShimmerButton className="gap-2">
                <Plus className="h-4 w-4" />
                Add Expense
              </ShimmerButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new expense category to track your business expenses
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input id="description" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">
                    Icon
                  </Label>
                  <Input id="icon" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Color
                  </Label>
                  <Input id="color" type="color" className="col-span-3 h-10" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddCategoryOpen(false)}>Create Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-3">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {categoryIcons[category.id]}
                  </div>
                  {category.name}
                </div>
              </CardTitle>
              <div className="flex items-center">
                {category.trend > 0 ? (
                  <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
                    <TrendingUp className="h-3 w-3" />
                    {category.trend}%
                  </Badge>
                ) : category.trend < 0 ? (
                  <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
                    <TrendingDown className="h-3 w-3" />
                    {Math.abs(category.trend)}%
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
                    0%
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(category.totalAmount)}</div>
              <p className="text-xs text-muted-foreground">{category.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>Transactions</div>
                <div className="font-medium">{category.transactionCount}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics and Forecasting */}
      <div className="mt-6">
        <Tabs defaultValue="analytics">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="forecast">Forecast & Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-3 md:grid-cols-2">
              {/* Expense Distribution Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Expense Distribution</CardTitle>
                  <CardDescription>Distribution of expenses by category</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Chart config={expenseDistributionConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={66}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Chart>
                </CardContent>
              </Card>

              {/* Monthly Trend Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Monthly Expenses</CardTitle>
                  <CardDescription>Monthly expenses for the current year</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Chart config={monthlyTrendConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={totalExpensesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" name="Total Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Chart>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="forecast" className="space-y-6">
            {/* Forecast Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Forecast</CardTitle>
                <CardDescription>Projected expenses for the next 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Chart config={forecastConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#8884d8"
                        name="Actual"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#82ca9d"
                        name="Forecast"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Chart>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Expense breakdown by category over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Chart config={monthlyTrendConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      {expenseCategories.map((category) => (
                        <Line
                          key={category.id}
                          type="monotone"
                          dataKey={category.id}
                          stroke={category.color}
                          name={category.name}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </Chart>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
