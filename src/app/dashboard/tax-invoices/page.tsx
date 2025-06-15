"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateTotalInvoiceValue } from "@/lib/utils/invoice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InvoiceDataTable } from "@/components/invoice/invoice-data-table";
import { getInvoiceColumns } from "@/components/invoice/invoice-columns";
import { Trash2, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the Invoice type
type Invoice = {
  id: string;
  invoice_number: string;
  document_date: string;
  document_type_code: string;
  recipient_name: string;
  recipient_gstin: string;
  total_value: number;
  status?: string;
};

export default function TaxInvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  // Get the invoice type from URL parameters (default to 'sales' if not specified)
  const invoiceType =
    searchParams.get("type") === "purchase" ? "purchase" : "sales";

  // Handle deletion of selected invoices
  const handleDelete = async () => {
    if (selectedInvoices.length === 0) return;

    setIsDeleting(true);
    try {
      // First, delete all invoice items for the selected invoices
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .delete()
        .in("invoice_id", selectedInvoices);

      if (itemsError) {
        throw new Error(
          `Failed to delete invoice items: ${itemsError.message}`
        );
      }

      // Then, delete the invoices
      const { error: invoicesError } = await supabase
        .from("invoices")
        .delete()
        .in("id", selectedInvoices);

      if (invoicesError) {
        throw new Error(`Failed to delete invoices: ${invoicesError.message}`);
      }

      // Remove deleted invoices from the state
      setInvoices(
        invoices.filter((invoice) => !selectedInvoices.includes(invoice.id))
      );
      setSelectedInvoices([]);
      toast.success(
        `Successfully deleted ${selectedInvoices.length} invoice(s)`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete invoices"
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle editing of a selected invoice
  const handleEdit = (id: string) => {
    router.push(
      `/dashboard/invoice-generation?id=${id}&type=${invoiceType}&returnTo=tax-invoices`
    );
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First, let's check what document types are available
        const { data: docTypes, error: docTypesError } = await supabase
          .from("invoices")
          .select("document_type_code")
          .limit(10);

        if (docTypesError) {
          setError("Failed to fetch document types: " + docTypesError.message);
          return;
        }

        // Try to determine the correct document type code for tax invoices
        let documentTypeCode = "tax";

        // Check if there are any document types that might be tax invoices
        if (docTypes && docTypes.length > 0) {
          const possibleTaxTypes = docTypes.filter((item) => {
            const code = item.document_type_code?.toLowerCase() || "";
            return code.includes("tax");
          });

          if (possibleTaxTypes.length > 0) {
            documentTypeCode = possibleTaxTypes[0].document_type_code;
          }
        }

        // Get the current user ID
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("You must be logged in to view invoices");
          setIsLoading(false);
          return;
        }

        // Fetch invoices with the determined document_type_code for the current user
        const { data: invoicesData, error: invoicesError } = await supabase
          .from("invoices")
          .select(
            `
            id,
            invoice_number,
            document_date,
            document_type_code,
            recipient_name,
            recipient_gstin,
            invoice_type
          `
          )
          .eq("document_type_code", documentTypeCode)
          .eq("invoice_type", invoiceType) // Filter by invoice type (sales/purchase)
          .eq("user_id", user.id) // Filter by user ID
          .order("document_date", { ascending: false });

        if (invoicesError) {
          setError("Failed to fetch invoices: " + invoicesError.message);
          return;
        }

        if (!invoicesData || invoicesData.length === 0) {
          setInvoices([]);
          setIsLoading(false);
          return;
        }

        // Fetch invoice items for each invoice
        const invoicesWithTotal = await Promise.all(
          invoicesData.map(async (invoice) => {
            const { data: itemsData, error: itemsError } = await supabase
              .from("invoice_items")
              .select("*")
              .eq("invoice_id", invoice.id);

            if (itemsError) {
              return {
                ...invoice,
                total_value: 0,
                status: "Pending",
              };
            }

            // Calculate total value from invoice items
            const totalValue =
              itemsData && itemsData.length > 0
                ? itemsData.reduce((total, item) => {
                    return (
                      total +
                      calculateTotalInvoiceValue(
                        item.assessable_value || 0,
                        item.igst_value || 0,
                        item.cgst_value || 0,
                        item.sgst_value || 0
                      )
                    );
                  }, 0)
                : 0;

            return {
              ...invoice,
              total_value: totalValue,
              // Add a status field (this is just a placeholder, you might want to fetch the actual status)
              status: "Pending",
            };
          })
        );

        setInvoices(invoicesWithTotal);
      } catch (error) {
        setError(
          "An unexpected error occurred: " +
            (error instanceof Error ? error.message : String(error))
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [supabase, invoiceType]);

  // Extract unique customers for the filter dropdown
  const customers = useMemo(() => {
    const uniqueCustomers = Array.from(
      new Set(invoices.map((invoice) => invoice.recipient_name))
    )
      .filter((name) => name && name.trim() !== "") // Filter out empty or whitespace-only names
      .map((name) => ({
        id: name,
        name: name,
      }));
    return uniqueCustomers;
  }, [invoices]);

  // Handle single invoice deletion
  const handleSingleDelete = (id: string) => {
    setSelectedInvoices([id]);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {invoiceType === "purchase" ? "Purchase Orders" : "Sales Tax Invoices"}
          </CardTitle>
          <CardDescription>
            Manage your {invoiceType === "purchase" ? "purchase orders" : "sales tax invoices"} with search, sort, and filter
            options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 border border-red-300 rounded-md">
              <p>Error: {error}</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-4 text-center">
              <p>No {invoiceType === "purchase" ? "purchase orders" : "tax invoices"} found.</p>
            </div>
          ) : (
            <>
              {/* Action toolbar for bulk actions */}
              {selectedInvoices.length > 0 && (
                <div className="flex items-center justify-between mb-4 p-2 bg-muted/30 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={selectedInvoices.length === 0 || isDeleting}
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(selectedInvoices[0])}
                      disabled={selectedInvoices.length !== 1}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Selected
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{selectedInvoices.length} invoice(s) selected</span>
                  </div>
                </div>
              )}

              {/* Enhanced data table with filtering */}
              <InvoiceDataTable
                columns={getInvoiceColumns({
                  onEdit: handleEdit,
                  onDelete: handleSingleDelete,
                  // Tax invoices don't have the Play button
                })}
                data={invoices}
                customers={customers}
              />

              {/* Delete confirmation dialog */}
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete{" "}
                      {selectedInvoices.length} selected invoice(s). This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      {isDeleting ? (
                        <>
                          <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
