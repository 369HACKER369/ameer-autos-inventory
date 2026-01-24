import { db } from '@/db/database';
import type { Sale, SaleFormData, Part, DateRange } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { logActivity } from './activityLogService';
import { updateStock } from './inventoryService';

/**
 * Record a new sale
 */
export async function recordSale(data: SaleFormData): Promise<Sale | { error: string }> {
  // Get the part
  const part = await db.parts.get(data.partId);
  if (!part) {
    return { error: 'Part not found' };
  }
  
  // Check stock availability
  if (part.quantity < data.quantity) {
    return { error: `Insufficient stock. Available: ${part.quantity}` };
  }
  
  // Calculate amounts
  const totalAmount = data.quantity * data.unitPrice;
  const profit = (data.unitPrice - part.buyingPrice) * data.quantity;
  
  // Create sale record
  const sale: Sale = {
    id: uuidv4(),
    partId: data.partId,
    partName: part.name,
    partSku: part.sku,
    quantity: data.quantity,
    unitPrice: data.unitPrice,
    totalAmount,
    buyingPrice: part.buyingPrice,
    profit,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    notes: data.notes,
    createdAt: new Date(),
  };
  
  // Use transaction to ensure atomicity
  await db.transaction('rw', [db.sales, db.parts, db.activityLogs], async () => {
    // Add sale record
    await db.sales.add(sale);
    
    // Deduct stock
    await updateStock(part.id, -data.quantity, 'Sale');
  });
  
  await logActivity({
    action: 'sale',
    entityType: 'sale',
    entityId: sale.id,
    description: `Sold ${data.quantity}x ${part.name} (SKU: ${part.sku}) for Rs ${totalAmount.toLocaleString()}`,
    metadata: {
      partId: part.id,
      quantity: data.quantity,
      amount: totalAmount,
      profit,
      previousStock: part.quantity,
      newStock: part.quantity - data.quantity,
    },
  });
  
  return sale;
}

/**
 * Get all sales with optional date filtering
 */
export async function getAllSales(dateRange?: DateRange): Promise<Sale[]> {
  let sales = await db.sales.orderBy('createdAt').reverse().toArray();
  
  if (dateRange) {
    sales = sales.filter(s => {
      const saleDate = new Date(s.createdAt);
      return saleDate >= dateRange.startDate && saleDate <= dateRange.endDate;
    });
  }
  
  return sales;
}

/**
 * Get a sale by ID
 */
export async function getSaleById(id: string): Promise<Sale | undefined> {
  return db.sales.get(id);
}

/**
 * Get sales for a specific part
 */
export async function getSalesByPart(partId: string): Promise<Sale[]> {
  return db.sales.where('partId').equals(partId).reverse().sortBy('createdAt');
}

/**
 * Get today's sales
 */
export async function getTodaySales(): Promise<Sale[]> {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const sales = await db.sales.toArray();
  return sales.filter(s => {
    const saleDate = new Date(s.createdAt);
    return saleDate >= startOfDay && saleDate <= endOfDay;
  });
}

/**
 * Calculate sales summary for a date range
 */
export async function getSalesSummary(dateRange: DateRange): Promise<{
  totalSales: number;
  totalProfit: number;
  salesCount: number;
  itemsSold: number;
  averageSaleValue: number;
  profitMargin: number;
}> {
  const sales = await getAllSales(dateRange);
  
  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  const salesCount = sales.length;
  const itemsSold = sales.reduce((sum, s) => sum + s.quantity, 0);
  const averageSaleValue = salesCount > 0 ? totalSales / salesCount : 0;
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  
  return {
    totalSales,
    totalProfit,
    salesCount,
    itemsSold,
    averageSaleValue,
    profitMargin,
  };
}

/**
 * Get sales grouped by date
 */
export async function getSalesByDate(dateRange: DateRange): Promise<Map<string, Sale[]>> {
  const sales = await getAllSales(dateRange);
  const grouped = new Map<string, Sale[]>();
  
  for (const sale of sales) {
    const dateKey = new Date(sale.createdAt).toISOString().split('T')[0];
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(sale);
  }
  
  return grouped;
}

/**
 * Get top selling parts
 */
export async function getTopSellingParts(dateRange: DateRange, limit: number = 10): Promise<{
  partId: string;
  partName: string;
  sku: string;
  quantitySold: number;
  totalRevenue: number;
  totalProfit: number;
}[]> {
  const sales = await getAllSales(dateRange);
  
  // Group by part
  const partSales = new Map<string, {
    partName: string;
    sku: string;
    quantitySold: number;
    totalRevenue: number;
    totalProfit: number;
  }>();
  
  for (const sale of sales) {
    const existing = partSales.get(sale.partId);
    if (existing) {
      existing.quantitySold += sale.quantity;
      existing.totalRevenue += sale.totalAmount;
      existing.totalProfit += sale.profit;
    } else {
      partSales.set(sale.partId, {
        partName: sale.partName,
        sku: sale.partSku,
        quantitySold: sale.quantity,
        totalRevenue: sale.totalAmount,
        totalProfit: sale.profit,
      });
    }
  }
  
  // Convert to array and sort by quantity sold
  return Array.from(partSales.entries())
    .map(([partId, data]) => ({ partId, ...data }))
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, limit);
}

/**
 * Delete a sale (for corrections only)
 */
export async function deleteSale(id: string): Promise<boolean> {
  const sale = await db.sales.get(id);
  if (!sale) return false;
  
  await db.sales.delete(id);
  
  // Note: This doesn't restore stock - manual adjustment needed
  await logActivity({
    action: 'delete',
    entityType: 'sale',
    entityId: id,
    description: `Deleted sale: ${sale.quantity}x ${sale.partName}`,
    metadata: { amount: sale.totalAmount },
  });
  
  return true;
}
