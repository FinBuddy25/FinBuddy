"use client";

import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileIcon,
  AlertCircle,
  Save,
} from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SimpleDatePicker } from "@/components/ui/simple-date-picker";

export default function DocumentExtractionPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "uploading" | "processing" | "completed" | "error"
  >("idle");
  const [showDataReview, setShowDataReview] = useState(false);
  const [openSalesRows, setOpenSalesRows] = useState<Record<string, boolean>>(
    {}
  );
  const [openPurchaseRows, setOpenPurchaseRows] = useState<
    Record<string, boolean>
  >({});
  const [salesDates, setSalesDates] = useState<Record<string, Date | undefined>>({});
  const [purchaseDates, setPurchaseDates] = useState<Record<string, Date | undefined>>({});

  const toggleSalesRow = (invoiceNumber: string) => {
    setOpenSalesRows((prev) => ({
      ...prev,
      [invoiceNumber]: !prev[invoiceNumber],
    }));
  };

  const togglePurchaseRow = (invoiceNumber: string) => {
    setOpenPurchaseRows((prev) => ({
      ...prev,
      [invoiceNumber]: !prev[invoiceNumber],
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(Array.from(e.target.files));
    }
  };

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
    setProcessingStatus("uploading");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setProcessingStatus("processing");

        setTimeout(() => {
          setProcessingStatus("completed");
          setShowDataReview(true);
        }, 2000);
      }
    }, 200);
  };

  const handleReset = () => {
    setUploadedFiles([]);
    setUploadProgress(0);
    setProcessingStatus("idle");
    setShowDataReview(false);
  };

  const salesData = [
    {
      invoiceNumber: "INV-001",
      date: "2025-10-26",
      customer: "Reliance Industries",
      gstin: "27AAACR7459N1Z5",
      amount: 17700.0,
      status: "Paid",
      lineItems: [
        {
          description: "Petroleum Products",
          assessableValue: 15000,
          cgst: 1350,
          sgst: 1350,
          igst: 0,
          total: 17700,
        },
      ],
    },
    {
      invoiceNumber: "INV-003",
      date: "2025-11-10",
      customer: "Infosys Ltd",
      gstin: "29AAACI4567B1Z6",
      amount: 47200.0,
      status: "Paid",
      lineItems: [
        {
          description: "Software Development",
          assessableValue: 40000,
          cgst: 3600,
          sgst: 3600,
          igst: 0,
          total: 47200,
        },
      ],
    },
    {
      invoiceNumber: "INV-004",
      date: "2025-11-15",
      customer: "HDFC Bank",
      gstin: "27AAACH1234B1Z4",
      amount: 23600.0,
      status: "Pending",
      lineItems: [
        {
          description: "Financial Services",
          assessableValue: 20000,
          cgst: 1800,
          sgst: 1800,
          igst: 0,
          total: 23600,
        },
      ],
    },
    {
      invoiceNumber: "INV-005",
      date: "2025-11-20",
      customer: "Bharti Airtel",
      gstin: "07AAACB5678A1Z5",
      amount: 11800.0,
      status: "Paid",
      lineItems: [
        {
          description: "Telecommunication Services",
          assessableValue: 10000,
          cgst: 0,
          sgst: 0,
          igst: 1800,
          total: 11800,
        },
      ],
    },
    {
      invoiceNumber: "INV-006",
      date: "2025-11-25",
      customer: "Wipro",
      gstin: "29AAACW4321C1Z8",
      amount: 35400.0,
      status: "Pending",
      lineItems: [
        {
          description: "Cloud Services",
          assessableValue: 30000,
          cgst: 2700,
          sgst: 2700,
          igst: 0,
          total: 35400,
        },
      ],
    },
    {
      invoiceNumber: "INV-007",
      date: "2025-12-01",
      customer: "Adani Ports",
      gstin: "24AADCA1234B1Z3",
      amount: 88500.0,
      status: "Paid",
      lineItems: [
        {
          description: "Logistics Services",
          assessableValue: 75000,
          cgst: 0,
          sgst: 0,
          igst: 13500,
          total: 88500,
        },
      ],
    },
  ];

  const purchaseData = [
    {
      invoiceNumber: "PO-001",
      date: "2025-10-25",
      vendor: "JSW Steel",
      gstin: "29AAACJ1234A1Z2",
      amount: 295000.0,
      status: "Paid",
      lineItems: [
        {
          description: "Steel Coils",
          assessableValue: 250000,
          cgst: 22500,
          sgst: 22500,
          igst: 0,
          total: 295000,
        },
      ],
    },
    {
      invoiceNumber: "PO-002",
      date: "2025-11-01",
      vendor: "Bharat Electronics",
      gstin: "29AAACB4321B1Z1",
      amount: 118000.0,
      status: "Pending",
      lineItems: [
        {
          description: "Electronic Components",
          assessableValue: 100000,
          cgst: 0,
          sgst: 0,
          igst: 18000,
          total: 118000,
        },
      ],
    },
    {
      invoiceNumber: "PO-003",
      date: "2025-11-08",
      vendor: "UltraTech Cement",
      gstin: "27AAACU5678C1Z0",
      amount: 82600.0,
      status: "Paid",
      lineItems: [
        {
          description: "Cement Bags",
          assessableValue: 70000,
          cgst: 6300,
          sgst: 6300,
          igst: 0,
          total: 82600,
        },
      ],
    },
    {
      invoiceNumber: "PO-005",
      date: "2025-11-18",
      vendor: "Asian Paints",
      gstin: "27AAACA1234E1Z8",
      amount: 41300.0,
      status: "Paid",
      lineItems: [
        {
          description: "Paint Supplies",
          assessableValue: 35000,
          cgst: 3150,
          sgst: 3150,
          igst: 0,
          total: 41300,
        },
      ],
    },
    {
      invoiceNumber: "PO-007",
      date: "2025-11-28",
      vendor: "Larsen & Toubro",
      gstin: "27AAACL1234G1Z6",
      amount: 354000.0,
      status: "Paid",
      lineItems: [
        {
          description: "Heavy Machinery",
          assessableValue: 300000,
          cgst: 27000,
          sgst: 27000,
          igst: 0,
          total: 354000,
        },
      ],
    },
    {
      invoiceNumber: "PO-008",
      date: "2025-12-02",
      vendor: "ITC Limited",
      gstin: "33AAACI5678H1Z5",
      amount: 94400.0,
      status: "Pending",
      lineItems: [
        {
          description: "Agricultural Products",
          assessableValue: 80000,
          cgst: 0,
          sgst: 0,
          igst: 14400,
          total: 94400,
        },
      ],
    },
  ];

  const expenseData = [
    { description: "Office Rent - November", totalAmount: 50000.0 },
    { description: "Employee Salaries - November", totalAmount: 250000.0 },
    { description: "Electricity Bill", totalAmount: 15000.0 },
    { description: "Internet Bill", totalAmount: 5000.0 },
    { description: "Travel Expenses - Client Visit", totalAmount: 25000.0 },
    { description: "Marketing Campaign - Diwali", totalAmount: 75000.0 },
    { description: "Office Supplies & Stationery", totalAmount: 10000.0 },
    { description: "Software Subscriptions", totalAmount: 20000.0 },
    { description: "Team Lunch & Refreshments", totalAmount: 8000.0 },
  ];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Document Upload</CardTitle>
              <CardDescription>
                Upload your documents to be processed by our AI
              </CardDescription>
            </div>
            {showDataReview && (
              <Button onClick={handleReset} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload More Files
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!showDataReview && (
            <div className={`transition-all duration-500 h-auto`}>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-border"
                } ${
                  processingStatus !== "idle"
                    ? "pointer-events-none opacity-60"
                    : "cursor-pointer"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {processingStatus === "idle" && (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <h4 className="font-medium mb-1">
                      Drag & Drop or Click to Upload
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Supports PDF, images, and Excel files
                    </p>
                    <div className="flex justify-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <FileIcon className="h-3 w-3" /> PDF
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <FileSpreadsheet className="h-3 w-3" /> Excel
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <FileIcon className="h-3 w-3" /> Image
                      </Badge>
                    </div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      multiple
                    />
                  </>
                )}

                {processingStatus === "uploading" && (
                  <div className="py-2">
                    <h4 className="font-medium mb-3">
                      Uploading {uploadedFiles.length} file(s)
                    </h4>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {uploadProgress}% Complete
                    </p>
                    <div className="max-h-32 overflow-y-auto">
                      <ul className="text-sm text-muted-foreground text-left">
                        {uploadedFiles.map((file, index) => (
                          <li key={index} className="truncate">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {processingStatus === "processing" && (
                  <div className="py-2">
                    <h4 className="font-medium mb-2">Processing Document</h4>
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Extracting data...</span>
                    </div>
                  </div>
                )}

                {processingStatus === "error" && (
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
            </div>
          )}

          {showDataReview && (
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="purchase">Purchase</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
              </TabsList>
              <TabsContent value="sales">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>GSTIN</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((invoice, index) => (
                      <Collapsible
                        asChild
                        key={index}
                        open={openSalesRows[invoice.invoiceNumber]}
                        onOpenChange={() =>
                          toggleSalesRow(invoice.invoiceNumber)
                        }
                      >
                        <>
                          <TableRow>
                            <TableCell>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  {openSalesRows[invoice.invoiceNumber] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                            <TableCell>
                              <Input defaultValue={invoice.invoiceNumber} />
                            </TableCell>
                            <TableCell>
                              <Input defaultValue={invoice.customer} />
                            </TableCell>
                            <TableCell>
                              <Input
                                defaultValue={invoice.gstin}
                                className="w-40"
                              />
                            </TableCell>
                            <TableCell>
                              <SimpleDatePicker
                                date={salesDates[invoice.invoiceNumber] || new Date(invoice.date)}
                                setDate={(date) => setSalesDates(prev => ({
                                  ...prev,
                                  [invoice.invoiceNumber]: date
                                }))}
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                defaultValue={invoice.amount}
                              />
                            </TableCell>
                            <TableCell>
                              <Input defaultValue={invoice.status} />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <Save className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          <CollapsibleContent asChild>
                            <TableRow>
                              <TableCell colSpan={8}>
                                <div className="p-4 bg-background border rounded-md">
                                  <h5 className="font-bold mb-2">Line Items</h5>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Assessable Value</TableHead>
                                        <TableHead>CGST</TableHead>
                                        <TableHead>SGST</TableHead>
                                        <TableHead>IGST</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {invoice.lineItems.map(
                                        (item, itemIndex) => (
                                          <TableRow key={itemIndex}>
                                            <TableCell>
                                              <Input
                                                defaultValue={item.description}
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={
                                                  item.assessableValue
                                                }
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={item.cgst}
                                                disabled={item.igst > 0}
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={item.sgst}
                                                disabled={item.igst > 0}
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={item.igst}
                                                disabled={
                                                  item.cgst > 0 || item.sgst > 0
                                                }
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={item.total}
                                              />
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="purchase">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>GSTIN</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseData.map((invoice, index) => (
                      <Collapsible
                        asChild
                        key={index}
                        open={openPurchaseRows[invoice.invoiceNumber]}
                        onOpenChange={() =>
                          togglePurchaseRow(invoice.invoiceNumber)
                        }
                      >
                        <>
                          <TableRow>
                            <TableCell>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  {openPurchaseRows[invoice.invoiceNumber] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                            <TableCell>
                              <Input defaultValue={invoice.invoiceNumber} />
                            </TableCell>
                            <TableCell>
                              <Input defaultValue={invoice.vendor} />
                            </TableCell>
                            <TableCell>
                              <Input
                                defaultValue={invoice.gstin}
                                className="w-40"
                              />
                            </TableCell>
                            <TableCell>
                              <SimpleDatePicker
                                date={purchaseDates[invoice.invoiceNumber] || new Date(invoice.date)}
                                setDate={(date) => setPurchaseDates(prev => ({
                                  ...prev,
                                  [invoice.invoiceNumber]: date
                                }))}
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                defaultValue={invoice.amount}
                              />
                            </TableCell>
                            <TableCell>
                              <Input defaultValue={invoice.status} />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <Save className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          <CollapsibleContent asChild>
                            <TableRow>
                              <TableCell colSpan={8}>
                                <div className="p-4 bg-background border rounded-md">
                                  <h5 className="font-bold mb-2">Line Items</h5>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Assessable Value</TableHead>
                                        <TableHead>CGST</TableHead>
                                        <TableHead>SGST</TableHead>
                                        <TableHead>IGST</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {invoice.lineItems.map(
                                        (item, itemIndex) => (
                                          <TableRow key={itemIndex}>
                                            <TableCell>
                                              <Input
                                                defaultValue={item.description}
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={
                                                  item.assessableValue
                                                }
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={item.cgst}
                                                disabled={item.igst > 0}
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={item.sgst}
                                                disabled={item.igst > 0}
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={item.igst}
                                                disabled={
                                                  item.cgst > 0 || item.sgst > 0
                                                }
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="number"
                                                defaultValue={item.total}
                                              />
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="expense">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseData.map((expense, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input defaultValue={expense.description} />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            defaultValue={expense.totalAmount}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Save className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
