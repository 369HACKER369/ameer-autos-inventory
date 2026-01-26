import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatCurrency } from './currency';
import { formatDateRange } from './dateUtils';
import type { DateRange, ReportSummary, Part, Sale, Brand, Category } from '@/types';

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

/**
 * Export report to PDF
 */
export async function exportReportToPDF(
  range: DateRange,
  summary: ReportSummary | null,
  topParts: any[],
  salesByDate: any[],
  parts: Part[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(22, 101, 52); // Green-800
  doc.text('Ameer Autos', 14, 22);

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('Inventory & Sales Manager', 14, 28);

  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('Sales Report', 14, 45);

  doc.setFontSize(10);
  doc.text(`Period: ${formatDateRange(range)}`, 14, 52);
  doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 57);

  // Summary section
  if (summary) {
    doc.setFontSize(14);
    doc.text('Summary Statistics', 14, 75);

    autoTable(doc, {
      startY: 80,
      head: [['Metric', 'Value']],
      body: [
        ['Total Sales', formatCurrency(summary.totalSales)],
        ['Total Profit', formatCurrency(summary.totalProfit)],
        ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`],
        ['Items Sold', summary.itemsSold.toString()],
        ['Avg Sale Value', formatCurrency(summary.averageSaleValue)],
        ['Sales Count', summary.salesCount.toString()],
      ],
      theme: 'striped',
      headStyles: { fillColor: [22, 101, 52] },
    });
  }

  // Top Selling Parts
  if (topParts.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY || 130;
    doc.setFontSize(14);
    doc.text('Top Selling Parts', 14, finalY + 15);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Rank', 'Part Name', 'SKU', 'Qty Sold', 'Revenue', 'Profit']],
      body: topParts.map((p, i) => {
        const part = parts.find(item => item.id === p.partId);
        const name = p.partName || part?.name || 'Unknown';
        const sku = p.sku || part?.sku || 'N/A';

        return [
          (i + 1).toString(),
          name,
          sku,
          p.quantitySold.toString(),
          formatCurrency(p.totalRevenue),
          formatCurrency(p.totalProfit),
        ];
      }),
      theme: 'striped',
      headStyles: { fillColor: [22, 101, 52] },
    });
  }

  // Sales by Date
  if (salesByDate.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY || 200;

    // Check if we need a new page
    if (finalY > 220) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Daily Sales Summary', 14, 22);
      autoTable(doc, {
        startY: 30,
        head: [['Date', 'Sales', 'Profit']],
        body: salesByDate.map(d => [
          d.date,
          formatCurrency(d.sales),
          formatCurrency(d.profit),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [22, 101, 52] },
      });
    } else {
      doc.setFontSize(14);
      doc.text('Daily Sales Summary', 14, finalY + 15);
      autoTable(doc, {
        startY: finalY + 20,
        head: [['Date', 'Sales', 'Profit']],
        body: salesByDate.map(d => [
          d.date,
          formatCurrency(d.sales),
          formatCurrency(d.profit),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [22, 101, 52] },
      });
    }
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount} - Ameer Autos Inventory & Sales Manager`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  const filename = `ameer-autos-report-${range.label.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

/**
 * Export report to Excel
 */
export async function exportReportToExcel(
  range: DateRange,
  sales: Sale[],
  parts: Part[]
) {
  const workbook = XLSX.utils.book_new();

  // Summary Page
  const summaryData = [
    ['Ameer Autos - Sales Report'],
    ['Period:', range.label],
    ['Date Range:', formatDateRange(range)],
    ['Exported on:', new Date().toLocaleString()],
    [],
    ['Sale ID', 'Date', 'Part Name', 'SKU', 'Quantity', 'Unit Price', 'Total Amount', 'Buying Price', 'Profit', 'Customer']
  ];

  sales.forEach(s => {
    // Join with parts data if denormalized fields are missing
    const part = parts.find(p => p.id === s.partId);
    const name = s.partName || part?.name || 'Unknown Part';
    const sku = s.partSku || part?.sku || 'N/A';

    summaryData.push([
      s.id,
      new Date(s.createdAt).toLocaleString(),
      name,
      sku,
      s.quantity.toString(),
      s.unitPrice.toString(),
      s.totalAmount.toString(),
      s.buyingPrice.toString(),
      s.profit.toString(),
      s.customerName || ''
    ]);
  });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Sales Report');

  // Also add a Parts list sheet for reference
  const partsData = [
    ['Part Name', 'SKU', 'Current Stock', 'Buying Price', 'Selling Price', 'Location']
  ];
  parts.forEach(p => {
    partsData.push([
      p.name,
      p.sku,
      p.quantity.toString(),
      p.buyingPrice.toString(),
      p.sellingPrice.toString(),
      p.location || ''
    ]);
  });
  const partsSheet = XLSX.utils.aoa_to_sheet(partsData);
  XLSX.utils.book_append_sheet(workbook, partsSheet, 'Current Inventory');

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  const filename = `ameer-autos-report-${range.label.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`;
  saveAs(blob, filename);
}

/**
 * Export report to CSV
 */
export async function exportReportToCSV(
  range: DateRange,
  sales: Sale[],
  parts: Part[]
) {
  const headers = ['Sale ID', 'Date', 'Part Name', 'SKU', 'Quantity', 'Unit Price', 'Total Amount', 'Buying Price', 'Profit', 'Customer'];

  const rows = sales.map(s => {
    const part = parts.find(p => p.id === s.partId);
    const name = s.partName || part?.name || 'Unknown';
    const sku = s.partSku || part?.sku || 'N/A';

    return [
      s.id,
      new Date(s.createdAt).toISOString(),
      name,
      sku,
      s.quantity,
      s.unitPrice,
      s.totalAmount,
      s.buyingPrice,
      s.profit,
      s.customerName || ''
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `ameer-autos-report-${range.label.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
  saveAs(blob, filename);
}
