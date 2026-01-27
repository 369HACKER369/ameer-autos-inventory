/**
 * Safe number utilities to prevent NaN propagation
 * All numeric operations should use these helpers
 */

/**
 * Safely convert any value to a number, defaulting to fallback (0) if invalid
 */
export function toSafeNumber(value: unknown, fallback: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  
  const num = Number(value);
  
  if (isNaN(num) || !isFinite(num)) {
    return fallback;
  }
  
  return num;
}

/**
 * Safely convert to integer, defaulting to fallback if invalid
 */
export function toSafeInt(value: unknown, fallback: number = 0): number {
  const num = toSafeNumber(value, fallback);
  return Math.floor(num);
}

/**
 * Safely convert to non-negative number
 */
export function toSafePositive(value: unknown, fallback: number = 0): number {
  const num = toSafeNumber(value, fallback);
  return Math.max(0, num);
}

/**
 * Safely convert to non-negative integer (for quantities)
 */
export function toSafeQuantity(value: unknown, fallback: number = 0): number {
  const num = toSafeNumber(value, fallback);
  return Math.max(0, Math.floor(num));
}

/**
 * Safely add numbers with NaN protection
 */
export function safeAdd(...values: unknown[]): number {
  return values.reduce<number>((sum, val) => sum + toSafeNumber(val, 0), 0);
}

/**
 * Safely multiply two numbers
 */
export function safeMultiply(a: unknown, b: unknown): number {
  return toSafeNumber(a, 0) * toSafeNumber(b, 0);
}

/**
 * Safely divide with protection against division by zero
 */
export function safeDivide(numerator: unknown, denominator: unknown, fallback: number = 0): number {
  const num = toSafeNumber(numerator, 0);
  const denom = toSafeNumber(denominator, 0);
  
  if (denom === 0) {
    return fallback;
  }
  
  const result = num / denom;
  return isNaN(result) || !isFinite(result) ? fallback : result;
}

/**
 * Calculate profit safely
 */
export function calculateProfitSafe(
  buyingPrice: unknown,
  sellingPrice: unknown,
  quantity: unknown = 1
): number {
  const buy = toSafeNumber(buyingPrice, 0);
  const sell = toSafeNumber(sellingPrice, 0);
  const qty = toSafeQuantity(quantity, 1);
  
  return (sell - buy) * qty;
}

/**
 * Calculate total value safely
 */
export function calculateTotalSafe(quantity: unknown, price: unknown): number {
  return safeMultiply(toSafeQuantity(quantity, 0), toSafeNumber(price, 0));
}

/**
 * Validate and sanitize part data before storage
 */
export function sanitizePartData<T extends Record<string, unknown>>(data: T): T {
  return {
    ...data,
    quantity: toSafeQuantity(data.quantity, 0),
    minStockLevel: toSafeQuantity(data.minStockLevel, 0),
    buyingPrice: toSafePositive(data.buyingPrice, 0),
    sellingPrice: toSafePositive(data.sellingPrice, 0),
  };
}

/**
 * Validate and sanitize sale data before storage
 */
export function sanitizeSaleData<T extends Record<string, unknown>>(data: T): T {
  return {
    ...data,
    quantity: toSafeQuantity(data.quantity, 1),
    unitPrice: toSafePositive(data.unitPrice, 0),
    totalAmount: toSafePositive(data.totalAmount, 0),
    buyingPrice: toSafePositive(data.buyingPrice, 0),
    profit: toSafeNumber(data.profit, 0),
  };
}
