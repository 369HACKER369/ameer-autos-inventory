import { useState, useEffect } from 'react';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose,
} from '@/components/ui/drawer';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Trash2, Clock, Filter } from 'lucide-react';
import { db, getSetting, updateSetting } from '@/db/database';
import { toast } from 'sonner';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import type { ActivityAction } from '@/types';

interface ManageLogsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AUTO_DELETE_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: '180', label: '180 days' },
  { value: '365', label: '1 year' },
  { value: 'custom', label: 'Custom' },
];

const ACTIVITY_TYPES: { action: ActivityAction; label: string }[] = [
  { action: 'create', label: 'Created' },
  { action: 'update', label: 'Updated' },
  { action: 'delete', label: 'Deleted' },
  { action: 'sale', label: 'Sales' },
  { action: 'backup', label: 'Backup' },
  { action: 'restore', label: 'Restore' },
  { action: 'sync', label: 'Sync' },
];

export function ManageLogsSheet({ open, onOpenChange }: ManageLogsSheetProps) {
  // Auto-delete state
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(false);
  const [autoDeleteDays, setAutoDeleteDays] = useState('30');
  const [customDays, setCustomDays] = useState('');

  // Date range delete state
  const [rangeStart, setRangeStart] = useState<Date | undefined>();
  const [rangeEnd, setRangeEnd] = useState<Date | undefined>();

  // Type delete state
  const [selectedTypes, setSelectedTypes] = useState<ActivityAction[]>([]);

  // Confirm dialog
  const [confirmAction, setConfirmAction] = useState<'range' | 'type' | null>(null);

  // Load settings
  useEffect(() => {
    if (open) {
      (async () => {
        const enabled = await getSetting<boolean>('autoDeleteLogs');
        const days = await getSetting<string>('autoDeleteDays');
        const custom = await getSetting<string>('autoDeleteCustomDays');
        if (enabled !== undefined) setAutoDeleteEnabled(enabled);
        if (days) setAutoDeleteDays(days);
        if (custom) setCustomDays(custom);
      })();
    }
  }, [open]);

  const handleAutoDeleteToggle = async (enabled: boolean) => {
    setAutoDeleteEnabled(enabled);
    await updateSetting('autoDeleteLogs', enabled);
    if (enabled) {
      await runAutoCleanup();
    }
    toast.success(enabled ? 'Auto-delete enabled' : 'Auto-delete disabled');
  };

  const handleAutoDeleteDaysChange = async (value: string) => {
    setAutoDeleteDays(value);
    await updateSetting('autoDeleteDays', value);
    if (autoDeleteEnabled && value !== 'custom') {
      await runAutoCleanup();
    }
  };

  const handleCustomDaysChange = async (value: string) => {
    setCustomDays(value);
    await updateSetting('autoDeleteCustomDays', value);
  };

  const runAutoCleanup = async () => {
    const days = autoDeleteDays === 'custom' ? parseInt(customDays) : parseInt(autoDeleteDays);
    if (isNaN(days) || days <= 0) return;

    const cutoffDate = subDays(new Date(), days);
    const logsToDelete = await db.activityLogs
      .where('createdAt')
      .below(cutoffDate)
      .toArray();

    const activeIds = logsToDelete.filter(l => !l.isDeleted).map(l => l.id);
    if (activeIds.length > 0) {
      await db.activityLogs.where('id').anyOf(activeIds).modify({ isDeleted: true });
      toast.success(`Auto-cleaned ${activeIds.length} old log entries`);
    }
  };

  const handleDeleteByRange = async () => {
    if (!rangeStart || !rangeEnd) return;
    const logs = await db.activityLogs.toArray();
    const start = startOfDay(rangeStart);
    const end = endOfDay(rangeEnd);
    const idsToDelete = logs
      .filter(l => !l.isDeleted && new Date(l.createdAt) >= start && new Date(l.createdAt) <= end)
      .map(l => l.id);

    if (idsToDelete.length === 0) {
      toast.info('No logs found in selected range');
    } else {
      await db.activityLogs.where('id').anyOf(idsToDelete).modify({ isDeleted: true });
      toast.success(`Soft-deleted ${idsToDelete.length} log entries`);
    }
    setConfirmAction(null);
    setRangeStart(undefined);
    setRangeEnd(undefined);
  };

  const handleDeleteByType = async () => {
    if (selectedTypes.length === 0) return;
    const logs = await db.activityLogs.toArray();
    const idsToDelete = logs
      .filter(l => !l.isDeleted && selectedTypes.includes(l.action))
      .map(l => l.id);

    if (idsToDelete.length === 0) {
      toast.info('No logs found for selected types');
    } else {
      await db.activityLogs.where('id').anyOf(idsToDelete).modify({ isDeleted: true });
      toast.success(`Soft-deleted ${idsToDelete.length} log entries`);
    }
    setConfirmAction(null);
    setSelectedTypes([]);
  };

  const toggleType = (action: ActivityAction) => {
    setSelectedTypes(prev =>
      prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
    );
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Manage Logs</DrawerTitle>
            <DrawerDescription>Auto-cleanup, delete by date or type</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-5 overflow-y-auto">
            {/* Section 1: Auto Delete */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Automatic Deletion</h3>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-delete" className="text-sm">Enable Auto Delete</Label>
                <Switch id="auto-delete" checked={autoDeleteEnabled} onCheckedChange={handleAutoDeleteToggle} />
              </div>
              {autoDeleteEnabled && (
                <div className="space-y-2 pl-1">
                  <Label className="text-xs text-muted-foreground">Delete logs older than:</Label>
                  <Select value={autoDeleteDays} onValueChange={handleAutoDeleteDaysChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTO_DELETE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {autoDeleteDays === 'custom' && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Days"
                        value={customDays}
                        onChange={e => handleCustomDaysChange(e.target.value)}
                        className="h-9 w-24"
                        min={1}
                      />
                      <span className="text-xs text-muted-foreground">days</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Section 2: Delete by Date Range */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Delete by Date Range</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full text-xs justify-start">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {rangeStart ? format(rangeStart, 'dd MMM yyyy') : 'Start Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={rangeStart} onSelect={setRangeStart} initialFocus />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full text-xs justify-start">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {rangeEnd ? format(rangeEnd, 'dd MMM yyyy') : 'End Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={rangeEnd} onSelect={setRangeEnd} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                disabled={!rangeStart || !rangeEnd}
                onClick={() => setConfirmAction('range')}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete Logs in Selected Range
              </Button>
            </div>

            <Separator />

            {/* Section 3: Delete by Type */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Delete by Activity Type</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVITY_TYPES.map(({ action, label }) => (
                  <label key={action} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedTypes.includes(action)}
                      onCheckedChange={() => toggleType(action)}
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                disabled={selectedTypes.length === 0}
                onClick={() => setConfirmAction('type')}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete Selected Types
              </Button>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmAction !== null} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete selected logs? This only removes log records and does not affect inventory or sales data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmAction === 'range' ? handleDeleteByRange : handleDeleteByType}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
