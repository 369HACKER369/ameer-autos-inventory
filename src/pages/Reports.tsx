import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { db } from '@/db/database';
import { getSalesSummary, getTopSellingParts } from '@/services/salesService';
import { formatCurrency, formatCurrencyShort } from '@/utils/currency';
import { getDateRanges, formatDateRange } from '@/utils/dateUtils';
import { toSafeNumber, toSafeQuantity, safeAdd } from '@/utils/safeNumber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package,
  Coins,
  FileDown,
  FileSpreadsheet,
  FileText,
  Loader2,
  BarChart3,
  Activity
} from 'lucide-react';
import type { DateRange, ReportSummary } from '@/types';
import { useEffect, useState as useReactState } from 'react';
import {
  exportReportToPDF,
  exportReportToExcel,
  exportReportToCSV
} from '@/utils/exportUtils';
import { toast } from 'sonner';

const CHART_COLORS = ['hsl(142, 76%, 36%)', 'hsl(0, 0%, 65%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(200, 80%, 50%)'];

export default function Reports() {
  const dateRanges = getDateRanges();
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(4); // This Month
  const [summary, setSummary] = useReactState<ReportSummary | null>(null);
  const [topParts, setTopParts] = useReactState<{
    partId: string;
    partName: string;
    sku: string;
    quantitySold: number;
    totalRevenue: number;
    totalProfit: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const selectedRange = dateRanges[selectedRangeIndex];

  // Live queries
  const sales = useLiveQuery(() => db.sales.toArray(), []) ?? [];
  const parts = useLiveQuery(() => db.parts.toArray(), []) ?? [];
  const categories = useLiveQuery(() => db.categories.toArray(), []) ?? [];
  const brands = useLiveQuery(() => db.brands.toArray(), []) ?? [];

  // Fetch summary data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryData, topPartsData] = await Promise.all([
          getSalesSummary(selectedRange),
          getTopSellingParts(selectedRange, 5),
        ]);
        setSummary(summaryData);
        setTopParts(topPartsData);
      } catch (error) {
        console.error('Failed to fetch report data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedRange]);

  // Sales and Profit by date for chart - with safe number operations
  const salesByDate = useMemo(() => {
    const filtered = sales.filter(s => {
      const saleDate = new Date(s.createdAt);
      return saleDate >= selectedRange.startDate && saleDate <= selectedRange.endDate;
    });

    const grouped = new Map<string, { sales: number; profit: number; quantity: number }>();
    
    for (const sale of filtered) {
      const dateKey = new Date(sale.createdAt).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short' 
      });
      const existing = grouped.get(dateKey) || { sales: 0, profit: 0, quantity: 0 };
      grouped.set(dateKey, {
        sales: safeAdd(existing.sales, toSafeNumber(sale.totalAmount, 0)),
        profit: safeAdd(existing.profit, toSafeNumber(sale.profit, 0)),
        quantity: safeAdd(existing.quantity, toSafeQuantity(sale.quantity, 0)),
      });
    }

    return Array.from(grouped.entries()).map(([date, data]) => ({
      date,
      sales: data.sales,
      profit: data.profit,
      quantity: data.quantity,
    }));
  }, [sales, selectedRange]);

  // Filtered sales for current range
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const saleDate = new Date(s.createdAt);
      return saleDate >= selectedRange.startDate && saleDate <= selectedRange.endDate;
    });
  }, [sales, selectedRange]);

  // Sales by category for pie chart - with safe number operations
  const salesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    for (const sale of filteredSales) {
      const part = parts.find(p => p.id === sale.partId);
      if (part) {
        const category = categories.find(c => c.id === part.categoryId);
        const catName = category?.name || 'Uncategorized';
        const currentValue = toSafeNumber(categoryMap.get(catName), 0);
        categoryMap.set(catName, safeAdd(currentValue, toSafeNumber(sale.totalAmount, 0)));
      }
    }

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredSales, parts, categories]);

  // Brand performance for bar chart - with safe number operations
  const brandPerformance = useMemo(() => {
    const brandMap = new Map<string, number>();

    for (const sale of filteredSales) {
      const part = parts.find(p => p.id === sale.partId);
      if (part) {
        const brand = brands.find(b => b.id === part.brandId);
        const bName = brand?.name || 'Unknown';
        const currentValue = toSafeNumber(brandMap.get(bName), 0);
        brandMap.set(bName, safeAdd(currentValue, toSafeNumber(sale.totalAmount, 0)));
      }
    }

    return Array.from(brandMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredSales, parts, brands]);

  return (
    <AppLayout>
      <Header 
        title="Reports" 
        subtitle={formatDateRange(selectedRange)}
      />

      <div className="p-4 space-y-4 pb-24">
        {/* Date Range Selector */}
        <Select 
          value={selectedRangeIndex.toString()} 
          onValueChange={(v) => setSelectedRangeIndex(parseInt(v))}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range, index) => (
              <SelectItem key={index} value={index.toString()}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Total Sales</span>
              </div>
              <p className="text-lg font-bold">
                {loading ? '...' : formatCurrencyShort(summary?.totalSales || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Total Profit</span>
              </div>
              <p className="text-lg font-bold text-primary">
                {loading ? '...' : formatCurrencyShort(summary?.totalProfit || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Items Sold</span>
              </div>
              <p className="text-lg font-bold">
                {loading ? '...' : summary?.itemsSold || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Profit Margin</span>
              </div>
              <p className="text-lg font-bold">
                {loading ? '...' : `${(summary?.profitMargin || 0).toFixed(1)}%`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales & Profit Chart */}
        {salesByDate.length > 0 && (
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Revenue & Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                      axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                      axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                      tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0, 0%, 4%)', 
                        border: '1px solid hsl(0, 0%, 15%)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Line 
                      name="Revenue"
                      type="monotone" 
                      dataKey="sales" 
                      stroke="hsl(142, 76%, 36%)" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      name="Profit"
                      type="monotone"
                      dataKey="profit"
                      stroke="hsl(38, 92%, 50%)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brand Performance */}
        {brandPerformance.length > 0 && (
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Brand Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brandPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(0, 0%, 15%)" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                      axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                      tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
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
                        border: '1px solid hsl(0, 0%, 15%)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Sales']}
                    />
                    <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Pie Chart */}
        {salesByCategory.length > 0 && (
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {salesByCategory.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0, 0%, 4%)', 
                        border: '1px solid hsl(0, 0%, 15%)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stock Movement Area Chart */}
        {salesByDate.length > 0 && (
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Stock Movement (Items Sold)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                      axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'hsl(0, 0%, 65%)' }}
                      axisLine={{ stroke: 'hsl(0, 0%, 15%)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 4%)',
                        border: '1px solid hsl(0, 0%, 15%)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="quantity"
                      name="Items Sold"
                      stroke="hsl(200, 80%, 50%)"
                      fill="hsl(200, 80%, 50%, 0.2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Selling Parts */}
        {topParts.length > 0 && (
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Selling Parts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topParts.map((part, index) => (
                  <div key={part.partId} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-5">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{part.partName}</p>
                        <p className="text-xs text-muted-foreground">{part.quantitySold} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatCurrency(part.totalRevenue)}</p>
                      <p className="text-xs text-primary">+{formatCurrency(part.totalProfit)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex-col h-auto py-3"
            onClick={async () => {
              setIsExporting('pdf');
              try {
                await exportReportToPDF(selectedRange, summary, topParts, salesByDate, parts);
                toast.success('PDF report exported');
              } catch (error) {
                toast.error('Failed to export PDF');
              } finally {
                setIsExporting(null);
              }
            }}
            disabled={isExporting !== null || loading}
          >
            {isExporting === 'pdf' ? (
              <Loader2 className="h-5 w-5 mb-1 animate-spin" />
            ) : (
              <FileText className="h-5 w-5 mb-1 text-red-500" />
            )}
            <span className="text-xs">PDF</span>
          </Button>

          <Button
            variant="outline"
            className="flex-col h-auto py-3"
            onClick={async () => {
              setIsExporting('excel');
              try {
                await exportReportToExcel(selectedRange, filteredSales, parts);
                toast.success('Excel report exported');
              } catch (error) {
                toast.error('Failed to export Excel');
              } finally {
                setIsExporting(null);
              }
            }}
            disabled={isExporting !== null || loading}
          >
            {isExporting === 'excel' ? (
              <Loader2 className="h-5 w-5 mb-1 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-5 w-5 mb-1 text-green-500" />
            )}
            <span className="text-xs">Excel</span>
          </Button>

          <Button
            variant="outline"
            className="flex-col h-auto py-3"
            onClick={async () => {
              setIsExporting('csv');
              try {
                await exportReportToCSV(selectedRange, filteredSales, parts);
                toast.success('CSV report exported');
              } catch (error) {
                toast.error('Failed to export CSV');
              } finally {
                setIsExporting(null);
              }
            }}
            disabled={isExporting !== null || loading}
          >
            {isExporting === 'csv' ? (
              <Loader2 className="h-5 w-5 mb-1 animate-spin" />
            ) : (
              <FileDown className="h-5 w-5 mb-1 text-blue-500" />
            )}
            <span className="text-xs">CSV</span>
          </Button>
        </div>

        {/* Empty State */}
        {!loading && sales.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No sales data yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Start recording sales to see reports
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
