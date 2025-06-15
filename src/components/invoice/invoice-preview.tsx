"use client"

import { useRef } from "react"
import { formatCurrency } from "@/lib/utils/invoice"

export interface InvoiceItem {
  item_description: string;
  hsn_code: string;
  item_price: number;
  assessable_value: number;
  gst_rate: number;
  igst_value: number;
  cgst_value: number;
  sgst_value: number;
  discount_percentage: number;
  quantity: number;
}

export interface Invoice {
  id?: string;
  invoice_number: string;
  document_type_code: string;
  document_date: string;
  preceding_invoice_reference?: string;
  supplier_name?: string;
  supplier_gstin?: string;
  supplier_address?: string;
  supplier_place?: string;
  supplier_state_code?: string;
  supplier_pincode?: string;
  recipient_name: string;
  recipient_gstin: string;
  recipient_address: string;
  recipient_place?: string;
  recipient_state_code: string;
  recipient_pincode: string;
}

type InvoicePreviewProps = {
  invoice: Invoice;
  items: InvoiceItem[];
}

export function InvoicePreview({ invoice, items }: InvoicePreviewProps) {
  const printRef = useRef<HTMLDivElement>(null)

  // Calculate totals
  const totalAssessableValue = items.reduce((sum, item) => sum + (item.assessable_value || 0), 0)
  const totalIGST = items.reduce((sum, item) => sum + (item.igst_value || 0), 0)
  const totalCGST = items.reduce((sum, item) => sum + (item.cgst_value || 0), 0)
  const totalSGST = items.reduce((sum, item) => sum + (item.sgst_value || 0), 0)
  const totalValue = totalAssessableValue + totalIGST + totalCGST + totalSGST

  return (
    <div ref={printRef} className="bg-white text-black p-6 max-w-4xl mx-auto rounded-lg border border-gray-200">
      {/* Invoice Header */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {invoice.document_type_code === "performa"
                ? (window.location.href.includes("type=purchase") ? "Purchase Order (Quotation)" : "Quotation")
                : (window.location.href.includes("type=purchase") ? "Purchase Order" : "Tax Invoice")}
            </h1>
            <p>Invoice #: {invoice.invoice_number}</p>
            <p>Date: {new Date(invoice.document_date).toLocaleDateString()}</p>
            {invoice.preceding_invoice_reference && (
              <p>Reference: {invoice.preceding_invoice_reference}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">{invoice.supplier_name || "Abcd"}</h2>
            <p>GSTIN: {invoice.supplier_gstin || "12345678901234Z"}</p>
          </div>
        </div>
      </div>

      {/* Supplier and Recipient Info */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Supplier Info */}
        <div className="border border-gray-200 p-4 rounded-md">
          <h2 className="font-bold text-lg mb-2">Supplier</h2>
          <p>{invoice.supplier_name || "Abcd"}</p>
          <p>GSTIN: {invoice.supplier_gstin || "12345678901234Z"}</p>
          {invoice.supplier_address && <p>{invoice.supplier_address}</p>}
          {invoice.supplier_place && invoice.supplier_state_code && invoice.supplier_pincode && (
            <p>{invoice.supplier_place}, {invoice.supplier_state_code} - {invoice.supplier_pincode}</p>
          )}
          {!invoice.supplier_address && <p>Test Address</p>}
          {!invoice.supplier_place && <p>Test Place, 36 - 500000</p>}
        </div>

        {/* Recipient Info */}
        <div className="border border-gray-200 p-4 rounded-md">
          <h2 className="font-bold text-lg mb-2">Recipient</h2>
          <p>{invoice.recipient_name || ""}</p>
          <p>GSTIN: {invoice.recipient_gstin || "37AAECR4087R1Z1"}</p>
          {invoice.recipient_address && <p>{invoice.recipient_address}</p>}
          {invoice.recipient_place && invoice.recipient_state_code && invoice.recipient_pincode && (
            <p>{invoice.recipient_place}, {invoice.recipient_state_code} - {invoice.recipient_pincode}</p>
          )}
          {!invoice.recipient_place && <p>, 30 - 500088</p>}
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-left">Description</th>
              <th className="border border-gray-200 p-2 text-left">HSN Code</th>
              <th className="border border-gray-200 p-2 text-right">Price</th>
              <th className="border border-gray-200 p-2 text-right">Discount %</th>
              <th className="border border-gray-200 p-2 text-right">Assessable Value</th>
              <th className="border border-gray-200 p-2 text-right">GST Rate</th>
              <th className="border border-gray-200 p-2 text-right">IGST</th>
              <th className="border border-gray-200 p-2 text-right">CGST</th>
              <th className="border border-gray-200 p-2 text-right">SGST</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-200 p-2">{item.item_description}</td>
                  <td className="border border-gray-200 p-2">{item.hsn_code}</td>
                  <td className="border border-gray-200 p-2 text-right">{formatCurrency(item.item_price || 0)}</td>
                  <td className="border border-gray-200 p-2 text-right">{item.discount_percentage || 0}%</td>
                  <td className="border border-gray-200 p-2 text-right">{formatCurrency(item.assessable_value || 0)}</td>
                  <td className="border border-gray-200 p-2 text-right">{item.gst_rate || 0}%</td>
                  <td className="border border-gray-200 p-2 text-right">{formatCurrency(item.igst_value || 0)}</td>
                  <td className="border border-gray-200 p-2 text-right">{formatCurrency(item.cgst_value || 0)}</td>
                  <td className="border border-gray-200 p-2 text-right">{formatCurrency(item.sgst_value || 0)}</td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td className="border border-gray-200 p-2">cabbage</td>
                <td className="border border-gray-200 p-2">07040901</td>
                <td className="border border-gray-200 p-2 text-right">₹0.00</td>
                <td className="border border-gray-200 p-2 text-right">0%</td>
                <td className="border border-gray-200 p-2 text-right">₹0.00</td>
                <td className="border border-gray-200 p-2 text-right">0%</td>
                <td className="border border-gray-200 p-2 text-right">₹0.00</td>
                <td className="border border-gray-200 p-2 text-right">₹0.00</td>
                <td className="border border-gray-200 p-2 text-right">₹0.00</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Summary */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between mb-2">
            <span>Total Assessable Value:</span>
            <span>{formatCurrency(totalAssessableValue)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total IGST:</span>
            <span>{formatCurrency(totalIGST)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total CGST:</span>
            <span>{formatCurrency(totalCGST)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total SGST:</span>
            <span>{formatCurrency(totalSGST)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
            <span>Grand Total:</span>
            <span>{formatCurrency(totalValue)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8 pt-4 border-t border-gray-200">
        <p>This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </div>
  )
}
