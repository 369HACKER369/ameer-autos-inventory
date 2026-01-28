import { useState, useMemo, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { db } from '@/db/database';
import { getSalesSummary, getTopSellingParts } from '@/services/salesService';
import { getInventoryValue } from '@/services/inventoryService';
import { formatCurrency, formatCurrencyShort } from '@/utils/currency';
import { getDateRanges, formatDateRange } from '@/utils/dateUtils';
import { toSafeNumber, toSafeQuantity, safeAdd, safeDivide } from '@/utils/safeNumber';
import { Button } from '@/components/ui/button';
import {
  KPICard,
  SalesTrendChart,
  InventoryDistributionChart,
  LowStockChart,
  ProductPerformanceChart,
  SalesHeatmap,
  TimeRangeSelector,
  TopSellingParts,
} from '@/components/reports';
import {
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  Activity,
  FileText,
  FileSpreadsheet,
  FileDown,
  Loader2,
} from 'lucide-react';
import type { DateRange, ReportSummary } from '@/types';
import { useEffect, useState as useReactState } from 'react';
import {
  exportReportToPDF,
  exportReportToExcel,
  exportReportToCSV
} from '@/utils/exportUtils';
import { toast } from 'sonner';
import { startOfDay, endOfDay } from 'date-fns';

export default function Reports() {
  const dateRanges = getDateRanges();
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(4); // This Month
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [summary, setSummary] = useReactState<ReportSummary | null>(null);
  const [topParts, setTopParts] = useReactState<{
    partId: string;
    partName: string;
    sku: string;
    quantitySold: number;
    totalRevenue: number;
    totalProfit: number;
  }[]>([]);
  const [inventoryValue, setInventoryValue] = useState<{ cost: number; retail: number }>({ cost: 0, retail: 0 });
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Determine active date range (custom or preset)
  const selectedRange = useMemo((): DateRange => {
    if (customStartDate && customEndDate) {
      return {
        label: 'Custom Range',
        startDate: startOfDay(customStartDate),
        endDate: endOfDay(customEndDate),
      };
    }
    return dateRanges[selectedRangeIndex];
  }, [dateRanges, selectedRangeIndex, customStartDate, customEndDate]);

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
        const [summaryData, topPartsData, invValue] = await Promise.all([
          getSalesSummary(selectedRange),
          getTopSellingParts(selectedRange, 5),
          getInventoryValue(),
        ]);
        setSummary(summaryData);
        setTopParts(topPartsData);
        setInventoryValue(invValue);
      } catch (error) {
        console.error('Failed to fetch report data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedRange]);

  // Filtered sales for current range
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const saleDate = new Date(s.createdAt);
      return saleDate >= selectedRange.startDate && saleDate <= selectedRange.endDate;
    });
  }, [sales, selectedRange]);

  // Sales and Profit by date for chart
  const salesByDate = useMemo(() => {
    const grouped = new Map<string, { sales: number; profit: number; quantity: number }>();
    
    for (const sale of filteredSales) {
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
  }, [filteredSales]);

  // Sparkline data for KPIs
  const salesSparkline = useMemo(() => {
    return salesByDate.map(d => ({ value: d.sales }));
  }, [salesByDate]);

  const profitSparkline = useMemo(() => {
    return salesByDate.map(d => ({ value: d.profit }));
  }, [salesByDate]);

  // Calculate average daily sales
  const avgDailySales = useMemo(() => {
    if (salesByDate.length === 0) return 0;
    const totalSales = salesByDate.reduce((sum, d) => safeAdd(sum, d.sales), 0);
    return safeDivide(totalSales, salesByDate.length, 0);
  }, [salesByDate]);

  // Low stock count
  const lowStockCount = useMemo(() => {
    return parts.filter(p => toSafeQuantity(p.quantity, 0) <= toSafeQuantity(p.minStockLevel, 0)).length;
  }, [parts]);

  // Low stock items for chart
  const lowStockItems = useMemo(() => {
    return parts
      .filter(p => toSafeQuantity(p.quantity, 0) <= toSafeQuantity(p.minStockLevel, 0))
      .map(p => {
        const quantity = toSafeQuantity(p.quantity, 0);
        const minStock = toSafeQuantity(p.minStockLevel, 1);
        let urgency: 'critical' | 'warning' | 'near' = 'near';
        
        if (quantity === 0) {
          urgency = 'critical';
        } else if (quantity < minStock * 0.5) {
          urgency = 'warning';
        }
        
        return {
          name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
          quantity,
          minStock,
          urgency,
        };
      })
      .slice(0, 10);
  }, [parts]);

  // Inventory value by category
  const inventoryByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    for (const part of parts) {
      const category = categories.find(c => c.id === part.categoryId);
      const catName = category?.name || 'Uncategorized';
      const value = toSafeNumber(part.quantity, 0) * toSafeNumber(part.buyingPrice, 0);
      const currentValue = toSafeNumber(categoryMap.get(catName), 0);
      categoryMap.set(catName, safeAdd(currentValue, value));
    }

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [parts, categories]);

  // Inventory value by brand
  const inventoryByBrand = useMemo(() => {
    const brandMap = new Map<string, number>();

    for (const part of parts) {
      const brand = brands.find(b => b.id === part.brandId);
      const bName = brand?.name || 'Unknown';
      const value = toSafeNumber(part.quantity, 0) * toSafeNumber(part.buyingPrice, 0);
      const currentValue = toSafeNumber(brandMap.get(bName), 0);
      brandMap.set(bName, safeAdd(currentValue, value));
    }

    return Array.from(brandMap.entries())
      .map(([name, value]) => ({ name, value }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [parts, brands]);

  // Product performance matrix data
  const productPerformance = useMemo(() => {
    const partSalesMap = new Map<string, {
      name: string;
      unitsSold: number;
      revenue: number;
      profit: number;
      category: string;
    }>();

    for (const sale of filteredSales) {
      const part = parts.find(p => p.id === sale.partId);
      const category = part ? categories.find(c => c.id === part.categoryId)?.name || 'Other' : 'Other';
      
      const existing = partSalesMap.get(sale.partId);
      if (existing) {
        existing.unitsSold += toSafeQuantity(sale.quantity, 0);
        existing.revenue += toSafeNumber(sale.totalAmount, 0);
        existing.profit += toSafeNumber(sale.profit, 0);
      } else {
        partSalesMap.set(sale.partId, {
          name: sale.partName,
          unitsSold: toSafeQuantity(sale.quantity, 0),
          revenue: toSafeNumber(sale.totalAmount, 0),
          profit: toSafeNumber(sale.profit, 0),
          category,
        });
      }
    }

    return Array.from(partSalesMap.values())
      .filter(d => d.unitsSold > 0)
      .slice(0, 20);
  }, [filteredSales, parts, categories]);

  // Sales heatmap data
  const salesHeatmapData = useMemo(() => {
    const dailyMap = new Map<string, number>();
    
    for (const sale of filteredSales) {
      const dateStr = new Date(sale.createdAt).toISOString().split('T')[0];
      const currentValue = toSafeNumber(dailyMap.get(dateStr), 0);
      dailyMap.set(dateStr, safeAdd(currentValue, toSafeNumber(sale.totalAmount, 0)));
    }

    return Array.from(dailyMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredSales]);

  // Handle custom date change
  const handleCustomStartChange = useCallback((date: Date | undefined) => {
    setCustomStartDate(date);
    if (date && customEndDate && date > customEndDate) {
      setCustomEndDate(undefined);
    }
  }, [customEndDate]);

  const handleCustomEndChange = useCallback((date: Date | undefined) => {
    setCustomEndDate(date);
  }, []);

  const handleRangeChange = useCallback((index: number) => {
    setSelectedRangeIndex(index);
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
  }, []);

  // Export handlers
  const handleExportPDF = async () => {
    setIsExporting('pdf');
    try {
      // Prepare low stock items for export
      const lowStockForExport = lowStockItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        minStock: item.minStock,
      }));
      
      await exportReportToPDF(
        selectedRange, 
        summary, 
        topParts, 
        salesByDate, 
        parts,
        lowStockForExport,
        inventoryByCategory,
        inventoryByBrand
      );
      toast.success('PDF report exported successfully');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting('excel');
    try {
      await exportReportToExcel(selectedRange, filteredSales, parts, categories, brands);
      toast.success('Excel report exported successfully');
    } catch (error) {
      console.error('Excel export failed:', error);
      toast.error('Failed to export Excel');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting('csv');
    try {
      await exportReportToCSV(selectedRange, filteredSales, parts);
      toast.success('CSV report exported successfully');
    } catch (error) {
      console.error('CSV export failed:', error);
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <AppLayout>
      <Header 
        title="Reports" 
        subtitle={formatDateRange(selectedRange)}
      />

      <div className="p-4 space-y-5 pb-24">
        {/* Time Range Selector */}
        <TimeRangeSelector
          dateRanges={dateRanges}
          selectedRangeIndex={selectedRangeIndex}
          onRangeChange={handleRangeChange}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onCustomStartChange={handleCustomStartChange}
          onCustomEndChange={handleCustomEndChange}
        />

        {/* Executive Summary - KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          <KPICard
            title="Total Sales"
            value={summary?.totalSales || 0}
            icon={<ShoppingCart className="h-4 w-4 text-primary" />}
            sparklineData={salesSparkline}
            isCurrency
          />
          <KPICard
            title="Total Profit"
            value={summary?.totalProfit || 0}
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
            sparklineData={profitSparkline}
            isCurrency
          />
          <KPICard
            title="Inventory Value"
            value={inventoryValue.cost}
            icon={<Package className="h-4 w-4 text-primary" />}
            isCurrency
          />
          <KPICard
            title="Low Stock Items"
            value={lowStockCount}
            icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
          />
          <KPICard
            title="Avg Daily Sales"
            value={avgDailySales}
            icon={<Activity className="h-4 w-4 text-primary" />}
            isCurrency
            className="col-span-2"
          />
        </div>

        {/* Sales & Profit Trend */}
        {salesByDate.length > 0 && (
          <SalesTrendChart data={salesByDate} />
        )}

        {/* Inventory Distribution */}
        {(inventoryByCategory.length > 0 || inventoryByBrand.length > 0) && (
          <InventoryDistributionChart
            categoryData={inventoryByCategory}
            brandData={inventoryByBrand}
          />
        )}

        {/* Low Stock Risk Analysis */}
        {lowStockItems.length > 0 && (
          <LowStockChart data={lowStockItems} />
        )}

        {/* Product Performance Matrix */}
        {productPerformance.length > 0 && (
          <ProductPerformanceChart data={productPerformance} />
        )}

        {/* Sales Heatmap */}
        {salesHeatmapData.length > 0 && (
          <SalesHeatmap data={salesHeatmapData} />
        )}

        {/* Top Selling Parts */}
        {topParts.length > 0 && (
          <TopSellingParts data={topParts} />
        )}

        {/* Export Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex-col h-auto py-3 border-border/50 hover:border-primary/50"
            onClick={handleExportPDF}
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
            className="flex-col h-auto py-3 border-border/50 hover:border-primary/50"
            onClick={handleExportExcel}
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
            className="flex-col h-auto py-3 border-border/50 hover:border-primary/50"
            onClick={handleExportCSV}
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
