import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
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

export function LowStockChart({ data, title = "Low Stock Risk Analysis" }: LowStockChartProps) {
  if (data.length === 0) return null;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'hsl(0, 84%, 60%)';     // Red
      case 'warning':
        return 'hsl(25, 95%, 53%)';    // Orange
      case 'near':
        return 'hsl(45, 93%, 47%)';    // Yellow
      default:
        return 'hsl(0, 0%, 50%)';
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
    <Card className="bg-card border-border/50 animate-fade-in">
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
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(0, 84%, 60%)' }} />
            <span className="text-muted-foreground">Critical (0 stock)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(25, 95%, 53%)' }} />
            <span className="text-muted-foreground">Warning (&lt;50% min)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(45, 93%, 47%)' }} />
            <span className="text-muted-foreground">Near Threshold</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(0, 0%, 15%)" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                domain={[0, 'dataMax']}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 4%)',
                  border: '1px solid hsl(0, 0%, 20%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
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
                animationDuration={800}
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
