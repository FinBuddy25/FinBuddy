"use client";

import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SimpleDatePicker } from "@/components/ui/simple-date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface InvoiceFiltersState {
  searchQuery: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  amountMin: string;
  amountMax: string;
  status: string;
  customer: string;
}

interface InvoiceFiltersProps {
  filters: InvoiceFiltersState;
  onFiltersChange: (filters: InvoiceFiltersState) => void;
  customers: { id: string; name: string }[];
  onResetFilters: () => void;
  columnsButton?: React.ReactNode; // Add this prop to include the Columns button
}

export function InvoiceFilters({
  filters,
  onFiltersChange,
  customers,
  onResetFilters,
  columnsButton,
}: InvoiceFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchQuery: e.target.value,
    });
  };

  // Handle date range changes
  const handleDateFromChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateFrom: date,
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateTo: date,
    });
  };

  // Handle amount range changes
  const handleAmountMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      amountMin: e.target.value,
    });
  };

  const handleAmountMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      amountMax: e.target.value,
    });
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value,
    });
  };

  // Handle customer change
  const handleCustomerChange = (value: string) => {
    onFiltersChange({
      ...filters,
      customer: value,
    });
  };

  // Check if any advanced filters are applied
  const hasAdvancedFilters =
    filters.dateFrom ||
    filters.dateTo ||
    (filters.amountMin && filters.amountMin !== "") ||
    (filters.amountMax && filters.amountMax !== "") ||
    (filters.status && filters.status !== "any") ||
    (filters.customer && filters.customer !== "any");

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice number, customer, date, or amount..."
            className="pl-8"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                {isAdvancedOpen ? "Hide Filters" : "Advanced Filters"}
                {hasAdvancedFilters && !isAdvancedOpen && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    !
                  </span>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          {columnsButton}
          {(filters.searchQuery || hasAdvancedFilters) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      <Collapsible open={isAdvancedOpen} className="w-full">
        <CollapsibleContent className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Date range */}
              <div className="space-y-2">
                <Label htmlFor="date-from">Date From</Label>
                <SimpleDatePicker
                  date={filters.dateFrom}
                  setDate={handleDateFromChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">Date To</Label>
                <SimpleDatePicker
                  date={filters.dateTo}
                  setDate={handleDateToChange}
                  className="w-full"
                />
              </div>

              {/* Amount range */}
              <div className="space-y-2">
                <Label htmlFor="amount-min">Min Amount (₹)</Label>
                <Input
                  id="amount-min"
                  type="number"
                  placeholder="0"
                  value={filters.amountMin}
                  onChange={handleAmountMinChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount-max">Max Amount (₹)</Label>
                <Input
                  id="amount-max"
                  type="number"
                  placeholder="Any"
                  value={filters.amountMax}
                  onChange={handleAmountMaxChange}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Any Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer */}
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select
                  value={filters.customer}
                  onValueChange={handleCustomerChange}
                >
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Any Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Customer</SelectItem>
                    {customers
                      .filter(
                        (customer) =>
                          customer.name && customer.name.trim() !== ""
                      )
                      .map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
