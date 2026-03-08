import { db, getSetting, updateSetting } from '@/db/database';

/**
 * Clear all demo data from the database.
 * Runs once on startup to purge any previously seeded demo data.
 */
export async function clearAllDemoData(): Promise<void> {
  try {
    const alreadyCleared = await getSetting<boolean>('demoDataCleared');
    if (alreadyCleared) return;

    // Delete all demo parts
    const demoParts = await db.parts.filter(p => p.isDemo === true).toArray();
    if (demoParts.length > 0) {
      await db.parts.bulkDelete(demoParts.map(p => p.id));
    }

    // Clean up orphaned brands (no parts reference them)
    const allParts = await db.parts.toArray();
    const usedBrandIds = new Set(allParts.map(p => p.brandId));
    const allBrands = await db.brands.toArray();
    const orphanBrandIds = allBrands.filter(b => !usedBrandIds.has(b.id)).map(b => b.id);
    if (orphanBrandIds.length > 0) {
      await db.brands.bulkDelete(orphanBrandIds);
    }

    // Clean up orphaned categories
    const usedCatIds = new Set(allParts.map(p => p.categoryId));
    const allCats = await db.categories.toArray();
    const orphanCatIds = allCats.filter(c => !usedCatIds.has(c.id)).map(c => c.id);
    if (orphanCatIds.length > 0) {
      await db.categories.bulkDelete(orphanCatIds);
    }

    await updateSetting('demoDataCleared', true);
    console.log(`[DemoCleanup] Removed ${demoParts.length} demo parts, ${orphanBrandIds.length} orphan brands, ${orphanCatIds.length} orphan categories`);
  } catch (error) {
    console.error('[DemoCleanup] Failed to clear demo data:', error);
  }
}
