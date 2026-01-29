import { Card, CardContent } from '@/components/ui/card';
import { formatCurrencyShort } from '@/utils/currency';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';

interface SparklineData {
  value: number;
}

interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  sparklineData?: SparklineData[];
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  isCurrency?: boolean;
  suffix?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  icon,
  sparklineData = [],
  trend,
  trendValue,
  isCurrency = false,
  suffix = '',
  className,
}: KPICardProps) {
  const displayValue = isCurrency && typeof value === 'number' 
    ? formatCurrencyShort(value)
    : `${value}${suffix}`;

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-primary" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-destructive" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    switch (trend) {
      case 'up':
        return 'text-primary';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  // Use CSS variables for dynamic theme support
  const sparklineColor = 'hsl(var(--primary))';

  return (
    <Card className={cn(
      "bg-card border-border/50 card-shadow overflow-hidden transition-all duration-200 hover:border-primary/30",
      "animate-fade-in",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              {icon}
            </div>
          </div>
          {trend && trendValue && (
            <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {displayValue}
          </p>
        </div>

        {/* Sparkline */}
        {sparklineData.length > 1 && (
          <div className="h-10 mt-3 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`sparkline-gradient-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={sparklineColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sparklineColor}
                  strokeWidth={1.5}
                  fill={`url(#sparkline-gradient-${title.replace(/\s/g, '')})`}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
