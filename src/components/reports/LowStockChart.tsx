import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencyIndicator } from '@/components/ui/emergency-indicator';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface LowStockItem {
  name: string;
  quantity: number;
  minStock: number;
  urgency: 'critical' | 'warning' | 'near';
}

interface LowStockChartProps {
  data: LowStockItem[];
  title?: string;
}

// Muted, professional urgency colors
const URGENCY_COLORS = {
  light: {
    critical: 'hsl(0, 65%, 50%)',     // Red - critical
    warning: 'hsl(35, 75%, 50%)',     // Amber - warning
    near: 'hsl(45, 70%, 48%)',        // Yellow - near threshold
  },
  dark: {
    critical: 'hsl(0, 55%, 55%)',     // Red - softer
    warning: 'hsl(35, 60%, 52%)',     // Amber - softer
    near: 'hsl(45, 55%, 50%)',        // Yellow - softer
  },
};

export function LowStockChart({ data, title = "Low Stock Risk Analysis" }: LowStockChartProps) {
  if (data.length === 0) return null;

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const colors = isDark ? URGENCY_COLORS.dark : URGENCY_COLORS.light;
  const gridColor = isDark ? 'hsl(220, 12%, 22%)' : 'hsl(220, 14%, 88%)';
  const textColor = isDark ? 'hsl(220, 10%, 55%)' : 'hsl(220, 10%, 46%)';
  const tooltipBg = isDark ? 'hsl(220, 16%, 12%)' : 'hsl(0, 0%, 100%)';
  const tooltipBorder = isDark ? 'hsl(220, 12%, 22%)' : 'hsl(220, 14%, 88%)';

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return colors.critical;
      case 'warning':
        return colors.warning;
      case 'near':
        return colors.near;
      default:
        return isDark ? 'hsl(220, 8%, 50%)' : 'hsl(220, 10%, 60%)';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'Critical';
      case 'warning':
        return 'Warning';
      case 'near':
        return 'Near Threshold';
      default:
        return 'Unknown';
    }
  };

  // Sort by urgency (critical first)
  const sortedData = [...data].sort((a, b) => {
    const order = { critical: 0, warning: 1, near: 2 };
    return order[a.urgency] - order[b.urgency];
  });

  return (
    <Card className="bg-card border-border/50 card-shadow animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <EmergencyIndicator size="md" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.critical }} />
            <span className="text-muted-foreground">Critical (0 stock)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.warning }} />
            <span className="text-muted-foreground">Warning (&lt;50% min)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.near }} />
            <span className="text-muted-foreground">Near Threshold</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: textColor }}
                axisLine={{ stroke: gridColor }}
                domain={[0, 'dataMax']}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10, fill: textColor }}
                axisLine={{ stroke: gridColor }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                formatter={(value: number, _, props) => {
                  const item = props.payload as LowStockItem;
                  return [
                    `${value} / ${item.minStock} (${getUrgencyLabel(item.urgency)})`,
                    'Stock'
                  ];
                }}
              />
              <Bar 
                dataKey="quantity" 
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
                animationDuration={600}
              >
                {sortedData.map((entry, index) => (
                  <Cell key={index} fill={getUrgencyColor(entry.urgency)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
