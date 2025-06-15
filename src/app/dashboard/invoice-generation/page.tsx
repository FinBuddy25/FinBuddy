"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { EditableInvoicePreview, InvoiceFormValues } from "@/components/invoice/editable-invoice-preview"
import { calculateInvoiceTotals } from "@/lib/utils/invoice"
import { MagicCard } from "@/components/ui/magic-card"
import { RetroGrid } from "@/components/ui/retro-grid"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Wrapper component with Suspense for useSearchParams
function InvoiceGenerationPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  // State to track form submission status - passed to EditableInvoicePreview
  // to disable buttons during submission
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get parameters from URL
  const invoiceId = searchParams.get("id") || undefined
  const invoiceType = (searchParams.get("type") as 'sales' | 'purchase') || 'sales'
  const returnTo = searchParams.get("returnTo") || "dashboard"
  const isConverting = searchParams.get("convert") === "true"
  const sourceInvoiceNumber = searchParams.get("source") || undefined

  // Redirect if type parameter is not provided
  useEffect(() => {
    // Check if we're on the client side and if the type parameter is missing
    if (typeof window !== 'undefined' && !searchParams.has("type")) {
      // Construct the new URL with the default type parameter
      const currentPath = window.location.pathname
      const currentSearch = new URLSearchParams(window.location.search)
      currentSearch.set("type", "sales")

      // Redirect to the same page with the type parameter added
      router.replace(`${currentPath}?${currentSearch.toString()}`)
    }
  }, [searchParams, router])

  // Handle save
  const handleSave = async (data: InvoiceFormValues) => {
    setIsSubmitting(true)
    try {
      // Extract items from the form data (we'll use them separately)
      const { ...invoiceData } = data

      // Calculate total invoice value from items
      const { totalValue } = calculateInvoiceTotals(data.items);

      // Add invoice_type and total_invoice_value to the data
      const formattedData = {
        ...invoiceData,
        invoice_type: invoiceType,
        document_date: data.document_date.toISOString().split('T')[0],
        total_invoice_value: totalValue
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("You must be logged in to save invoices")
      }

      // Add user_id to the data
      const invoiceDataWithUser = {
        ...formattedData,
        user_id: user.id
      }

      if (invoiceId) {
        // Update existing invoice
        const { error: updateError } = await supabase
          .from("invoices")
          .update(invoiceDataWithUser)
          .eq("id", invoiceId)
          .select()

        if (updateError) {
          // Check if this is a duplicate invoice number error
          if (updateError.message.includes("duplicate key value") &&
              updateError.message.includes("invoices_invoice_number_key")) {
            throw new Error("Invoice number already exists. Please use a different invoice number.")
          } else {
            throw new Error(`Invoice update error: ${updateError.message}`)
          }
        }

        // Delete existing invoice items
        const { error: deleteItemsError } = await supabase
          .from("invoice_items")
          .delete()
          .eq("invoice_id", invoiceId)

        if (deleteItemsError) {
          throw new Error(`Error deleting existing invoice items: ${deleteItemsError.message}`)
        }

        // Create new invoice items
        const itemsWithInvoiceId = data.items.map((item) => ({
          invoice_id: invoiceId,
          ...item
        }))

        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(itemsWithInvoiceId)

        if (itemsError) {
          throw new Error(`Invoice items insertion error: ${itemsError.message}`)
        }

        toast.success("Invoice updated successfully!")
      } else {
        // Create new invoice
        const { data: invoice, error: invoiceError } = await supabase
          .from("invoices")
          .insert(invoiceDataWithUser)
          .select()

        if (invoiceError) {
          // Check if this is a duplicate invoice number error
          if (invoiceError.message.includes("duplicate key value") &&
              invoiceError.message.includes("invoices_invoice_number_key")) {
            throw new Error("Invoice number already exists. Please use a different invoice number.")
          } else {
            throw new Error(`Invoice creation error: ${invoiceError.message}`)
          }
        }

        if (invoice && invoice.length > 0) {
          const newInvoiceId = invoice[0].id

          // Insert invoice items
          const itemsWithInvoiceId = data.items.map((item) => ({
            invoice_id: newInvoiceId,
            ...item
          }))

          const { error: itemsError } = await supabase
            .from("invoice_items")
            .insert(itemsWithInvoiceId)

          if (itemsError) {
            throw new Error(`Invoice items insertion error: ${itemsError.message}`)
          }
        } else {
          throw new Error("Failed to create invoice: No invoice data returned")
        }

        toast.success("Invoice created successfully!")
      }

      // Redirect based on returnTo parameter
      if (returnTo === 'tax-invoices') {
        router.push("/dashboard/tax-invoices")
      } else if (returnTo === 'performa-invoices') {
        router.push("/dashboard/performa-invoices")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please try again."
      toast.error(`Failed to process invoice: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (returnTo === 'tax-invoices') {
      router.push("/dashboard/tax-invoices")
    } else if (returnTo === 'performa-invoices') {
      router.push("/dashboard/performa-invoices")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="container mx-auto py-4 relative">
      <RetroGrid className="absolute inset-0 opacity-10" />

      <div className="relative z-10">
        <MagicCard className="w-full overflow-hidden rounded-xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold">
                  {isConverting
                    ? invoiceType === 'sales' ? "Tax Invoice" : "Purchase Order"
                    : invoiceId ? "Edit Invoice" : "Invoice Generation"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isConverting
                    ? `Convert ${sourceInvoiceNumber} to ${invoiceType === 'sales' ? 'Tax Invoice' : 'Purchase Order'}`
                    : invoiceId
                      ? "Edit an existing invoice with all required details"
                      : "Generate a new invoice with all required details"}
                </p>
              </div>
            </div>

            <EditableInvoicePreview
              invoiceId={invoiceId}
              invoiceType={invoiceType}
              onSave={handleSave}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              isConverting={isConverting}
              sourceInvoiceNumber={sourceInvoiceNumber}
            />
          </div>
        </MagicCard>
      </div>
    </div>
  )
}

// Export the page component with Suspense boundary
export default function InvoiceGenerationPage() {
  // Get the invoice type from URL parameters to use as a key
  const searchParams = useSearchParams()
  const invoiceType = (searchParams.get("type") as 'sales' | 'purchase') || 'sales'

  return (
    <Suspense fallback={
      <Card>
        <CardHeader className="py-1.5">
          <Skeleton className="h-6 w-1/3 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4 py-1.5">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    }>
      {/* Add key prop to force remount when invoice type changes */}
      <InvoiceGenerationPageContent key={invoiceType} />
    </Suspense>
  )
}
