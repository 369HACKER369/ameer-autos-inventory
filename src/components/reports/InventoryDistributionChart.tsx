import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatCurrencyShort } from '@/utils/currency';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface DistributionData {
  name: string;
  value: number;
}

interface InventoryDistributionChartProps {
  categoryData: DistributionData[];
  brandData: DistributionData[];
  title?: string;
}

const COLORS = [
  'hsl(142, 76%, 36%)', // Primary green
  'hsl(38, 92%, 50%)',  // Amber
  'hsl(200, 80%, 50%)', // Blue
  'hsl(280, 70%, 50%)', // Purple
  'hsl(0, 84%, 60%)',   // Red
  'hsl(160, 60%, 45%)', // Teal
  'hsl(320, 70%, 50%)', // Pink
  'hsl(45, 90%, 55%)',  // Yellow
];

export function InventoryDistributionChart({ 
  categoryData, 
  brandData,
  title = "Inventory Value Distribution" 
}: InventoryDistributionChartProps) {
  if (categoryData.length === 0 && brandData.length === 0) return null;

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (percent < 0.05) return null; // Hide labels for small slices
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="bg-card border-border/50 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <PieIcon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="category" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="category" className="text-xs">
              <PieIcon className="h-3 w-3 mr-1" />
              By Category
            </TabsTrigger>
            <TabsTrigger value="brand" className="text-xs">
              <BarChart3 className="h-3 w-3 mr-1" />
              By Brand
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="category">
            {categoryData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      labelLine={false}
                      label={CustomLabel}
                      isAnimationActive={true}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {categoryData.map((_, index) => (
                        <Cell 
                          key={index} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="hsl(0, 0%, 4%)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 4%)',
                        border: '1px solid hsl(0, 0%, 20%)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Value']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {categoryData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                No category data available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="brand">
            {brandData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brandData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(0, 0%, 15%)" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                      axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                      tickFormatter={(v) => formatCurrencyShort(v)}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                      axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 4%)',
                        border: '1px solid hsl(0, 0%, 20%)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Value']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(142, 76%, 36%)" 
                      radius={[0, 4, 4, 0]}
                      isAnimationActive={true}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                No brand data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
