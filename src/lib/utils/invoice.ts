import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Calculate IGST value based on assessable value and GST rate
 */
export function calculateIGST(assessableValue: number, gstRate: number): number {
  return (assessableValue * gstRate) / 100;
}

/**
 * Calculate CGST value based on assessable value and GST rate
 * CGST is half of the total GST amount
 */
export function calculateCGST(assessableValue: number, gstRate: number): number {
  return (assessableValue * gstRate) / 200;
}

/**
 * Calculate SGST value based on assessable value and GST rate
 * SGST is half of the total GST amount
 */
export function calculateSGST(assessableValue: number, gstRate: number): number {
  return (assessableValue * gstRate) / 200;
}

/**
 * Calculate assessable value based on item price, quantity, and discount
 */
export function calculateAssessableValue(
  itemPrice: number,
  quantity: number = 1,
  discountPercentage: number = 0
): number {
  const totalPrice = itemPrice * quantity;
  const discountAmount = (totalPrice * discountPercentage) / 100;
  return totalPrice - discountAmount;
}

/**
 * Calculate total invoice value including taxes
 */
export function calculateTotalInvoiceValue(
  assessableValue: number,
  igstValue: number = 0,
  cgstValue: number = 0,
  sgstValue: number = 0
): number {
  return assessableValue + igstValue + cgstValue + sgstValue;
}

/**
 * Format currency value to Indian Rupees format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a fallback invoice number with prefix, date, and timestamp
 * This is used as a fallback when database access is not available
 */
export function generateInvoiceNumber(prefix: string = 'INV'): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // Use timestamp instead of random number to reduce chance of collisions
  const timestamp = Math.floor((date.getTime() % 1000000) / 100).toString().padStart(4, '0');

  return `${prefix}-${year}${month}${day}-${timestamp}`;
}

/**
 * Get the next sequential invoice number from the database
 * This ensures unique and ordered invoice numbers
 */
export async function getNextInvoiceNumber(supabaseClient: SupabaseClient, prefix: string = 'INV'): Promise<string> {
  try {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Create the date pattern for today's invoices
    const datePattern = `${prefix}-${year}${month}${day}`;

    // Query the database for invoices with today's date pattern
    const { data, error } = await supabaseClient
      .from('invoices')
      .select('invoice_number')
      .like('invoice_number', `${datePattern}%`)
      .order('invoice_number', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching invoice numbers:', error);
      // Fallback to the timestamp-based method if there's an error
      return generateInvoiceNumber(prefix);
    }

    let sequentialNumber = 1;

    // If we found an invoice with today's date pattern
    if (data && data.length > 0) {
      // Extract the sequential part (after the last dash)
      const lastInvoiceNumber = data[0].invoice_number;
      const parts = lastInvoiceNumber.split('-');
      if (parts.length >= 3) {
        const lastSequential = parseInt(parts[2], 10);
        if (!isNaN(lastSequential)) {
          sequentialNumber = lastSequential + 1;
        }
      }
    }

    // Format the sequential number with leading zeros (3 digits)
    const formattedSequential = sequentialNumber.toString().padStart(3, '0');

    // Return the new invoice number
    return `${datePattern}-${formattedSequential}`;
  } catch {
    // Fallback to the timestamp-based method if there's an exception
    return generateInvoiceNumber(prefix);
  }
}

interface InvoiceItem {
  assessable_value?: number;
  igst_value?: number;
  cgst_value?: number;
  sgst_value?: number;
}

/**
 * Calculate invoice totals from items array
 */
export function calculateInvoiceTotals(items: InvoiceItem[]) {
  const totalAssessableValue = items.reduce((sum, item) => sum + (item.assessable_value || 0), 0);
  const totalIGST = items.reduce((sum, item) => sum + (item.igst_value || 0), 0);
  const totalCGST = items.reduce((sum, item) => sum + (item.cgst_value || 0), 0);
  const totalSGST = items.reduce((sum, item) => sum + (item.sgst_value || 0), 0);
  const totalValue = totalAssessableValue + totalIGST + totalCGST + totalSGST;

  return {
    totalAssessableValue,
    totalIGST,
    totalCGST,
    totalSGST,
    totalValue
  };
}

/**
 * Format date to a readable string
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
