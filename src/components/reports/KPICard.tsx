import { Card, CardContent } from '@/components/ui/card';
import { formatCurrencyShort } from '@/utils/currency';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isCurrency?: boolean;
  suffix?: string;
  className?: string;
  highlight?: boolean;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  icon,
  isCurrency = false,
  suffix = '',
  className,
  highlight,
  loading,
}: KPICardProps) {
  const formatValue = () => {
    if (isCurrency && typeof value === 'number') {
      const abs = Math.abs(value);
      const sign = value < 0 ? '-' : '';
      if (abs >= 10000000) return `Rs ${sign}${(abs / 10000000).toFixed(2)} Cr`;
      if (abs >= 100000) return `Rs ${sign}${(abs / 100000).toFixed(2)} Lac`;
      if (abs >= 1000) return `Rs ${sign}${(abs / 1000).toFixed(1)} K`;
      return formatCurrencyShort(value);
    }
    return `${value}${suffix}`;
  };

  return (
    <Card className={cn('bg-card', highlight && 'border-warning/50', className)}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground truncate">{title}</p>
            {loading ? (
              <Skeleton className="h-6 w-16 mt-1" />
            ) : (
              <p className="text-lg font-bold mt-1 truncate">{formatValue()}</p>
            )}
          </div>
          <div className="shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
