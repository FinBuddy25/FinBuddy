"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  PlusCircle,
  Trash2,
  Save,
  X,
  Loader2
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import {
  calculateIGST,
  calculateCGST,
  calculateSGST,
  calculateAssessableValue,
  formatCurrency,
  getNextInvoiceNumber
} from "@/lib/utils/invoice"

import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SimpleDatePicker } from "@/components/ui/simple-date-picker"
import { Checkbox } from "@/components/ui/checkbox"
// import { Card, CardContent } from "@/components/ui/card"

// Define the invoice item schema
const invoiceItemSchema = z.object({
  item_description: z.string().min(1, "Description is required").max(300, "Description must be at most 300 characters"),
  hsn_code: z.string().length(8, "HSN code must be 8 digits"),
  item_price: z.coerce.number().min(0, "Price must be non-negative"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").default(1),
  discount_percentage: z.coerce.number().min(0).max(100, "Discount percentage must be between 0 and 100").default(0),
  assessable_value: z.coerce.number().min(0, "Assessable value must be non-negative"),
  gst_rate: z.coerce.number().min(0, "GST rate must be non-negative"),
  igst_value: z.coerce.number().min(0).default(0),
  cgst_value: z.coerce.number().min(0).default(0),
  sgst_value: z.coerce.number().min(0).default(0),
});

// Define the invoice schema
const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  document_type_code: z.string().min(1, "Document type is required"),
  document_date: z.date(),
  preceding_invoice_reference: z.string().max(16, "Reference must be at most 16 characters").optional().or(z.literal('')),
  supplier_name: z.string().max(100, "Supplier name must be at most 100 characters").optional(),
  supplier_gstin: z.string().length(15, "GSTIN must be 15 characters").optional(),
  supplier_address: z.string().max(100, "Address must be at most 100 characters").optional(),
  supplier_place: z.string().max(50, "Place must be at most 50 characters").optional(),
  supplier_state_code: z.string().optional(),
  supplier_pincode: z.string().length(6, "Pincode must be 6 digits").optional(),
  recipient_name: z.string().max(100, "Recipient name must be at most 100 characters"),
  recipient_gstin: z.string().length(15, "GSTIN must be 15 characters"),
  recipient_address: z.string().max(100, "Address must be at most 100 characters"),
  recipient_place: z.string().max(50, "Place must be at most 50 characters").optional(),
  recipient_state_code: z.string().min(1, "State code is required"),
  recipient_pincode: z.string().length(6, "Pincode must be 6 digits"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

// Define types based on Zod schemas
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface EditableInvoicePreviewProps {
  invoiceId?: string;
  invoiceType?: 'sales' | 'purchase';
  onSave?: (data: InvoiceFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isConverting?: boolean;
  sourceInvoiceNumber?: string;
}

export function EditableInvoicePreview({
  invoiceId,
  invoiceType = 'sales',
  onSave,
  onCancel,
  isSubmitting = false,
  isConverting = false,
  sourceInvoiceNumber
}: EditableInvoicePreviewProps) {
  // Add invoice type to the title
  const invoiceTypeLabel = invoiceType === 'sales' ? 'Sales Invoice' : 'Purchase Invoice';

  // We'll use the conversion status and source invoice number in the UI
  console.log(`Conversion mode: ${isConverting}, Source: ${sourceInvoiceNumber}`);

  // Display the invoice type in the UI
  useEffect(() => {
    document.title = isConverting
      ? `Convert to ${invoiceType === 'sales' ? 'Tax Invoice' : 'Purchase Order'}`
      : `${invoiceId ? 'Edit' : 'Create'} ${invoiceTypeLabel}`;
  }, [invoiceId, invoiceTypeLabel, isConverting, invoiceType]);
  const [isLoading, setIsLoading] = useState(invoiceId ? true : false);
  const [stateCodes, setStateCodes] = useState<{ state_code: string; state_name: string }[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  // Business profile state - used when auto-populating fields
  const [, setBusinessProfile] = useState<{
    supplier_name: string;
    supplier_gstin: string;
    supplier_address: string;
    supplier_place: string;
    supplier_state_code: string;
    supplier_pincode: string;
    nature_of_business: string;
    industry: string;
    supplier_gstins: string;
  } | null>(null);
  const supabase = createClient();

  // Initialize the form
  const form = useForm<InvoiceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      invoice_number: "",
      // Set document_type_code to "tax" when converting, otherwise "performa"
      document_type_code: isConverting ? "tax" : "performa",
      document_date: new Date(),
      recipient_name: "",
      recipient_gstin: "",
      recipient_address: "",
      recipient_state_code: "",
      recipient_pincode: "",
      recipient_place: "",
      items: [
        {
          item_description: "",
          hsn_code: "",
          item_price: 0,
          assessable_value: 0,
          gst_rate: 0,
          igst_value: 0,
          cgst_value: 0,
          sgst_value: 0,
          discount_percentage: 0,
          quantity: 1
        }
      ]
    }
  });

  // Set up field array for invoice items
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Reference to track if we're in the middle of an update
  const isUpdating = useRef(false);

  // Watch for changes in relevant fields and automatically calculate values
  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      // Skip if we're already in the middle of an update
      if (isUpdating.current) return;

      // Process if the change is related to items or recipient/supplier state code
      if (name && (name.startsWith('items.') || name === 'recipient_state_code' || name === 'supplier_state_code')) {
        isUpdating.current = true;

        try {
          // If it's an item field change
          if (name && name.startsWith('items.')) {
            const parts = name.split('.');
            if (parts.length >= 3) {
              const index = parseInt(parts[1]);
              const field = parts[2];

              // Get current values
              const items = form.getValues('items');
              const item = items[index];
              const supplierStateCode = String(form.getValues('supplier_state_code') || '').trim();
              const recipientStateCode = String(form.getValues('recipient_state_code') || '').trim();

              // Debug state codes
              console.log('GST Calculation - Supplier State Code:', supplierStateCode);
              console.log('GST Calculation - Recipient State Code:', recipientStateCode);

              // Determine if same state (for GST calculation)
              const isSameState = supplierStateCode === recipientStateCode && supplierStateCode !== '';
              console.log('GST Calculation - Is Same State:', isSameState);

              if (item) {
                // If price, quantity, or discount changed, recalculate assessable value
                if (field === 'item_price' || field === 'quantity' || field === 'discount_percentage') {
                  const assessableValue = calculateAssessableValue(
                    item.item_price || 0,
                    item.quantity || 1,
                    item.discount_percentage || 0
                  );

                  form.setValue(`items.${index}.assessable_value`, assessableValue);

                  // Also recalculate GST values based on state comparison
                  if (item.gst_rate) {
                    if (isSameState) {
                      // Same state: Apply CGST and SGST, zero out IGST
                      const cgstValue = calculateCGST(assessableValue, item.gst_rate);
                      const sgstValue = calculateSGST(assessableValue, item.gst_rate);

                      form.setValue(`items.${index}.cgst_value`, cgstValue);
                      form.setValue(`items.${index}.sgst_value`, sgstValue);
                      form.setValue(`items.${index}.igst_value`, 0);
                    } else {
                      // Different states: Apply IGST, zero out CGST and SGST
                      const igstValue = calculateIGST(assessableValue, item.gst_rate);

                      form.setValue(`items.${index}.igst_value`, igstValue);
                      form.setValue(`items.${index}.cgst_value`, 0);
                      form.setValue(`items.${index}.sgst_value`, 0);
                    }
                  }
                }

                // If GST rate changed, recalculate GST values
                if (field === 'gst_rate') {
                  const assessableValue = item.assessable_value || 0;
                  const gstRate = item.gst_rate || 0;

                  if (isSameState) {
                    // Same state: Apply CGST and SGST, zero out IGST
                    const cgstValue = calculateCGST(assessableValue, gstRate);
                    const sgstValue = calculateSGST(assessableValue, gstRate);

                    form.setValue(`items.${index}.cgst_value`, cgstValue);
                    form.setValue(`items.${index}.sgst_value`, sgstValue);
                    form.setValue(`items.${index}.igst_value`, 0);
                  } else {
                    // Different states: Apply IGST, zero out CGST and SGST
                    const igstValue = calculateIGST(assessableValue, gstRate);

                    form.setValue(`items.${index}.igst_value`, igstValue);
                    form.setValue(`items.${index}.cgst_value`, 0);
                    form.setValue(`items.${index}.sgst_value`, 0);
                  }
                }
              }
            }
          }
          // If state code changed, recalculate GST for all items
          else if (name === 'recipient_state_code' || name === 'supplier_state_code') {
            const items = form.getValues('items');
            const supplierStateCode = String(form.getValues('supplier_state_code') || '').trim();
            const recipientStateCode = String(form.getValues('recipient_state_code') || '').trim();

            // Debug state codes
            console.log('GST Calculation - Supplier State Code:', supplierStateCode);
            console.log('GST Calculation - Recipient State Code:', recipientStateCode);

            // Determine if same state (for GST calculation)
            const isSameState = supplierStateCode === recipientStateCode && supplierStateCode !== '';
            console.log('GST Calculation - Is Same State:', isSameState);

            // Recalculate GST for all items
            items.forEach((item, index) => {
              if (item.assessable_value && item.gst_rate) {
                const assessableValue = item.assessable_value;
                const gstRate = item.gst_rate;

                if (isSameState) {
                  // Same state: Apply CGST and SGST, zero out IGST
                  const cgstValue = calculateCGST(assessableValue, gstRate);
                  const sgstValue = calculateSGST(assessableValue, gstRate);

                  form.setValue(`items.${index}.cgst_value`, cgstValue);
                  form.setValue(`items.${index}.sgst_value`, sgstValue);
                  form.setValue(`items.${index}.igst_value`, 0);
                } else {
                  // Different states: Apply IGST, zero out CGST and SGST
                  const igstValue = calculateIGST(assessableValue, gstRate);

                  form.setValue(`items.${index}.igst_value`, igstValue);
                  form.setValue(`items.${index}.cgst_value`, 0);
                  form.setValue(`items.${index}.sgst_value`, 0);
                }
              }
            });
          }
        } finally {
          isUpdating.current = false;
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Add keyboard shortcut for adding new items with Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the key is Enter and the target is an input field in the last row
      if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
        const inputField = e.target;
        const rowElement = inputField.closest('tr');

        // Check if this is the last row
        if (rowElement && rowElement === document.querySelector('.invoice-items-table tbody tr:last-child')) {
          e.preventDefault();

          // Get the last item as a template
          const items = form.getValues('items');
          const lastItem = items[items.length - 1];

          // Create a new item, using some values from the last item
          const newItem = {
            item_description: "",
            hsn_code: lastItem.hsn_code || "",
            item_price: 0,
            assessable_value: 0,
            gst_rate: lastItem.gst_rate || 0,
            igst_value: 0,
            cgst_value: 0,
            sgst_value: 0,
            discount_percentage: lastItem.discount_percentage || 0,
            quantity: 1
          };

          append(newItem);

          // Focus on the description field of the new row after a short delay
          setTimeout(() => {
            const newRow = document.querySelector('.invoice-items-table tbody tr:last-child');
            if (newRow) {
              const descriptionInput = newRow.querySelector('input');
              if (descriptionInput) {
                descriptionInput.focus();
              }
            }
          }, 10);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [append, form]);

  // Load state codes and supplier profile on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch state codes
        const { data: stateCodesData, error: stateCodesError } = await supabase
          .from("state_codes")
          .select("*")
          .order("state_name");

        if (stateCodesError) {
          console.error("Error fetching state codes:", stateCodesError);
          toast.error("Failed to load state codes");
          return;
        }

        setStateCodes(stateCodesData || []);

        // Fetch business profile
        const { data: businessData, error: businessError } = await supabase
          .from('supplier_profiles')
          .select('*')
          .limit(1)
          .single();

        if (businessError && businessError.code !== 'PGRST116') {
          // PGRST116 is the error code for "no rows returned"
          console.error("Error fetching business profile:", businessError);
          toast.error("Failed to load business profile");
        } else if (businessData) {
          setBusinessProfile(businessData);

          // Auto-populate supplier or recipient fields based on invoice type
          if (!invoiceId) { // Only auto-populate for new invoices
            if (invoiceType === 'sales') {
              // For sales invoices, auto-populate supplier details
              form.setValue('supplier_name', businessData.supplier_name || "");
              form.setValue('supplier_gstin', businessData.supplier_gstin || "");
              form.setValue('supplier_address', businessData.supplier_address || "");
              form.setValue('supplier_place', businessData.supplier_place || "");
              form.setValue('supplier_state_code', businessData.supplier_state_code || "");
              form.setValue('supplier_pincode', businessData.supplier_pincode || "");
            } else if (invoiceType === 'purchase') {
              // For purchase invoices, auto-populate recipient details
              form.setValue('recipient_name', businessData.supplier_name || "");
              form.setValue('recipient_gstin', businessData.supplier_gstin || "");
              form.setValue('recipient_address', businessData.supplier_address || "");
              form.setValue('recipient_place', businessData.supplier_place || "");
              form.setValue('recipient_state_code', businessData.supplier_state_code || "");
              form.setValue('recipient_pincode', businessData.supplier_pincode || "");
            }
          }
        }

        // Generate a unique invoice number for new invoices
        if (!invoiceId) {
          // Determine the prefix based on invoice type
          const prefix = invoiceType === 'sales' ? 'INV' : 'PO';

          // Get the next invoice number
          const nextInvoiceNumber = await getNextInvoiceNumber(supabase, prefix);

          // Set the invoice number in the form
          form.setValue('invoice_number', nextInvoiceNumber);
          console.log(`Auto-generated invoice number: ${nextInvoiceNumber}`);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error("Failed to load data");
      }
    }

    fetchData();
  }, [supabase, invoiceType, invoiceId, form]);

  // Auto-populate state code and state name from GSTIN
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Skip if we're already in the middle of an update
      if (isUpdating.current) return;

      // Handle recipient GSTIN change
      if (name === 'recipient_gstin') {
        const gstin = value.recipient_gstin;
        if (gstin && gstin.length >= 2) {
          const stateCode = gstin.substring(0, 2);
          // Only update if the state code is different
          if (stateCode !== value.recipient_state_code) {
            isUpdating.current = true;
            try {
              // Find the state name from the state code
              const stateInfo = stateCodes.find(state => state.state_code === stateCode);

              // Set the state code
              form.setValue('recipient_state_code', stateCode, { shouldValidate: true });

              if (stateInfo) {
                // Set the state name in the form if available
                const stateName = stateInfo.state_name;
                console.log(`Auto-populated recipient state: ${stateName} (${stateCode})`);
                // No toast notification
              } else {
                console.log(`Auto-populated recipient state code: ${stateCode}`);
              }
            } finally {
              isUpdating.current = false;
            }
          }
        }
      }

      // Handle supplier GSTIN change
      if (name === 'supplier_gstin') {
        const gstin = value.supplier_gstin;
        if (gstin && gstin.length >= 2) {
          const stateCode = gstin.substring(0, 2);
          // Only update if the state code is different
          if (stateCode !== value.supplier_state_code) {
            isUpdating.current = true;
            try {
              // Find the state name from the state code
              const stateInfo = stateCodes.find(state => state.state_code === stateCode);

              // Set the state code
              form.setValue('supplier_state_code', stateCode, { shouldValidate: true });

              if (stateInfo) {
                // Set the state name in the form if available
                const stateName = stateInfo.state_name;
                console.log(`Auto-populated supplier state: ${stateName} (${stateCode})`);
                // No toast notification
              } else {
                console.log(`Auto-populated supplier state code: ${stateCode}`);
              }
            } finally {
              isUpdating.current = false;
            }
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, stateCodes]);

  // Load invoice data if editing an existing invoice
  useEffect(() => {
    if (invoiceId) {
      async function fetchInvoiceData() {
        setIsLoading(true);
        try {
          // Fetch invoice data
          const { data: invoiceData, error: invoiceError } = await supabase
            .from("invoices")
            .select("*")
            .eq("id", invoiceId)
            .single();

          if (invoiceError) {
            console.error("Error fetching invoice:", invoiceError);
            toast.error("Failed to load invoice data");
            return;
          }

          // Fetch invoice items
          const { data: itemsData, error: itemsError } = await supabase
            .from("invoice_items")
            .select("*")
            .eq("invoice_id", invoiceId)
            .order("id");

          if (itemsError) {
            console.error("Error fetching invoice items:", itemsError);
            toast.error("Failed to load invoice items");
            return;
          }

          // Prepare form data with null handling for all fields
          const formData = {
            // Handle null values in all invoice fields
            invoice_number: invoiceData.invoice_number || "",
            document_type_code: invoiceData.document_type_code || "performa",
            document_date: invoiceData.document_date ? new Date(invoiceData.document_date) : new Date(),
            preceding_invoice_reference: invoiceData.preceding_invoice_reference || "",
            supplier_name: invoiceData.supplier_name || "",
            supplier_gstin: invoiceData.supplier_gstin || "",
            supplier_address: invoiceData.supplier_address || "",
            supplier_place: invoiceData.supplier_place || "",
            supplier_state_code: invoiceData.supplier_state_code || "",
            supplier_pincode: invoiceData.supplier_pincode || "",
            recipient_name: invoiceData.recipient_name || "",
            recipient_gstin: invoiceData.recipient_gstin || "",
            recipient_address: invoiceData.recipient_address || "",
            recipient_place: invoiceData.recipient_place || "",
            recipient_state_code: invoiceData.recipient_state_code || "",
            recipient_pincode: invoiceData.recipient_pincode || "",
            // Handle item fields
            items: itemsData.map(item => ({
              item_description: item.item_description || "",
              hsn_code: item.hsn_code || "",
              item_price: item.item_price || 0,
              assessable_value: item.assessable_value || 0,
              gst_rate: item.gst_rate || 0,
              igst_value: item.igst_value || 0,
              cgst_value: item.cgst_value || 0,
              sgst_value: item.sgst_value || 0,
              discount_percentage: item.discount_percentage || 0,
              quantity: item.quantity || 1
            }))
          };

          // Reset form with loaded data
          form.reset(formData);
        } catch (error) {
          console.error("Error in fetchInvoiceData:", error);
          toast.error("Failed to load data");
        } finally {
          setIsLoading(false);
        }
      }

      fetchInvoiceData();
    }
  }, [invoiceId, supabase, form]);

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (onSave) {
      onSave(data as InvoiceFormValues);
      return;
    }

    // Default save implementation will be added in a later segment
    console.log("Form data:", data);
    toast.success("Form submitted successfully");
  };

  return (
    <div className="bg-white text-black p-6 max-w-7xl mx-auto rounded-lg border border-gray-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Invoice Header */}
          <div className="mb-8 border-b border-gray-200 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoice_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <SimpleDatePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("document_type_code") === "tax" && (
                <FormField
                  control={form.control}
                  name="preceding_invoice_reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Supplier and Recipient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Supplier Info */}
            <div className="border border-gray-200 p-4 rounded-md">
              <h2 className="font-bold text-lg mb-4">Supplier</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="supplier_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplier_gstin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplier_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="supplier_place"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplier_state_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stateCodes.map((state) => (
                              <SelectItem key={state.state_code} value={state.state_code}>
                                {state.state_name} ({state.state_code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplier_pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Recipient Info */}
            <div className="border border-gray-200 p-4 rounded-md">
              <h2 className="font-bold text-lg mb-4">Recipient</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="recipient_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipient_gstin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipient_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="recipient_place"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipient_state_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stateCodes.map((state) => (
                              <SelectItem key={state.state_code} value={state.state_code}>
                                {state.state_name} ({state.state_code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipient_pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg">Invoice Items</h2>
                <div className="text-sm text-muted-foreground">
                  ({fields.length} {fields.length === 1 ? 'item' : 'items'})
                </div>
                <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                  Press Enter in the last row to add a new item
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Are you sure you want to remove all items? This cannot be undone.")) {
                      // Keep one empty item
                      const emptyItem = {
                        item_description: "",
                        hsn_code: "",
                        item_price: 0,
                        assessable_value: 0,
                        gst_rate: 0,
                        igst_value: 0,
                        cgst_value: 0,
                        sgst_value: 0,
                        discount_percentage: 0,
                        quantity: 1
                      };

                      // Remove all items and add one empty item
                      form.setValue('items', [emptyItem]);
                      toast.success("All items have been removed");
                    }
                  }}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md">
              <table className="w-full border-collapse invoice-items-table">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 text-center w-10">
                      <Checkbox
                        checked={selectedItems.length === fields.length && fields.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // Select all items
                            setSelectedItems(fields.map((_, index) => index));
                          } else {
                            // Deselect all items
                            setSelectedItems([]);
                          }
                        }}
                        aria-label="Select all items"
                      />
                    </th>
                    <th className="border border-gray-200 p-2 text-left">#</th>
                    <th className="border border-gray-200 p-2 text-left">Description</th>
                    <th className="border border-gray-200 p-2 text-left">HSN Code</th>
                    <th className="border border-gray-200 p-2 text-right">Price</th>
                    <th className="border border-gray-200 p-2 text-right">Qty</th>
                    <th className="border border-gray-200 p-2 text-right">Disc %</th>
                    <th className="border border-gray-200 p-2 text-right">Assessable Value</th>
                    <th className="border border-gray-200 p-2 text-right">GST Rate</th>
                    <th className="border border-gray-200 p-2 text-right">IGST</th>
                    <th className="border border-gray-200 p-2 text-right">CGST</th>
                    <th className="border border-gray-200 p-2 text-right">SGST</th>
                    <th className="border border-gray-200 p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-200 p-2 text-center">
                        <Checkbox
                          checked={selectedItems.includes(index)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedItems([...selectedItems, index]);
                            } else {
                              setSelectedItems(selectedItems.filter(i => i !== index));
                            }
                          }}
                          aria-label={`Select item ${index + 1}`}
                        />
                      </td>
                      <td className="border border-gray-200 p-2 text-center">{index + 1}</td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.item_description`}
                          render={({ field }) => (
                            <FormControl>
                              <Input {...field} className="h-8 min-w-[150px]" />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.hsn_code`}
                          render={({ field }) => (
                            <FormControl>
                              <Input {...field} className="h-8 w-24" />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.item_price`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="h-8 w-20 text-right"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="h-8 w-16 text-right"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.discount_percentage`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="h-8 w-16 text-right"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.assessable_value`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="h-8 w-24 text-right"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                readOnly
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.gst_rate`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="h-8 w-16 text-right"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.igst_value`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="h-8 w-20 text-right"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                readOnly
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.cgst_value`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="h-8 w-20 text-right"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                readOnly
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.sgst_value`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="h-8 w-20 text-right"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                readOnly
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="border border-gray-200 p-2 text-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (fields.length <= 1) {
                              toast.error("Cannot remove the last item. At least one item is required.");
                              return;
                            }

                            // Remove item immediately without confirmation
                            remove(index);
                            toast.success("Item removed");
                          }}
                          className="h-8 w-8 p-0"
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Item button and bulk actions */}
            <div className="mt-4 flex justify-between">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    // Get the last item as a template
                    const items = form.getValues('items');
                    const lastItem = items.length > 0 ? items[items.length - 1] : null;

                    // Create a new item, optionally using the last item as a template
                    const newItem = lastItem ? {
                      item_description: "",
                      hsn_code: lastItem.hsn_code || "",
                      item_price: 0,
                      assessable_value: 0,
                      gst_rate: lastItem.gst_rate || 0,
                      igst_value: 0,
                      cgst_value: 0,
                      sgst_value: 0,
                      discount_percentage: lastItem.discount_percentage || 0,
                      quantity: 1
                    } : {
                      item_description: "",
                      hsn_code: "",
                      item_price: 0,
                      assessable_value: 0,
                      gst_rate: 0,
                      igst_value: 0,
                      cgst_value: 0,
                      sgst_value: 0,
                      discount_percentage: 0,
                      quantity: 1
                    };

                    append(newItem);

                    // Focus on the description field of the new row after a short delay
                    setTimeout(() => {
                      const newRow = document.querySelector('.invoice-items-table tbody tr:last-child');
                      if (newRow) {
                        const descriptionInput = newRow.querySelector('input');
                        if (descriptionInput) {
                          descriptionInput.focus();
                        }
                      }
                    }, 10);
                  }}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Item</span>
                </Button>

                {selectedItems.length > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      // Check if we're trying to delete all items
                      if (selectedItems.length >= fields.length) {
                        toast.error("Cannot remove all items. At least one item is required.");
                        return;
                      }

                      // Sort indices in descending order to avoid shifting issues when removing
                      const sortedIndices = [...selectedItems].sort((a, b) => b - a);

                      // Remove selected items
                      sortedIndices.forEach(index => {
                        remove(index);
                      });

                      // Clear selection
                      setSelectedItems([]);
                      toast.success(`${selectedItems.length} item(s) removed`);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Selected ({selectedItems.length})</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Summary - Moved to right side */}
          <div className="mb-8 flex justify-end">
            <div className="w-64 border border-gray-200 p-4 rounded-md">
              <h2 className="font-bold text-lg mb-4">Invoice Summary</h2>
              <div className="space-y-2">
                {/* Use state to ensure summary updates when form changes */}
                {(() => {
                  // Force re-render when form values change
                  form.watch(); // This triggers re-render when form values change

                  const items = form.getValues('items') || [];
                  const totalAssessableValue = items.reduce((sum, item) => sum + (item.assessable_value || 0), 0);
                  const totalIGST = items.reduce((sum, item) => sum + (item.igst_value || 0), 0);
                  const totalCGST = items.reduce((sum, item) => sum + (item.cgst_value || 0), 0);
                  const totalSGST = items.reduce((sum, item) => sum + (item.sgst_value || 0), 0);
                  const totalValue = totalAssessableValue + totalIGST + totalCGST + totalSGST;

                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Assessable Value:</span>
                        <span>{formatCurrency(totalAssessableValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total IGST:</span>
                        <span>{formatCurrency(totalIGST)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total CGST:</span>
                        <span>{formatCurrency(totalCGST)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total SGST:</span>
                        <span>{formatCurrency(totalSGST)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                        <span>Grand Total:</span>
                        <span>{formatCurrency(totalValue)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            )}
            {/* Only show the Quotation button if not in conversion mode */}
            {!isConverting && (
              <ShimmerButton
                type="button"
                disabled={isLoading || isSubmitting}
                className="px-6 py-2 font-medium"
                shimmerColor="rgba(255, 255, 255, 0.2)"
                background="var(--primary)"
                borderRadius="0.375rem"
                onClick={() => {
                  form.setValue('document_type_code', 'performa');
                  form.handleSubmit(onSubmit)();
                }}
              >
                {isLoading || isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span>
                      {invoiceType === 'purchase'
                        ? 'Purchase Order (Quotation)'
                        : 'Generate Quotation Invoice'}
                    </span>
                  </>
                )}
              </ShimmerButton>
            )}
            <ShimmerButton
              type="button"
              disabled={isLoading || isSubmitting}
              className="px-6 py-2 font-medium"
              shimmerColor="rgba(255, 255, 255, 0.2)"
              background="var(--primary)"
              borderRadius="0.375rem"
              onClick={() => {
                form.setValue('document_type_code', 'tax');
                form.handleSubmit(onSubmit)();
              }}
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  <span>
                    {invoiceType === 'purchase'
                      ? isConverting ? 'Save as Purchase Order' : 'Purchase Order'
                      : isConverting ? 'Save as Tax Invoice' : 'Generate Tax Invoice'}
                  </span>
                </>
              )}
            </ShimmerButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
