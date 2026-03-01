import { db, getSetting, updateSetting } from '@/db/database';
import { DEMO_PARTS, DEMO_CATEGORIES, DEMO_BRANDS } from '@/data/demoParts';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seed demo data only on first launch when database is empty.
 * Sets demoDataInserted flag to prevent re-seeding.
 */
export async function seedDemoDataIfNeeded(): Promise<boolean> {
  try {
    // Check if demo data was already inserted
    const alreadyInserted = await getSetting<boolean>('demoDataInserted');
    if (alreadyInserted) {
      // Verify data actually exists
      const existingParts = await db.parts.count();
      if (existingParts > 0) return false;
      // Flag was set but no data — re-seed
    }

    // Check if database already has parts (user data exists)
    const existingParts = await db.parts.count();
    if (existingParts > 0) {
      await updateSetting('demoDataInserted', true);
      return false;
    }

  const now = new Date();

  // Create categories
  const categoryMap: Record<string, string> = {};
  for (const catName of DEMO_CATEGORIES) {
    const id = uuidv4();
    categoryMap[catName] = id;
    await db.categories.add({ id, name: catName, createdAt: now });
  }

  // Create brands
  const brandMap: Record<string, string> = {};
  for (const brandName of DEMO_BRANDS) {
    const id = uuidv4();
    brandMap[brandName] = id;
    await db.brands.add({ id, name: brandName, createdAt: now });
  }

  // Create parts
  const parts = DEMO_PARTS.map(p => ({
    id: uuidv4(),
    name: p.name,
    sku: p.sku,
    brandId: brandMap[p.brand] || '',
    categoryId: categoryMap[p.category] || '',
    unitType: 'piece' as const,
    quantity: p.quantity,
    minStockLevel: p.minStockLevel,
    buyingPrice: p.buyingPrice,
    sellingPrice: p.sellingPrice,
    location: p.location,
    notes: p.notes,
    images: [],
    isDemo: true,
    createdAt: now,
    updatedAt: now,
  }));

  await db.parts.bulkAdd(parts);

  // Set flag to prevent re-seeding
  await updateSetting('demoDataInserted', true);

  return true;
}
