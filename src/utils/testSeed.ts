import { db } from '@/db/database';
import { v4 as uuidv4 } from 'uuid';
import { subDays, subHours } from 'date-fns';

/**
 * Seeds temporary test data for verifying dashboard charts.
 * Call clearTestData() to remove it all.
 */
export async function seedTestData() {
  const now = new Date();

  // Brands
  const brands = [
    { id: uuidv4(), name: 'Toyota Genuine', createdAt: now },
    { id: uuidv4(), name: 'Denso', createdAt: now },
    { id: uuidv4(), name: 'Aisin', createdAt: now },
  ];
  await db.brands.bulkPut(brands);

  // Categories
  const categories = [
    { id: uuidv4(), name: 'Filters', createdAt: now },
    { id: uuidv4(), name: 'Brake Parts', createdAt: now },
    { id: uuidv4(), name: 'Engine Parts', createdAt: now },
  ];
  await db.categories.bulkPut(categories);

  // Parts — mix of in-stock, low-stock, out-of-stock
  const parts = [
    { id: uuidv4(), name: 'Oil Filter', sku: 'OF-001', brandId: brands[0].id, categoryId: categories[0].id, unitType: 'piece' as const, quantity: 45, minStockLevel: 10, buyingPrice: 350, sellingPrice: 550, location: 'Shelf A1', notes: '', images: [], isDemo: true, createdAt: now, updatedAt: now },
    { id: uuidv4(), name: 'Air Filter', sku: 'AF-002', brandId: brands[1].id, categoryId: categories[0].id, unitType: 'piece' as const, quantity: 3, minStockLevel: 10, buyingPrice: 600, sellingPrice: 950, location: 'Shelf A2', notes: '', images: [], isDemo: true, createdAt: now, updatedAt: now },
    { id: uuidv4(), name: 'Brake Pad Set', sku: 'BP-003', brandId: brands[2].id, categoryId: categories[1].id, unitType: 'set' as const, quantity: 0, minStockLevel: 5, buyingPrice: 1800, sellingPrice: 2800, location: 'Shelf B1', notes: '', images: [], isDemo: true, createdAt: now, updatedAt: now },
    { id: uuidv4(), name: 'Timing Belt', sku: 'TB-004', brandId: brands[0].id, categoryId: categories[2].id, unitType: 'piece' as const, quantity: 22, minStockLevel: 5, buyingPrice: 1200, sellingPrice: 2000, location: 'Shelf C1', notes: '', images: [], isDemo: true, createdAt: now, updatedAt: now },
    { id: uuidv4(), name: 'Spark Plug', sku: 'SP-005', brandId: brands[1].id, categoryId: categories[2].id, unitType: 'piece' as const, quantity: 2, minStockLevel: 15, buyingPrice: 250, sellingPrice: 450, location: 'Shelf C2', notes: '', images: [], isDemo: true, createdAt: now, updatedAt: now },
    { id: uuidv4(), name: 'Clutch Disc', sku: 'CD-006', brandId: brands[2].id, categoryId: categories[2].id, unitType: 'piece' as const, quantity: 18, minStockLevel: 3, buyingPrice: 3500, sellingPrice: 5500, location: 'Shelf D1', notes: '', images: [], isDemo: true, createdAt: now, updatedAt: now },
  ];
  await db.parts.bulkPut(parts);

  // Sales spread across last 7 days
  const salesData: Array<{ partIdx: number; qty: number; daysAgo: number; hoursAgo: number }> = [
    { partIdx: 0, qty: 5, daysAgo: 6, hoursAgo: 3 },
    { partIdx: 3, qty: 2, daysAgo: 5, hoursAgo: 5 },
    { partIdx: 0, qty: 3, daysAgo: 4, hoursAgo: 2 },
    { partIdx: 5, qty: 1, daysAgo: 4, hoursAgo: 7 },
    { partIdx: 3, qty: 4, daysAgo: 3, hoursAgo: 4 },
    { partIdx: 0, qty: 8, daysAgo: 2, hoursAgo: 1 },
    { partIdx: 5, qty: 2, daysAgo: 2, hoursAgo: 6 },
    { partIdx: 4, qty: 10, daysAgo: 1, hoursAgo: 3 },
    { partIdx: 3, qty: 3, daysAgo: 1, hoursAgo: 8 },
    { partIdx: 0, qty: 4, daysAgo: 0, hoursAgo: 1 },
    { partIdx: 5, qty: 1, daysAgo: 0, hoursAgo: 2 },
  ];

  const sales = salesData.map(s => {
    const part = parts[s.partIdx];
    const total = part.sellingPrice * s.qty;
    const profit = (part.sellingPrice - part.buyingPrice) * s.qty;
    const saleDate = subHours(subDays(now, s.daysAgo), s.hoursAgo);
    return {
      id: uuidv4(),
      partId: part.id,
      partName: part.name,
      partSku: part.sku,
      quantity: s.qty,
      unitPrice: part.sellingPrice,
      totalAmount: total,
      buyingPrice: part.buyingPrice,
      profit,
      createdAt: saleDate,
    };
  });
  await db.sales.bulkPut(sales);

  // Activity logs
  const logs = sales.slice(0, 5).map((s, i) => ({
    id: uuidv4(),
    action: 'sale' as const,
    entityType: 'sale' as const,
    entityId: s.id,
    description: `Sold ${s.quantity}x ${s.partName}`,
    createdAt: s.createdAt,
  }));
  await db.activityLogs.bulkPut(logs);
}

export async function clearTestData() {
  // Remove demo-flagged parts
  const demoParts = await db.parts.filter(p => !!p.isDemo).toArray();
  const demoPartIds = demoParts.map(p => p.id);
  await db.parts.where('id').anyOf(demoPartIds).delete();
  // Remove related sales
  await db.sales.where('partId').anyOf(demoPartIds).delete();
  // Clear all brands/categories/logs that were seeded (simple approach)
  await db.brands.clear();
  await db.categories.clear();
  await db.activityLogs.clear();
}
