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

export function SalesTrendChart({ data, title = "Revenue & Profit Trends" }: SalesTrendChartProps) {
  const [showSales, setShowSales] = useState(true);
  const [showProfit, setShowProfit] = useState(true);

  if (data.length === 0) return null;

  return (
    <Card className="bg-card border-border/50 animate-fade-in">
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
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                tickLine={{ stroke: 'hsl(0, 0%, 15%)' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                tickLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                tickFormatter={(v) => formatCurrencyShort(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 4%)',
                  border: '1px solid hsl(0, 0%, 20%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                labelStyle={{ color: 'hsl(0, 0%, 65%)' }}
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
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}
              {showProfit && (
                <Area
                  name="Profit"
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(38, 92%, 50%)"
                  strokeWidth={2}
                  fill="url(#profitGradient)"
                  isAnimationActive={true}
                  animationDuration={1200}
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
