"use client"

import { useState } from "react"
import {
  CreditCard,
  BanknoteIcon,
  Upload,
  FileText,
  Download,
  Building2,
  Plus,
  FileSpreadsheet,
  FileIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Check,
  Edit,
  Info,
  ArrowRight,
  BarChart3
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MagicCard } from "@/components/ui/magic-card"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts"

export default function BankCashPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle')
  const [showAIReviewModal, setShowAIReviewModal] = useState(false)
  const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([])

  // Dummy data for Category Distribution chart
  const categoryDistributionData = [
    { name: 'Salaries', value: 35000 },
    { name: 'Rent', value: 25000 },
    { name: 'Utilities', value: 15000 },
    { name: 'Office Supplies', value: 10000 },
    { name: 'Professional Services', value: 20000 },
    { name: 'Other', value: 5000 },
  ]

  // Colors for the Category Distribution chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  // Dummy data for Reconciliation Progress chart
  const reconciliationProgressData = [
    { month: 'Jan', matched: 85, unmatched: 15 },
    { month: 'Feb', matched: 88, unmatched: 12 },
    { month: 'Mar', matched: 90, unmatched: 10 },
    { month: 'Apr', matched: 92, unmatched: 8 },
    { month: 'May', matched: 94, unmatched: 6 },
    { month: 'Jun', matched: 95, unmatched: 5 },
  ]



  // Mock data for extracted transactions with AI suggestions
  interface ExtractedTransaction {
    id: string
    date: string
    description: string
    amount: number
    originalCategory: string | null
    aiSuggestedCategory: string
    aiConfidence: number
    clientMapping: string | null
    aiSuggestedClientMapping: string | null
    notes: string | null
    selected: boolean
  }

  // Sample data for AI-extracted transactions
  const mockExtractedTransactions: ExtractedTransaction[] = [
    {
      id: "tx1",
      date: "2023-06-15",
      description: "PAYMENT TO INFOSYS LIMITED",
      amount: -45000.00,
      originalCategory: null,
      aiSuggestedCategory: "Professional Services",
      aiConfidence: 0.92,
      clientMapping: null,
      aiSuggestedClientMapping: "Infosys Ltd.",
      notes: null,
      selected: true
    },
    {
      id: "tx2",
      date: "2023-06-14",
      description: "AMAZON PAYMENT",
      amount: -2450.00,
      originalCategory: null,
      aiSuggestedCategory: "Office Supplies",
      aiConfidence: 0.85,
      clientMapping: null,
      aiSuggestedClientMapping: null,
      notes: null,
      selected: true
    },
    {
      id: "tx3",
      date: "2023-06-13",
      description: "ELECTRICITY BILL PAYMENT",
      amount: -1200.00,
      originalCategory: null,
      aiSuggestedCategory: "Utilities",
      aiConfidence: 0.98,
      clientMapping: null,
      aiSuggestedClientMapping: null,
      notes: null,
      selected: true
    },
    {
      id: "tx4",
      date: "2023-06-12",
      description: "PAYMENT FROM TATA CONSULTANCY",
      amount: 75000.00,
      originalCategory: null,
      aiSuggestedCategory: "Income",
      aiConfidence: 0.95,
      clientMapping: null,
      aiSuggestedClientMapping: "Tata Consultancy Services",
      notes: null,
      selected: true
    },
    {
      id: "tx5",
      date: "2023-06-10",
      description: "OFFICE RENT PAYMENT",
      amount: -35000.00,
      originalCategory: null,
      aiSuggestedCategory: "Rent",
      aiConfidence: 0.97,
      clientMapping: null,
      aiSuggestedClientMapping: null,
      notes: null,
      selected: true
    },
    {
      id: "tx6",
      date: "2023-06-08",
      description: "STAFF SALARY PAYMENTS",
      amount: -120000.00,
      originalCategory: null,
      aiSuggestedCategory: "Salaries",
      aiConfidence: 0.99,
      clientMapping: null,
      aiSuggestedClientMapping: null,
      notes: null,
      selected: true
    },
    {
      id: "tx7",
      date: "2023-06-05",
      description: "PAYMENT FROM WIPRO LTD",
      amount: 65000.00,
      originalCategory: null,
      aiSuggestedCategory: "Income",
      aiConfidence: 0.94,
      clientMapping: null,
      aiSuggestedClientMapping: "Wipro Limited",
      notes: null,
      selected: true
    }
  ]

  // Handle file drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0])
    }
  }

  // Process the uploaded file
  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setProcessingStatus('uploading')

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setProcessingStatus('processing')

        // Simulate processing time
        setTimeout(() => {
          setProcessingStatus('completed')
          setExtractedTransactions(mockExtractedTransactions)
          setShowAIReviewModal(true)
        }, 2000)
      }
    }, 200)
  }

  // Reset the upload state
  const handleReset = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setProcessingStatus('idle')
    setShowAIReviewModal(false)
  }

  // Handle transaction selection toggle
  const toggleTransactionSelection = (id: string) => {
    setExtractedTransactions(prev =>
      prev.map(tx =>
        tx.id === id ? { ...tx, selected: !tx.selected } : tx
      )
    )
  }

  // Handle category change
  const handleCategoryChange = (id: string, category: string) => {
    setExtractedTransactions(prev =>
      prev.map(tx =>
        tx.id === id ? { ...tx, aiSuggestedCategory: category } : tx
      )
    )
  }

  // Handle client mapping change
  const handleClientMappingChange = (id: string, clientMapping: string | null) => {
    setExtractedTransactions(prev =>
      prev.map(tx =>
        tx.id === id ? { ...tx, aiSuggestedClientMapping: clientMapping } : tx
      )
    )
  }

  // Handle confirm AI suggestions
  const handleConfirmAISuggestions = () => {
    // In a real app, this would save the transactions to the database
    setShowAIReviewModal(false)
    // Reset the processing status to allow uploading another file
    setProcessingStatus('idle')
    alert('Transactions have been successfully processed and categorized!')
  }



  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Bank & Cash</CardTitle>
              <CardDescription>
                Manage and reconcile your bank and cash transactions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bank" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="bank" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Bank</span>
              </TabsTrigger>
              <TabsTrigger value="cash" className="flex items-center gap-2">
                <BanknoteIcon className="h-4 w-4" />
                <span>Reconciliation</span>
              </TabsTrigger>
            </TabsList>

            {/* Bank Reconciliation Tab */}
            <TabsContent value="bank" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* File Upload Section */}
                <MagicCard className="col-span-1 md:col-span-2 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Statement Import</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Upload your bank statement or connect directly to your bank account
                    </p>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors ${
                      isDragging ? 'border-primary bg-primary/5' : 'border-border'
                    } ${processingStatus !== 'idle' ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    {processingStatus === 'idle' && (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <h4 className="font-medium mb-1">Drag & Drop or Click to Upload</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Supports CSV, Excel, and PDF formats
                        </p>
                        <div className="flex justify-center gap-2 mb-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <FileSpreadsheet className="h-3 w-3" /> CSV
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <FileSpreadsheet className="h-3 w-3" /> Excel
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <FileIcon className="h-3 w-3" /> PDF
                          </Badge>
                        </div>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept=".csv,.xlsx,.xls,.pdf"
                          onChange={handleFileChange}
                        />
                      </>
                    )}

                    {processingStatus === 'uploading' && (
                      <div className="py-2">
                        <h4 className="font-medium mb-3">Uploading {uploadedFile?.name}</h4>
                        <div className="w-full bg-muted rounded-full h-2 mb-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground">{uploadProgress}% Complete</p>
                      </div>
                    )}

                    {processingStatus === 'processing' && (
                      <div className="py-2">
                        <h4 className="font-medium mb-2">Processing Statement</h4>
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Extracting transactions...</span>
                        </div>
                      </div>
                    )}

                    {processingStatus === 'completed' && (
                      <div className="py-2">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                        <h4 className="font-medium mb-1">Processing Complete</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Successfully extracted 24 transactions
                        </p>
                        <Button onClick={handleReset} variant="outline" size="sm">
                          Upload Another File
                        </Button>
                      </div>
                    )}

                    {processingStatus === 'error' && (
                      <div className="py-2">
                        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
                        <h4 className="font-medium mb-1">Processing Failed</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          There was an error processing your file. Please try again.
                        </p>
                        <Button onClick={handleReset} variant="outline" size="sm">
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div className="text-sm text-muted-foreground">
                      Max file size: 10MB
                    </div>
                  </div>
                </MagicCard>

                {/* Bank Connection Panel */}
                <MagicCard className="col-span-1 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Connected Banks</h3>
                    <p className="text-muted-foreground text-sm">
                      Directly connect to your bank accounts
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">HDFC Bank</h4>
                          <p className="text-xs text-muted-foreground">Last synced: Today</p>
                        </div>
                      </div>
                      <Badge>Active</Badge>
                    </div>

                    <div className="border rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">ICICI Bank</h4>
                          <p className="text-xs text-muted-foreground">Last synced: 2 days ago</p>
                        </div>
                      </div>
                      <Badge>Active</Badge>
                    </div>

                    <ShimmerButton
                      className="w-full flex items-center justify-center gap-2 mt-4"
                      onClick={() => alert('Connect new bank feature would open here')}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Connect New Bank</span>
                    </ShimmerButton>
                  </div>
                </MagicCard>



                {/* Analytics Dashboard */}
                <MagicCard className="col-span-1 md:col-span-3 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Reconciliation Dashboard</h3>
                    <p className="text-muted-foreground text-sm">
                      Key metrics and analytics for your bank reconciliation
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
                      <div className="text-2xl font-semibold">24</div>
                      <div className="text-xs text-muted-foreground">Last 30 days</div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Match Rate</div>
                      <div className="text-2xl font-semibold">85%</div>
                      <div className="text-xs text-green-500">+5% from last month</div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Unreconciled Amount</div>
                      <div className="text-2xl font-semibold">₹3,650.00</div>
                      <div className="text-xs text-red-500">Needs attention</div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Potential Duplicates</div>
                      <div className="text-2xl font-semibold">2</div>
                      <div className="text-xs text-yellow-500">Review required</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-4">Category Distribution</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryDistributionData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip formatter={(value: number) => `₹${value}`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-4">Reconciliation Progress</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={reconciliationProgressData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="matched"
                              stroke="#00C49F"
                              name="Matched %"
                            />
                            <Line
                              type="monotone"
                              dataKey="unmatched"
                              stroke="#FF8042"
                              name="Unmatched %"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => alert('Export report feature would open here')}
                    >
                      <Download className="h-4 w-4" />
                      <span>Export Report</span>
                    </Button>
                  </div>
                </MagicCard>
              </div>
            </TabsContent>

            {/* Cash Reconciliation Tab */}
            <TabsContent value="cash" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Manual Transaction Entry Form */}
                <MagicCard className="col-span-1 md:col-span-2 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Cash Transaction Entry</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Record your cash transactions manually
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="transaction-date">Date</Label>
                        <Input
                          id="transaction-date"
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transaction-type">Transaction Type</Label>
                        <select
                          id="transaction-type"
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                          <option value="transfer">Transfer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="transaction-amount">Amount</Label>
                        <Input
                          id="transaction-amount"
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transaction-category">Category</Label>
                        <select
                          id="transaction-category"
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                        >
                          <option value="">Select a category</option>
                          <option value="office-supplies">Office Supplies</option>
                          <option value="utilities">Utilities</option>
                          <option value="rent">Rent</option>
                          <option value="salaries">Salaries</option>
                          <option value="travel">Travel</option>
                          <option value="meals">Meals & Entertainment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transaction-description">Description</Label>
                      <Input
                        id="transaction-description"
                        placeholder="Enter transaction description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transaction-notes">Notes (Optional)</Label>
                      <textarea
                        id="transaction-notes"
                        className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                        placeholder="Add any additional notes"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline">Cancel</Button>
                      <ShimmerButton onClick={() => alert('Transaction would be saved here')}>
                        Save Transaction
                      </ShimmerButton>
                    </div>
                  </div>
                </MagicCard>

                {/* Cash Register View */}
                <MagicCard className="col-span-1 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Cash Register</h3>
                    <p className="text-muted-foreground text-sm">
                      Track your cash balance
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Opening Balance</div>
                      <div className="text-2xl font-semibold">₹10,000.00</div>
                      <div className="text-xs text-muted-foreground">As of today</div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
                      <div className="text-2xl font-semibold">₹8,450.00</div>
                      <div className="text-xs text-muted-foreground">Updated just now</div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Today&apos;s Transactions</div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">Income</div>
                          <div className="text-green-500">+₹1,200.00</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Expenses</div>
                          <div className="text-red-500">-₹2,750.00</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <select
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                        defaultValue="daily"
                      >
                        <option value="daily">Daily View</option>
                        <option value="weekly">Weekly View</option>
                        <option value="monthly">Monthly View</option>
                      </select>
                    </div>
                  </div>
                </MagicCard>

                {/* Transaction List */}
                <MagicCard className="col-span-1 md:col-span-3 p-6">
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Recent Cash Transactions</h3>
                      <p className="text-muted-foreground text-sm">
                        View and manage your recent cash transactions
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => alert('Bulk upload feature would open here')}
                      >
                        <Upload className="h-4 w-4" />
                        <span>Bulk Upload</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => alert('Export feature would open here')}
                      >
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium text-sm">Date</th>
                          <th className="text-left p-3 font-medium text-sm">Description</th>
                          <th className="text-left p-3 font-medium text-sm">Category</th>
                          <th className="text-right p-3 font-medium text-sm">Amount</th>
                          <th className="text-right p-3 font-medium text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3 text-sm">2023-06-15</td>
                          <td className="p-3 text-sm">Office rent payment</td>
                          <td className="p-3 text-sm">
                            <Badge variant="outline">Rent</Badge>
                          </td>
                          <td className="p-3 text-sm text-right text-red-500">-₹2,000.00</td>
                          <td className="p-3 text-sm text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 text-sm">2023-06-14</td>
                          <td className="p-3 text-sm">Cash sales</td>
                          <td className="p-3 text-sm">
                            <Badge variant="outline">Income</Badge>
                          </td>
                          <td className="p-3 text-sm text-right text-green-500">+₹1,200.00</td>
                          <td className="p-3 text-sm text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 text-sm">2023-06-13</td>
                          <td className="p-3 text-sm">Office supplies</td>
                          <td className="p-3 text-sm">
                            <Badge variant="outline">Office Supplies</Badge>
                          </td>
                          <td className="p-3 text-sm text-right text-red-500">-₹750.00</td>
                          <td className="p-3 text-sm text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing 3 of 24 transactions
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </div>
                </MagicCard>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Review Modal */}
      <Dialog open={showAIReviewModal} onOpenChange={setShowAIReviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>AI-Assisted Transaction Review</span>
            </DialogTitle>
            <DialogDescription>
              Review and confirm AI-suggested categorizations and client mappings for your transactions.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-grow pr-2 -mr-2">
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg border border-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Our AI has analyzed your bank statement and identified {extractedTransactions.length} transactions.
                    We&apos;ve suggested categories and client mappings based on the transaction descriptions.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Review the suggestions below and make any necessary changes before confirming.
                  </span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium text-sm">Date</th>
                      <th className="text-left p-3 font-medium text-sm">Description</th>
                      <th className="text-left p-3 font-medium text-sm">Amount</th>
                      <th className="text-left p-3 font-medium text-sm">Category</th>
                      <th className="text-left p-3 font-medium text-sm">Client Mapping</th>
                      <th className="text-center p-3 font-medium text-sm">Confidence</th>
                      <th className="text-center p-3 font-medium text-sm">Include</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedTransactions.map((tx) => (
                      <tr key={tx.id} className="border-t hover:bg-muted/20">
                        <td className="p-3 text-sm">{tx.date}</td>
                        <td className="p-3 text-sm">{tx.description}</td>
                        <td className="p-3 text-sm font-medium">
                          <span className={tx.amount < 0 ? "text-red-500" : "text-green-500"}>
                            {tx.amount < 0 ? "-" : "+"}₹{Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="relative">
                                  <select
                                    className="w-full h-8 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs pr-8"
                                    value={tx.aiSuggestedCategory}
                                    onChange={(e) => handleCategoryChange(tx.id, e.target.value)}
                                  >
                                    <option value="Income">Income</option>
                                    <option value="Professional Services">Professional Services</option>
                                    <option value="Office Supplies">Office Supplies</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Salaries">Salaries</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Meals">Meals & Entertainment</option>
                                    <option value="Other">Other</option>
                                  </select>
                                  {tx.aiConfidence > 0.9 && (
                                    <div className="absolute right-2 top-1.5 text-green-500">
                                      <Check className="h-3 w-3" />
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">AI Confidence: {(tx.aiConfidence * 100).toFixed(0)}%</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="p-3 text-sm">
                          {tx.aiSuggestedClientMapping ? (
                            <div className="flex items-center gap-1">
                              <Input
                                className="h-8 text-xs"
                                value={tx.aiSuggestedClientMapping}
                                onChange={(e) => handleClientMappingChange(tx.id, e.target.value)}
                              />
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">Not applicable</span>
                          )}
                        </td>
                        <td className="p-3 text-sm text-center">
                          <div className="flex justify-center">
                            <div
                              className={`w-12 h-2 rounded-full ${
                                tx.aiConfidence > 0.9 ? "bg-green-500" :
                                tx.aiConfidence > 0.7 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                            >
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${tx.aiConfidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={tx.selected}
                            onChange={() => toggleTransactionSelection(tx.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-muted">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Summary</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{extractedTransactions.filter(tx => tx.selected).length}</span> of {extractedTransactions.length} transactions selected
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Total Income</div>
                    <div className="text-sm font-medium text-green-500">
                      +₹{extractedTransactions
                        .filter(tx => tx.amount > 0 && tx.selected)
                        .reduce((sum, tx) => sum + tx.amount, 0)
                        .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Total Expenses</div>
                    <div className="text-sm font-medium text-red-500">
                      -₹{Math.abs(extractedTransactions
                        .filter(tx => tx.amount < 0 && tx.selected)
                        .reduce((sum, tx) => sum + tx.amount, 0))
                        .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Net Change</div>
                    <div className="text-sm font-medium">
                      ₹{extractedTransactions
                        .filter(tx => tx.selected)
                        .reduce((sum, tx) => sum + tx.amount, 0)
                        .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setShowAIReviewModal(false)}>
              Cancel
            </Button>
            <ShimmerButton onClick={handleConfirmAISuggestions}>
              Confirm & Process Transactions
            </ShimmerButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
