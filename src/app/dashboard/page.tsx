"use client";

import Link from "next/link";
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
} from "recharts";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LogoutButton from "@/components/LogoutButton";
import { Chart } from "@/components/ui/chart";
import {
  salesData,
  expensesData,
  taxDetailsData,
  ordersPerMonthData,
  repeatedCustomersData,
  lineItemSaleData,
  geoRevenueData,
  purchasesData,
  latestInvoicesData,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils/invoice";

export default function DashboardPage() {
  // Mock user data for demonstration
  const user = { email: "admin@gmail.com" };

  // Chart configurations
  const salesChartConfig = {
    sales: {
      label: "Sales",
      color: "var(--chart-1)",
    },
  };

  const expensesChartConfig = {
    expenses: {
      label: "Expenses",
      color: "var(--chart-2)",
    },
  };

  const ordersChartConfig = {
    orders: {
      label: "Orders",
      color: "var(--chart-3)",
    },
  };

  const customersChartConfig = {
    new: {
      label: "New Customers",
      color: "var(--chart-1)",
    },
    returning: {
      label: "Returning Customers",
      color: "var(--chart-2)",
    },
  };

  const lineItemChartConfig = {
    sales: {
      label: "Sales",
      color: "var(--chart-4)",
    },
  };

  const geoChartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--chart-5)",
    },
  };

  const purchasesChartConfig = {
    purchases: {
      label: "Purchases",
      color: "var(--chart-3)",
    },
  };

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
  ];

  return (
    <div className="p-6 w-full max-w-[2000px] mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.email}</p>
        </div>
        <LogoutButton />
      </header>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {/* Sales Chart */}
        <Card className="col-span-2 w-full">
          <CardHeader>
            <CardTitle>Sales</CardTitle>
            <CardDescription>
              Monthly sales for the current year
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart config={salesChartConfig}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-sales)"
                  name="Sales"
                />
              </LineChart>
            </Chart>
          </CardContent>
        </Card>

        {/* Expenses Chart */}
        <Card className="col-span-2 w-full">
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>
              Monthly expenses for the current year
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart config={expensesChartConfig}>
              <BarChart data={expensesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="var(--color-expenses)"
                  name="Expenses"
                />
              </BarChart>
            </Chart>
          </CardContent>
        </Card>

        {/* Line Item Sale Graph */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Product Sales</CardTitle>
            <CardDescription>Sales by product</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart config={lineItemChartConfig}>
              <BarChart data={lineItemSaleData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="var(--color-sales)" name="Sales" />
              </BarChart>
            </Chart>
          </CardContent>
        </Card>

        {/* Purchases Chart */}
        <Card className="col-span-2 w-full">
          <CardHeader>
            <CardTitle>Purchases</CardTitle>
            <CardDescription>
              Monthly purchases for the current year
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart config={purchasesChartConfig}>
              <LineChart data={purchasesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-purchases)"
                  name="Purchases"
                />
              </LineChart>
            </Chart>
          </CardContent>
        </Card>

        {/* Geographic Revenue Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Geographic Revenue</CardTitle>
            <CardDescription>Revenue by location</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart config={geoChartConfig}>
              <BarChart data={geoRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  name="Revenue"
                />
              </BarChart>
            </Chart>
          </CardContent>
        </Card>

        {/* Orders per Month Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Orders per Month</CardTitle>
            <CardDescription>Monthly order count</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart config={ordersChartConfig}>
              <LineChart data={ordersPerMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  name="Orders"
                />
              </LineChart>
            </Chart>
          </CardContent>
        </Card>

        {/* Tax Details Chart */}
        <Card className="col-span-2 w-full">
          <CardHeader>
            <CardTitle>Tax Details</CardTitle>
            <CardDescription>Breakdown of taxes</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taxDetailsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {taxDetailsData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Repeated Customers Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Customer Analysis</CardTitle>
            <CardDescription>New vs. returning customers</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Chart config={customersChartConfig}>
              <BarChart data={repeatedCustomersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="new"
                  fill="var(--color-new)"
                  name="New Customers"
                />
                <Bar
                  dataKey="returning"
                  fill="var(--color-returning)"
                  name="Returning Customers"
                />
              </BarChart>
            </Chart>
          </CardContent>
        </Card>

        {/* Latest Invoices */}
        <Card className="col-span-4 w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latest Invoices</CardTitle>
              <CardDescription>Recent 10 invoices</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/reports">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestInvoicesData.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/reports/${invoice.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
