import { db } from '@/db/database';
import type { Brand } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { logActivity } from './activityLogService';

/**
 * Get all brands
 */
export async function getAllBrands(): Promise<Brand[]> {
  const brands = await db.brands.toArray();
  return brands.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a brand by ID
 */
export async function getBrandById(id: string): Promise<Brand | undefined> {
  return db.brands.get(id);
}

/**
 * Create a new brand
 */
export async function createBrand(name: string): Promise<Brand> {
  const brand: Brand = {
    id: uuidv4(),
    name: name.trim(),
    createdAt: new Date(),
  };
  
  await db.brands.add(brand);
  
  await logActivity({
    action: 'create',
    entityType: 'brand',
    entityId: brand.id,
    description: `Added new brand: ${brand.name}`,
  });
  
  return brand;
}

/**
 * Update a brand
 */
export async function updateBrand(id: string, name: string): Promise<Brand | undefined> {
  const existing = await db.brands.get(id);
  if (!existing) return undefined;
  
  const updated: Brand = {
    ...existing,
    name: name.trim(),
  };
  
  await db.brands.put(updated);
  
  await logActivity({
    action: 'update',
    entityType: 'brand',
    entityId: id,
    description: `Updated brand: ${existing.name} → ${updated.name}`,
  });
  
  return updated;
}

/**
 * Delete a brand
 */
export async function deleteBrand(id: string): Promise<boolean> {
  const brand = await db.brands.get(id);
  if (!brand) return false;
  
  // Check if brand is used by any parts
  const partsUsingBrand = await db.parts.where('brandId').equals(id).count();
  if (partsUsingBrand > 0) {
    throw new Error(`Cannot delete brand. ${partsUsingBrand} part(s) are using this brand.`);
  }
  
  await db.brands.delete(id);
  
  await logActivity({
    action: 'delete',
    entityType: 'brand',
    entityId: id,
    description: `Deleted brand: ${brand.name}`,
  });
  
  return true;
}

/**
 * Check if brand name exists
 */
export async function isBrandNameUnique(name: string, excludeId?: string): Promise<boolean> {
  const brands = await db.brands.where('name').equalsIgnoreCase(name.trim()).toArray();
  if (brands.length === 0) return true;
  return excludeId ? brands.every(b => b.id === excludeId) : false;
}

/**
 * Get brand with part count
 */
export async function getBrandWithPartCount(id: string): Promise<{ brand: Brand; partCount: number } | undefined> {
  const brand = await db.brands.get(id);
  if (!brand) return undefined;
  
  const partCount = await db.parts.where('brandId').equals(id).count();
  return { brand, partCount };
}

/**
 * Get all brands with part counts
 */
export async function getAllBrandsWithCounts(): Promise<{ brand: Brand; partCount: number }[]> {
  const brands = await getAllBrands();
  const result = [];
  
  for (const brand of brands) {
    const partCount = await db.parts.where('brandId').equals(brand.id).count();
    result.push({ brand, partCount });
  }
  
  return result;
}
