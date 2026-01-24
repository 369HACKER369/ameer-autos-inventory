import { db } from '@/db/database';
import type { Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { logActivity } from './activityLogService';

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  const categories = await db.categories.toArray();
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a category by ID
 */
export async function getCategoryById(id: string): Promise<Category | undefined> {
  return db.categories.get(id);
}

/**
 * Create a new category
 */
export async function createCategory(name: string): Promise<Category> {
  const category: Category = {
    id: uuidv4(),
    name: name.trim(),
    createdAt: new Date(),
  };
  
  await db.categories.add(category);
  
  await logActivity({
    action: 'create',
    entityType: 'category',
    entityId: category.id,
    description: `Added new category: ${category.name}`,
  });
  
  return category;
}

/**
 * Update a category
 */
export async function updateCategory(id: string, name: string): Promise<Category | undefined> {
  const existing = await db.categories.get(id);
  if (!existing) return undefined;
  
  const updated: Category = {
    ...existing,
    name: name.trim(),
  };
  
  await db.categories.put(updated);
  
  await logActivity({
    action: 'update',
    entityType: 'category',
    entityId: id,
    description: `Updated category: ${existing.name} → ${updated.name}`,
  });
  
  return updated;
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const category = await db.categories.get(id);
  if (!category) return false;
  
  // Check if category is used by any parts
  const partsUsingCategory = await db.parts.where('categoryId').equals(id).count();
  if (partsUsingCategory > 0) {
    throw new Error(`Cannot delete category. ${partsUsingCategory} part(s) are using this category.`);
  }
  
  await db.categories.delete(id);
  
  await logActivity({
    action: 'delete',
    entityType: 'category',
    entityId: id,
    description: `Deleted category: ${category.name}`,
  });
  
  return true;
}

/**
 * Check if category name exists
 */
export async function isCategoryNameUnique(name: string, excludeId?: string): Promise<boolean> {
  const categories = await db.categories.where('name').equalsIgnoreCase(name.trim()).toArray();
  if (categories.length === 0) return true;
  return excludeId ? categories.every(c => c.id === excludeId) : false;
}

/**
 * Get category with part count
 */
export async function getCategoryWithPartCount(id: string): Promise<{ category: Category; partCount: number } | undefined> {
  const category = await db.categories.get(id);
  if (!category) return undefined;
  
  const partCount = await db.parts.where('categoryId').equals(id).count();
  return { category, partCount };
}

/**
 * Get all categories with part counts
 */
export async function getAllCategoriesWithCounts(): Promise<{ category: Category; partCount: number }[]> {
  const categories = await getAllCategories();
  const result = [];
  
  for (const category of categories) {
    const partCount = await db.parts.where('categoryId').equals(category.id).count();
    result.push({ category, partCount });
  }
  
  return result;
}
