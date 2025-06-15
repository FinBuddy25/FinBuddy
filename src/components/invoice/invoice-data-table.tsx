"use client"

import { useState, useEffect } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  FilterFn,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InvoiceFilters, InvoiceFiltersState } from "./invoice-filters"

// Custom filter function for date ranges
const dateRangeFilterFn = <T,>(row: Row<T>, columnId: string, value: unknown): boolean => {
  const { dateFrom, dateTo } = value as { dateFrom?: Date; dateTo?: Date }
  const cellValue = row.getValue(columnId) as string
  const cellDate = new Date(cellValue)

  // If no dates are specified, include all rows
  if (!dateFrom && !dateTo) return true

  // Check if date is within range
  if (dateFrom && dateTo) {
    return cellDate >= dateFrom && cellDate <= dateTo
  }

  // Check if date is after dateFrom
  if (dateFrom && !dateTo) {
    return cellDate >= dateFrom
  }

  // Check if date is before dateTo
  if (!dateFrom && dateTo) {
    return cellDate <= dateTo
  }

  return true
}

// Custom filter function for amount ranges
const amountRangeFilterFn = <T,>(row: Row<T>, columnId: string, value: unknown): boolean => {
  const { amountMin, amountMax } = value as { amountMin?: string; amountMax?: string }
  const cellValue = row.getValue(columnId) as number

  // If no amounts are specified, include all rows
  if (!amountMin && !amountMax) return true

  const min = amountMin ? parseFloat(amountMin) : 0
  const max = amountMax ? parseFloat(amountMax) : Infinity

  return cellValue >= min && cellValue <= max
}

// Global search filter function
const globalFilterFn = <T,>(row: Row<T>, columnId: string, value: unknown): boolean => {
  const searchValue = String(value).toLowerCase()
  const cellValue = row.getValue(columnId)

  // Handle different data types
  if (typeof cellValue === 'string') {
    return cellValue.toLowerCase().includes(searchValue)
  }

  if (typeof cellValue === 'number') {
    return cellValue.toString().includes(searchValue)
  }

  if (cellValue instanceof Date) {
    return cellValue.toLocaleDateString().toLowerCase().includes(searchValue)
  }

  return false
}

interface InvoiceDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  customers: { id: string; name: string }[]
}

export function InvoiceDataTable<TData, TValue>({
  columns,
  data,
  customers,
}: InvoiceDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  // Advanced filters state
  const [filters, setFilters] = useState<InvoiceFiltersState>({
    searchQuery: "",
    dateFrom: undefined,
    dateTo: undefined,
    amountMin: "",
    amountMax: "",
    status: "any",
    customer: "any",
  })

  // Update global filter when search query changes
  useEffect(() => {
    setGlobalFilter(filters.searchQuery)

    // Apply column-specific filters
    const newColumnFilters: ColumnFiltersState = []

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      newColumnFilters.push({
        id: "document_date",
        value: { dateFrom: filters.dateFrom, dateTo: filters.dateTo }
      })
    }

    // Amount range filter
    if (filters.amountMin || filters.amountMax) {
      newColumnFilters.push({
        id: "total_value",
        value: { amountMin: filters.amountMin, amountMax: filters.amountMax }
      })
    }

    // Status filter
    if (filters.status && filters.status !== "any") {
      newColumnFilters.push({
        id: "status",
        value: filters.status,
      })
    }

    // Customer filter
    if (filters.customer && filters.customer !== "any") {
      newColumnFilters.push({
        id: "recipient_name",
        value: filters.customer,
      })
    }

    setColumnFilters(newColumnFilters)
  }, [filters])

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      dateFrom: undefined,
      dateTo: undefined,
      amountMin: "",
      amountMax: "",
      status: "any",
      customer: "any",
    })
  }

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      dateRange: dateRangeFilterFn as unknown as FilterFn<TData>,
      amountRange: amountRangeFilterFn as unknown as FilterFn<TData>,
      global: globalFilterFn as unknown as FilterFn<TData>,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: globalFilterFn as unknown as FilterFn<TData>,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  // Create a mapping of column IDs to more descriptive names
  const columnNames: Record<string, string> = {
    select: "Select",
    invoice_number: "Invoice Number",
    document_date: "Date",
    recipient_name: "Customer",
    total_value: "Amount",
    status: "Status",
    actions: "Actions"
  };

  // Create the columns button component
  const columnsButton = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) =>
                  column.toggleVisibility(!!value)
                }
              >
                {columnNames[column.id] || column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-4">
      {/* Filters with columns button */}
      <InvoiceFilters
        filters={filters}
        onFiltersChange={setFilters}
        customers={customers}
        onResetFilters={handleResetFilters}
        columnsButton={columnsButton}
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
