import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatCurrencyShort } from '@/utils/currency';
import { Target } from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  Cell,
} from 'recharts';

interface ProductPerformanceData {
  name: string;
  unitsSold: number;
  revenue: number;
  profit: number;
  category: string;
}

interface ProductPerformanceChartProps {
  data: ProductPerformanceData[];
  title?: string;
}

// Muted, professional category colors
const CATEGORY_COLORS_LIGHT = [
  'hsl(152, 45%, 42%)',  // Green
  'hsl(210, 60%, 50%)',  // Blue
  'hsl(175, 45%, 45%)',  // Teal
  'hsl(35, 70%, 52%)',   // Amber
  'hsl(280, 45%, 55%)',  // Purple
  'hsl(350, 55%, 55%)',  // Rose
  'hsl(45, 65%, 52%)',   // Gold
  'hsl(195, 55%, 48%)',  // Cyan
];

const CATEGORY_COLORS_DARK = [
  'hsl(152, 40%, 48%)',  // Green (softer)
  'hsl(210, 55%, 55%)',  // Blue (softer)
  'hsl(175, 40%, 50%)',  // Teal (softer)
  'hsl(35, 60%, 55%)',   // Amber (softer)
  'hsl(280, 40%, 58%)',  // Purple (softer)
  'hsl(350, 48%, 58%)',  // Rose (softer)
  'hsl(45, 55%, 55%)',   // Gold (softer)
  'hsl(195, 48%, 52%)',  // Cyan (softer)
];

export function ProductPerformanceChart({ 
  data, 
  title = "Product Performance Matrix" 
}: ProductPerformanceChartProps) {
  if (data.length === 0) return null;

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const colors = isDark ? CATEGORY_COLORS_DARK : CATEGORY_COLORS_LIGHT;
  const gridColor = isDark ? 'hsl(220, 12%, 22%)' : 'hsl(220, 14%, 88%)';
  const textColor = isDark ? 'hsl(220, 10%, 55%)' : 'hsl(220, 10%, 46%)';
  const tooltipBg = isDark ? 'hsl(220, 16%, 12%)' : 'hsl(0, 0%, 100%)';
  const tooltipBorder = isDark ? 'hsl(220, 12%, 22%)' : 'hsl(220, 14%, 88%)';

  // Get unique categories
  const categories = [...new Set(data.map(d => d.category))];
  const categoryColorMap = new Map(categories.map((cat, idx) => [cat, colors[idx % colors.length]]));

  // Calculate size range for ZAxis
  const maxProfit = Math.max(...data.map(d => d.profit), 1);
  const minProfit = Math.min(...data.map(d => d.profit), 0);

  return (
    <Card className="bg-card border-border/50 card-shadow animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {categories.slice(0, 6).map((cat) => (
            <div key={cat} className="flex items-center gap-1.5 text-xs">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: categoryColorMap.get(cat) }}
              />
              <span className="text-muted-foreground">{cat}</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground mb-2">
          <span>Dot size = Profit amount</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                type="number"
                dataKey="unitsSold"
                name="Units Sold"
                tick={{ fontSize: 10, fill: textColor }}
                axisLine={{ stroke: gridColor }}
                label={{ value: 'Units Sold', position: 'bottom', fontSize: 10, fill: textColor }}
              />
              <YAxis
                type="number"
                dataKey="revenue"
                name="Revenue"
                tick={{ fontSize: 10, fill: textColor }}
                axisLine={{ stroke: gridColor }}
                tickFormatter={(v) => formatCurrencyShort(v)}
              />
              <ZAxis
                type="number"
                dataKey="profit"
                range={[50, 400]}
                domain={[minProfit, maxProfit]}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'Revenue' || name === 'Profit') {
                    return [formatCurrency(value), name];
                  }
                  return [value, name];
                }}
                labelFormatter={(_, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.name;
                  }
                  return '';
                }}
              />
              <Scatter 
                data={data} 
                isAnimationActive={true}
                animationDuration={600}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={categoryColorMap.get(entry.category) || colors[0]} 
                    fillOpacity={0.75}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
