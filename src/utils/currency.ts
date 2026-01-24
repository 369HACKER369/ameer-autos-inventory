// Currency formatting utilities for Pakistan Rupees (Rs/₨)

/**
 * Format a number as Pakistani Rupees
 * @param amount - The amount to format
 * @returns Formatted string like "Rs 1,234"
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rs 0';
  }
  
  // Use Pakistani locale formatting
  const formatted = Math.abs(amount).toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return amount < 0 ? `Rs -${formatted}` : `Rs ${formatted}`;
};

/**
 * Format currency with decimals
 * @param amount - The amount to format
 * @returns Formatted string like "Rs 1,234.56"
 */
export const formatCurrencyWithDecimals = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rs 0.00';
  }
  
  const formatted = Math.abs(amount).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return amount < 0 ? `Rs -${formatted}` : `Rs ${formatted}`;
};

/**
 * Format large amounts in short form (Lac, Crore)
 * @param amount - The amount to format
 * @returns Formatted string like "Rs 12.5 Lac" or "Rs 1.2 Cr"
 */
export const formatCurrencyShort = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rs 0';
  }
  
  const absAmount = Math.abs(amount);
  const prefix = amount < 0 ? '-' : '';
  
  // Crore (10 million)
  if (absAmount >= 10000000) {
    return `Rs ${prefix}${(absAmount / 10000000).toFixed(2)} Cr`;
  }
  
  // Lac (100 thousand)
  if (absAmount >= 100000) {
    return `Rs ${prefix}${(absAmount / 100000).toFixed(2)} Lac`;
  }
  
  // Thousand
  if (absAmount >= 1000) {
    return `Rs ${prefix}${(absAmount / 1000).toFixed(1)}K`;
  }
  
  return formatCurrency(amount);
};

/**
 * Parse a currency string back to number
 * @param value - The string to parse (e.g., "Rs 1,234")
 * @returns The numeric value
 */
export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  
  // Remove currency symbol, commas, spaces
  const cleaned = value
    .replace(/Rs\.?/gi, '')
    .replace(/₨/g, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim();
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format input value as currency for display in inputs
 * @param value - The numeric value
 * @returns Formatted string without Rs prefix for input fields
 */
export const formatCurrencyInput = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) {
    return '';
  }
  
  return value.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Calculate profit from buying and selling price
 * @param buyingPrice - The cost price
 * @param sellingPrice - The selling price
 * @param quantity - Number of items (default 1)
 * @returns The profit amount
 */
export const calculateProfit = (
  buyingPrice: number, 
  sellingPrice: number, 
  quantity: number = 1
): number => {
  return (sellingPrice - buyingPrice) * quantity;
};

/**
 * Calculate profit margin percentage
 * @param buyingPrice - The cost price
 * @param sellingPrice - The selling price
 * @returns Profit margin as percentage
 */
export const calculateProfitMargin = (
  buyingPrice: number, 
  sellingPrice: number
): number => {
  if (sellingPrice === 0) return 0;
  return ((sellingPrice - buyingPrice) / sellingPrice) * 100;
};

/**
 * Calculate total value
 * @param quantity - Number of items
 * @param price - Price per item
 * @returns Total value
 */
export const calculateTotal = (quantity: number, price: number): number => {
  return quantity * price;
};
