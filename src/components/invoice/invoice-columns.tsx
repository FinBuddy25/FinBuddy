"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Pencil, PlayCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency } from "@/lib/utils/invoice"
import { InvoicePreviewDialog } from "@/components/invoice/invoice-preview-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Define the Invoice type based on the database schema
export type Invoice = {
  id: string
  invoice_number: string
  document_date: string
  document_type_code: string
  recipient_name: string
  recipient_gstin: string
  total_value: number
  status?: string
}

interface InvoiceColumnsProps {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPlay?: (id: string, invoiceNumber: string) => void
}

export const getInvoiceColumns = ({ onEdit, onDelete, onPlay }: InvoiceColumnsProps): ColumnDef<Invoice>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "invoice_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("invoice_number")}</div>
    ),
  },
  {
    accessorKey: "document_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      // Format the date
      const date = new Date(row.getValue("document_date"))
      return <div>{date.toLocaleDateString()}</div>
    },
    filterFn: 'dateRange', // Specify the custom filter function to use
  },
  {
    accessorKey: "recipient_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("recipient_name")}</div>,
  },
  {
    accessorKey: "total_value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start" // Add this class for consistent alignment
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_value"))
      // Ensure consistent spacing with other columns
      return <div className="font-medium">{formatCurrency(amount)}</div>
    },
    filterFn: 'amountRange', // Specify the custom filter function to use
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string || "Pending"
      return (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          status === 'Paid'
            ? 'bg-green-100 text-green-800'
            : status === 'Pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {status}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original

      return (
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InvoicePreviewDialog
                  invoiceId={invoice.id}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Preview</span>
                    </Button>
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview Invoice</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {onPlay && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPlay(invoice.id, invoice.invoice_number)}
                    className="h-8 w-8 text-green-500 hover:text-green-600"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span className="sr-only">
                      {window.location.href.includes("type=purchase")
                        ? "Convert to Purchase Order"
                        : "Convert to Tax Invoice"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {window.location.href.includes("type=purchase")
                      ? "Convert to Purchase Order"
                      : "Convert to Tax Invoice"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(invoice.id)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(invoice.id)}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )
    },
  },
]
