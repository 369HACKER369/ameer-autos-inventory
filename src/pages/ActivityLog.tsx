import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { db } from '@/db/database';
import { getRelativeDate, formatTime } from '@/utils/dateUtils';
import { getActivityIcon, getActivityColor } from '@/services/activityLogService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Pencil, Trash2, ShoppingCart, Download, Upload, RefreshCw, Activity,
  MoreVertical, Filter, CalendarIcon, X, Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, startOfDay, endOfDay } from 'date-fns';
import type { ActivityAction } from '@/types';
import { ManageLogsSheet } from '@/components/activity/ManageLogsSheet';

const iconMap: Record<string, React.ElementType> = { Plus, Pencil, Trash2, ShoppingCart, Download, Upload, RefreshCw, Activity };

const ACTION_LABELS: Record<ActivityAction, string> = {
  create: 'Add Item', update: 'Edit Item', delete: 'Delete Item',
  sale: 'Sale', backup: 'Backup', restore: 'Restore', sync: 'Sync',
};

const ACTION_FILTERS: { label: string; actions: ActivityAction[] }[] = [
  { label: 'Sales', actions: ['sale'] },
  { label: 'Inventory', actions: ['create', 'update', 'delete'] },
  { label: 'System', actions: ['backup', 'restore', 'sync'] },
];

export default function ActivityLogPage() {
  const [typeFilter, setTypeFilter] = useState<ActivityAction[] | null>(null);
  const [dateStart, setDateStart] = useState<Date | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<Date | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  // Only show non-deleted logs
  const activityLogs = useLiveQuery(
    () => db.activityLogs.orderBy('createdAt').reverse().toArray(),
    []
  ) ?? [];

  const visibleLogs = activityLogs.filter(log => !log.isDeleted);

  // Apply filters
  const filteredLogs = visibleLogs.filter(log => {
    if (typeFilter && !typeFilter.includes(log.action)) return false;
    if (dateStart && new Date(log.createdAt) < startOfDay(dateStart)) return false;
    if (dateEnd && new Date(log.createdAt) > endOfDay(dateEnd)) return false;
    return true;
  });

  const getIcon = (action: ActivityAction) => iconMap[getActivityIcon(action)] || Activity;

  const handleDeleteSingle = useCallback(async () => {
    if (!deleteTarget) return;
    // Soft delete
    await db.activityLogs.update(deleteTarget, { isDeleted: true });
    toast.success('Log entry deleted');
    setDeleteTarget(null);
    setShowDeleteConfirm(false);
  }, [deleteTarget]);

  const handleBulkDelete = useCallback(async () => {
    const idsToDelete = filteredLogs.map(l => l.id);
    if (idsToDelete.length === 0) { toast.info('No logs match the filter'); setShowDeleteConfirm(false); return; }
    await db.activityLogs.where('id').anyOf(idsToDelete).modify({ isDeleted: true });
    toast.success(`Deleted ${idsToDelete.length} log entries`);
    setShowDeleteConfirm(false);
  }, [filteredLogs]);

  const clearFilters = () => {
    setTypeFilter(null);
    setDateStart(undefined);
    setDateEnd(undefined);
  };

  const hasFilters = typeFilter !== null || dateStart !== undefined || dateEnd !== undefined;

  return (
    <AppLayout>
      <Header
        title="Activity Log"
        showBack
        rightAction={
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setManageOpen(true)}>
              <Settings2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                {ACTION_FILTERS.map(f => (
                  <DropdownMenuItem
                    key={f.label}
                    onClick={() => setTypeFilter(prev =>
                      prev && prev.every(a => f.actions.includes(a)) && prev.length === f.actions.length
                        ? null : f.actions
                    )}
                  >
                    <span className="flex-1">{f.label}</span>
                    {typeFilter && typeFilter.every(a => f.actions.includes(a)) && typeFilter.length === f.actions.length && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">Active</Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Bulk Delete</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => { setDeleteTarget(null); setShowDeleteConfirm(true); }}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Filtered Logs
                </DropdownMenuItem>
                {hasFilters && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearFilters}>Clear All Filters</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="p-4 space-y-3">
        {/* Date Range Filter */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {dateStart ? format(dateStart, 'dd MMM yyyy') : 'Start Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateStart} onSelect={setDateStart} initialFocus />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {dateEnd ? format(dateEnd, 'dd MMM yyyy') : 'End Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={dateEnd} onSelect={setDateEnd} initialFocus />
            </PopoverContent>
          </Popover>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="px-2">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {typeFilter && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Filter:</span>
            {ACTION_FILTERS.filter(f => typeFilter.every(a => f.actions.includes(a))).map(f => (
              <Badge key={f.label} variant="secondary" className="text-xs">{f.label}</Badge>
            ))}
          </div>
        )}

        {/* Count */}
        <p className="text-xs text-muted-foreground">{filteredLogs.length} entries</p>

        {/* Log List */}
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No activity found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {hasFilters ? 'Try adjusting your filters' : 'Activities will appear here as you use the app'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => {
              const Icon = getIcon(log.action);
              const colorClass = getActivityColor(log.action);
              const label = ACTION_LABELS[log.action] || log.action;

              return (
                <Card key={log.id} className="bg-card shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'h-9 w-9 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                        'bg-muted'
                      )}>
                        <Icon className={cn('h-4 w-4', colorClass)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">{label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{log.description}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground">{getRelativeDate(log.createdAt)}</p>
                              <p className="text-[10px] text-muted-foreground">{formatTime(log.createdAt)}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => { setDeleteTarget(log.id); setShowDeleteConfirm(true); }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Manage Logs Bottom Sheet */}
      <ManageLogsSheet open={manageOpen} onOpenChange={setManageOpen} />

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget ? 'Delete Log Entry' : 'Delete Filtered Logs'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? 'Are you sure you want to delete this log entry? This only removes the log record and does not affect inventory data.'
                : `Are you sure you want to delete ${filteredLogs.length} log entries? This only removes log records and does not affect inventory data.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeleteTarget(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={deleteTarget ? handleDeleteSingle : handleBulkDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
