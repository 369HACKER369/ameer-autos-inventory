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

const CATEGORY_COLORS: Record<string, string> = {
  'default': 'hsl(142, 76%, 36%)',
};

// Generate consistent colors for categories
const getCategoryColor = (category: string, index: number): string => {
  const colors = [
    'hsl(142, 76%, 36%)', // Green
    'hsl(38, 92%, 50%)',  // Amber
    'hsl(200, 80%, 50%)', // Blue
    'hsl(280, 70%, 50%)', // Purple
    'hsl(0, 84%, 60%)',   // Red
    'hsl(160, 60%, 45%)', // Teal
    'hsl(320, 70%, 50%)', // Pink
    'hsl(45, 90%, 55%)',  // Yellow
  ];
  return colors[index % colors.length];
};

export function ProductPerformanceChart({ 
  data, 
  title = "Product Performance Matrix" 
}: ProductPerformanceChartProps) {
  if (data.length === 0) return null;

  // Get unique categories
  const categories = [...new Set(data.map(d => d.category))];
  const categoryColorMap = new Map(categories.map((cat, idx) => [cat, getCategoryColor(cat, idx)]));

  // Calculate size range for ZAxis
  const maxProfit = Math.max(...data.map(d => d.profit), 1);
  const minProfit = Math.min(...data.map(d => d.profit), 0);

  return (
    <Card className="bg-card border-border/50 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {categories.slice(0, 6).map((cat, idx) => (
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
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
              <XAxis
                type="number"
                dataKey="unitsSold"
                name="Units Sold"
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                label={{ value: 'Units Sold', position: 'bottom', fontSize: 10, fill: 'hsl(0, 0%, 50%)' }}
              />
              <YAxis
                type="number"
                dataKey="revenue"
                name="Revenue"
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
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
                  backgroundColor: 'hsl(0, 0%, 4%)',
                  border: '1px solid hsl(0, 0%, 20%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
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
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={categoryColorMap.get(entry.category) || 'hsl(142, 76%, 36%)'} 
                    fillOpacity={0.8}
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
