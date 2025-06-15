"use client"

import { useState } from "react"
import { EditableInvoicePreview, InvoiceFormValues } from "@/components/invoice/editable-invoice-preview"
import { toast } from "sonner"

export default function TestPage() {
  const [formData, setFormData] = useState<InvoiceFormValues | null>(null)

  const handleSave = (data: InvoiceFormValues) => {
    setFormData(data)
    toast.success("Form data saved to state")
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Test Invoice Generation Preview</h1>
      
      <EditableInvoicePreview 
        onSave={handleSave}
        onCancel={() => toast.info("Cancelled")}
      />

      {formData && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h2 className="text-xl font-bold mb-2">Form Data (JSON):</h2>
          <pre className="whitespace-pre-wrap overflow-auto max-h-96">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
