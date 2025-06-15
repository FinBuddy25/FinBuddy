"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Search,
  AlertTriangle,
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Filter
} from "lucide-react"
import { formatCurrency } from "@/lib/utils/invoice"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { MagicCard } from "@/components/ui/magic-card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Define types for inventory items
type InventoryItem = {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  price: number
  cost: number
  reorderPoint: number
  supplier: string
  lastRestocked: string
}

// Mock data for inventory items
const mockInventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Laptop - Dell XPS 13",
    sku: "TECH-001",
    category: "Electronics",
    quantity: 15,
    price: 1299.99,
    cost: 950.00,
    reorderPoint: 5,
    supplier: "Dell Inc.",
    lastRestocked: "2023-12-15"
  },
  {
    id: "2",
    name: "Wireless Mouse",
    sku: "TECH-002",
    category: "Electronics",
    quantity: 42,
    price: 24.99,
    cost: 12.50,
    reorderPoint: 10,
    supplier: "Logitech",
    lastRestocked: "2024-01-10"
  },
  {
    id: "3",
    name: "USB-C Cable",
    sku: "TECH-003",
    category: "Accessories",
    quantity: 3,
    price: 12.99,
    cost: 5.25,
    reorderPoint: 15,
    supplier: "Anker",
    lastRestocked: "2024-02-05"
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    sku: "TECH-004",
    category: "Audio",
    quantity: 0,
    price: 79.99,
    cost: 45.00,
    reorderPoint: 5,
    supplier: "JBL",
    lastRestocked: "2023-11-20"
  },
  {
    id: "5",
    name: "Mechanical Keyboard",
    sku: "TECH-005",
    category: "Accessories",
    quantity: 8,
    price: 149.99,
    cost: 85.00,
    reorderPoint: 10,
    supplier: "Corsair",
    lastRestocked: "2024-01-25"
  },
  {
    id: "6",
    name: "27\" Monitor",
    sku: "TECH-006",
    category: "Electronics",
    quantity: 4,
    price: 299.99,
    cost: 180.00,
    reorderPoint: 5,
    supplier: "LG Electronics",
    lastRestocked: "2023-12-10"
  },
  {
    id: "7",
    name: "Wireless Earbuds",
    sku: "TECH-007",
    category: "Audio",
    quantity: 22,
    price: 129.99,
    cost: 65.00,
    reorderPoint: 8,
    supplier: "Samsung",
    lastRestocked: "2024-02-15"
  },
  {
    id: "8",
    name: "External SSD 1TB",
    sku: "TECH-008",
    category: "Storage",
    quantity: 7,
    price: 159.99,
    cost: 95.00,
    reorderPoint: 5,
    supplier: "Western Digital",
    lastRestocked: "2024-01-05"
  },
  {
    id: "9",
    name: "Webcam HD",
    sku: "TECH-009",
    category: "Accessories",
    quantity: 2,
    price: 69.99,
    cost: 35.00,
    reorderPoint: 5,
    supplier: "Logitech",
    lastRestocked: "2023-11-15"
  },
  {
    id: "10",
    name: "Smartphone Charger",
    sku: "TECH-010",
    category: "Accessories",
    quantity: 18,
    price: 19.99,
    cost: 8.00,
    reorderPoint: 10,
    supplier: "Anker",
    lastRestocked: "2024-02-01"
  }
]

// Mock data for category distribution
const categoryData = [
  { name: 'Electronics', value: 3 },
  { name: 'Accessories', value: 4 },
  { name: 'Audio', value: 2 },
  { name: 'Storage', value: 1 }
]

// Mock data for inventory value by category
const inventoryValueData = [
  { category: 'Electronics', value: 23249.85 },
  { category: 'Accessories', value: 2729.85 },
  { category: 'Audio', value: 2859.78 },
  { category: 'Storage', value: 1119.93 }
]

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function InventoryPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [stockAlerts, setStockAlerts] = useState<InventoryItem[]>([])

  // Calculate total inventory value
  const totalInventoryValue = mockInventoryItems.reduce(
    (total, item) => total + (item.quantity * item.price),
    0
  )

  // Calculate total number of items
  const totalItems = mockInventoryItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
      setFilteredItems(mockInventoryItems)

      // Set stock alerts for items that are below reorder point or out of stock
      setStockAlerts(
        mockInventoryItems.filter(
          item => item.quantity <= item.reorderPoint
        )
      )
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      setFilteredItems(
        mockInventoryItems.filter(
          item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredItems(mockInventoryItems)
    }
  }, [searchTerm])

  // Get stock status badge
  const getStockStatusBadge = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (item.quantity <= item.reorderPoint) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Inventory Management</CardTitle>
              <CardDescription>
                Manage your inventory items, track stock levels, and view alerts.
              </CardDescription>
            </div>
            <div className="mt-4 flex space-x-2 md:mt-0">
              <ShimmerButton className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Item
              </ShimmerButton>
              <Button variant="outline" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalItems}</div>
                    <p className="text-xs text-muted-foreground">
                      Across {mockInventoryItems.length} unique products
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalInventoryValue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on current stock levels
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stockAlerts.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Items below reorder point
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="all-items">
                <TabsList>
                  <TabsTrigger value="all-items">All Items</TabsTrigger>
                  <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="all-items" className="space-y-4">
                  {/* Search and filter */}
                  <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, SKU, or category..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>

                  {/* Inventory table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">
                            <div className="flex items-center space-x-1">
                              <span>Product</span>
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>
                            <div className="flex items-center space-x-1">
                              <span>Quantity</span>
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex items-center space-x-1">
                              <span>Price</span>
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Restocked</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              No results found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{formatCurrency(item.price)}</TableCell>
                              <TableCell>{getStockStatusBadge(item)}</TableCell>
                              <TableCell>{item.lastRestocked}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="low-stock" className="space-y-4">
                  {/* Stock alerts section */}
                  <MagicCard className="w-full overflow-hidden rounded-xl">
                    <div className="p-4">
                      <div className="mb-4 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold">Stock Alerts</h3>
                      </div>

                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">Product</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead>Current Stock</TableHead>
                              <TableHead>Reorder Point</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Supplier</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stockAlerts.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                  No stock alerts found.
                                </TableCell>
                              </TableRow>
                            ) : (
                              stockAlerts.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.name}</TableCell>
                                  <TableCell>{item.sku}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>{item.reorderPoint}</TableCell>
                                  <TableCell>{getStockStatusBadge(item)}</TableCell>
                                  <TableCell>{item.supplier}</TableCell>
                                  <TableCell className="text-right">
                                    <TooltipProvider>
                                      <UITooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="outline" size="sm">Reorder</Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Place a new order with supplier</p>
                                        </TooltipContent>
                                      </UITooltip>
                                    </TooltipProvider>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </MagicCard>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Category Distribution Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Category Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Inventory Value by Category */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Inventory Value by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={inventoryValueData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="category" />
                              <YAxis />
                              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Value']} />
                              <Legend />
                              <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
