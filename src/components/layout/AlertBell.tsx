import { useState } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLowStockAlert } from '@/hooks/useLowStockAlert';
import { cn } from '@/lib/utils';

export function AlertBell() {
  const { 
    hasLowStock, 
    lowStockCount, 
    isAlertAcknowledged, 
    acknowledgeAlert 
  } = useLowStockAlert();
  const [open, setOpen] = useState(false);

  // Don't show bell if no low stock items
  if (!hasLowStock) {
    return null;
  }

  const showBadge = hasLowStock && !isAlertAcknowledged;

  const handleAcknowledge = async () => {
    await acknowledgeAlert();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative h-9 w-9',
            showBadge && 'text-destructive'
          )}
        >
          <Bell className={cn(
            'h-5 w-5',
            showBadge && 'animate-pulse'
          )} />
          {showBadge && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {lowStockCount > 9 ? '9+' : lowStockCount}
              </span>
            </span>
          )}
          <span className="sr-only">Low stock alerts</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Low Stock Alerts</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Bell className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-sm">
                {lowStockCount} item{lowStockCount !== 1 ? 's' : ''} low on stock
              </p>
              <p className="text-xs text-muted-foreground">
                {isAlertAcknowledged 
                  ? 'Alert acknowledged' 
                  : 'Requires attention'}
              </p>
            </div>
          </div>
          
          {!isAlertAcknowledged && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleAcknowledge}
            >
              <BellOff className="h-4 w-4 mr-2" />
              Acknowledge Alert
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground text-center">
            Emergency icons on parts will remain until stock is updated
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
