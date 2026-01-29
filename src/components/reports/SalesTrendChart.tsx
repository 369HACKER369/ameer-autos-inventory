import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatCurrencyShort } from '@/utils/currency';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface SalesTrendData {
  date: string;
  sales: number;
  profit: number;
}

interface SalesTrendChartProps {
  data: SalesTrendData[];
  title?: string;
}

// Consistent chart colors - Sales=Green, Profit=Blue
const CHART_COLORS = {
  sales: {
    light: 'hsl(152, 45%, 42%)',
    dark: 'hsl(152, 40%, 48%)',
  },
  profit: {
    light: 'hsl(210, 65%, 50%)',
    dark: 'hsl(210, 55%, 55%)',
  },
};

export function SalesTrendChart({ data, title = "Revenue & Profit Trends" }: SalesTrendChartProps) {
  const [showSales, setShowSales] = useState(true);
  const [showProfit, setShowProfit] = useState(true);

  if (data.length === 0) return null;

  // Check if we're in dark mode
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDark ? 'hsl(220, 12%, 22%)' : 'hsl(220, 14%, 88%)';
  const textColor = isDark ? 'hsl(220, 10%, 55%)' : 'hsl(220, 10%, 46%)';
  const tooltipBg = isDark ? 'hsl(220, 16%, 12%)' : 'hsl(0, 0%, 100%)';
  const tooltipBorder = isDark ? 'hsl(220, 12%, 22%)' : 'hsl(220, 14%, 88%)';

  return (
    <Card className="bg-card border-border/50 card-shadow animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setShowSales(!showSales)}
            >
              {showSales ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
              Revenue
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setShowProfit(!showProfit)}
            >
              {showProfit ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
              Profit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                {/* Sales gradient - Green (muted, soft) */}
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? CHART_COLORS.sales.dark : CHART_COLORS.sales.light} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isDark ? CHART_COLORS.sales.dark : CHART_COLORS.sales.light} stopOpacity={0.02} />
                </linearGradient>
                {/* Profit gradient - Blue (muted, soft) */}
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? CHART_COLORS.profit.dark : CHART_COLORS.profit.light} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isDark ? CHART_COLORS.profit.dark : CHART_COLORS.profit.light} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: textColor }}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: textColor }}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
                tickFormatter={(v) => formatCurrencyShort(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                labelStyle={{ color: textColor }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                iconType="circle"
              />
              {showSales && (
                <Area
                  name="Revenue"
                  type="monotone"
                  dataKey="sales"
                  stroke={isDark ? CHART_COLORS.sales.dark : CHART_COLORS.sales.light}
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              )}
              {showProfit && (
                <Area
                  name="Profit"
                  type="monotone"
                  dataKey="profit"
                  stroke={isDark ? CHART_COLORS.profit.dark : CHART_COLORS.profit.light}
                  strokeWidth={2}
                  fill="url(#profitGradient)"
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
