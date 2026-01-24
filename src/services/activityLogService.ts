import { db } from '@/db/database';
import type { ActivityLog, ActivityAction, EntityType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface LogActivityParams {
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string;
  description: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an activity
 */
export async function logActivity(params: LogActivityParams): Promise<ActivityLog> {
  const log: ActivityLog = {
    id: uuidv4(),
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    description: params.description,
    metadata: params.metadata,
    createdAt: new Date(),
  };
  
  await db.activityLogs.add(log);
  return log;
}

/**
 * Get all activity logs
 */
export async function getAllActivityLogs(limit?: number): Promise<ActivityLog[]> {
  let query = db.activityLogs.orderBy('createdAt').reverse();
  
  if (limit) {
    return query.limit(limit).toArray();
  }
  
  return query.toArray();
}

/**
 * Get activity logs for a specific entity
 */
export async function getActivityLogsByEntity(
  entityType: EntityType, 
  entityId: string
): Promise<ActivityLog[]> {
  const logs = await db.activityLogs
    .where('entityType')
    .equals(entityType)
    .toArray();
  
  return logs
    .filter(log => log.entityId === entityId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get activity logs by action type
 */
export async function getActivityLogsByAction(action: ActivityAction): Promise<ActivityLog[]> {
  return db.activityLogs
    .where('action')
    .equals(action)
    .reverse()
    .sortBy('createdAt');
}

/**
 * Get recent activity logs
 */
export async function getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
  return db.activityLogs
    .orderBy('createdAt')
    .reverse()
    .limit(limit)
    .toArray();
}

/**
 * Clear all activity logs
 */
export async function clearActivityLogs(): Promise<void> {
  await db.activityLogs.clear();
}

/**
 * Get activity count by type
 */
export async function getActivityCounts(): Promise<Record<ActivityAction, number>> {
  const logs = await db.activityLogs.toArray();
  
  const counts: Record<ActivityAction, number> = {
    create: 0,
    update: 0,
    delete: 0,
    sale: 0,
    backup: 0,
    restore: 0,
    sync: 0,
  };
  
  for (const log of logs) {
    counts[log.action]++;
  }
  
  return counts;
}

/**
 * Get activity icon based on action type
 */
export function getActivityIcon(action: ActivityAction): string {
  switch (action) {
    case 'create':
      return 'Plus';
    case 'update':
      return 'Pencil';
    case 'delete':
      return 'Trash2';
    case 'sale':
      return 'ShoppingCart';
    case 'backup':
      return 'Download';
    case 'restore':
      return 'Upload';
    case 'sync':
      return 'RefreshCw';
    default:
      return 'Activity';
  }
}

/**
 * Get activity color based on action type
 */
export function getActivityColor(action: ActivityAction): string {
  switch (action) {
    case 'create':
      return 'text-success';
    case 'update':
      return 'text-primary';
    case 'delete':
      return 'text-destructive';
    case 'sale':
      return 'text-primary';
    case 'backup':
      return 'text-muted-foreground';
    case 'restore':
      return 'text-warning';
    case 'sync':
      return 'text-primary';
    default:
      return 'text-foreground';
  }
}
