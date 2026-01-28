import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Red emergency indicator icon for low stock items
 * Shows consistently across all views when quantity <= minStockLevel
 */
export function EmergencyIndicator({ className, size = 'sm' }: EmergencyIndicatorProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <AlertCircle 
      className={cn(
        'text-destructive shrink-0 animate-pulse',
        sizeClasses[size],
        className
      )}
      aria-label="Low stock emergency"
    />
  );
}

/**
 * Check if a part is in emergency (low stock) state
 */
export function isLowStock(quantity: number, minStockLevel: number): boolean {
  const qty = typeof quantity === 'number' && !isNaN(quantity) ? quantity : 0;
  const minStock = typeof minStockLevel === 'number' && !isNaN(minStockLevel) ? minStockLevel : 0;
  return qty <= minStock;
}
