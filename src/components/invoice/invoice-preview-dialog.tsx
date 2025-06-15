"use client"

import { useState, useRef, useEffect } from "react"
import { jsPDF } from "jspdf"
import { Printer, FileDown, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { InvoicePreview, type Invoice, type InvoiceItem } from "./invoice-preview"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

type InvoicePreviewDialogProps = {
  invoiceId: string
  trigger: React.ReactNode
  title?: string
}

export function InvoicePreviewDialog({
  invoiceId,
  trigger,
  title = "Invoice Preview",
}: InvoicePreviewDialogProps) {
  const [open, setOpen] = useState(false)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch invoice data when dialog opens
  useEffect(() => {
    if (open && invoiceId) {
      // Define fetchInvoiceData inside useEffect to avoid dependency issues
      const fetchInvoiceData = async () => {
        setIsLoading(true)
        try {
          // Fetch invoice data
          const { data: invoiceData, error: invoiceError } = await supabase
            .from("invoices")
            .select("*")
            .eq("id", invoiceId)
            .single()

          if (invoiceError) {
            console.error("Error fetching invoice:", invoiceError)
            toast.error("Failed to load invoice data")
            return
          }

          if (!invoiceData) {
            console.error("No invoice found with ID:", invoiceId)
            toast.error("Invoice not found")
            return
          }

          // Fetch invoice items
          const { data: itemsData, error: itemsError } = await supabase
            .from("invoice_items")
            .select("*")
            .eq("invoice_id", invoiceId)

          if (itemsError) {
            console.error("Error fetching invoice items:", itemsError)
            toast.error("Failed to load invoice items")
            return
          }

          setInvoice(invoiceData)
          setItems(itemsData || [])
        } catch (error) {
          console.error("Error in fetchInvoiceData:", error)
          toast.error("Failed to load data")
        } finally {
          setIsLoading(false)
        }
      }

      fetchInvoiceData()
    }
  }, [open, invoiceId, supabase])

  const handlePrint = () => {
    // Add a style element to ensure background colors are printed
    const styleElement = document.createElement('style')
    styleElement.textContent = `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          background-color: white !important;
        }
        .dialog-content {
          display: none !important;
        }
        #print-section {
          display: block !important;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `
    document.head.appendChild(styleElement)

    // Create a print-only version of the invoice
    const printSection = document.createElement('div')
    printSection.id = 'print-section'
    printSection.style.display = 'none'

    if (previewRef.current) {
      printSection.appendChild(previewRef.current.cloneNode(true))
      document.body.appendChild(printSection)
    }

    // Print the document
    window.print()

    // Clean up
    document.head.removeChild(styleElement)
    if (document.getElementById('print-section')) {
      document.body.removeChild(document.getElementById('print-section')!)
    }
  }

  const handleDownloadPDF = () => {
    if (!invoice) return

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Use the HTML content to generate PDF
      if (previewRef.current) {
        // Clone the preview element to avoid modifying the displayed one
        const element = previewRef.current.cloneNode(true) as HTMLElement

        // Apply print-specific styles
        element.style.width = "210mm" // A4 width
        element.style.padding = "10mm"
        element.style.fontSize = "10pt"

        // Ensure background colors are included in the PDF
        const styleElement = document.createElement('style')
        styleElement.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        `
        element.appendChild(styleElement)

        // Convert to PDF
        doc.html(element, {
          callback: function (pdf) {
            // Save the PDF
            pdf.save(`Invoice-${invoice.invoice_number}.pdf`)
          },
          x: 0,
          y: 0,
          html2canvas: {
            scale: 0.26, // Adjust scale as needed
            backgroundColor: '#ffffff', // White background for black and white theme
            useCORS: true,
            logging: false,
          },
        })
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto dialog-content">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-1"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="flex items-center gap-1"
              >
                <FileDown className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
          <DialogDescription>
            Preview and print your invoice or download as PDF
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : invoice ? (
          <div ref={previewRef}>
            <InvoicePreview invoice={invoice} items={items} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No invoice data found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
