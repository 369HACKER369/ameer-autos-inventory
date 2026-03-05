import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { BillSettings, Bill, BillItem } from '@/types/bill';

export function generateBillPdf(
  settings: BillSettings,
  bill: Bill,
  items: BillItem[],
): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = 0;

  // === TOP BANNER (dark background) ===
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold diagonal accent
  doc.setFillColor(218, 165, 32);
  // Simple gold bar on right
  doc.rect(pageWidth - 80, 0, 80, 42, 'F');

  // Gold wave accent at bottom of banner
  doc.setFillColor(218, 165, 32);
  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(1.5);
  doc.line(0, 42, pageWidth, 42);

  // Shop name in banner
  const initials = settings.shopName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  
  // Logo circle
  if (!settings.logoPath) {
    doc.setFillColor(218, 165, 32);
    doc.circle(margin + 10, 21, 10, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(initials, margin + 10, 24, { align: 'center' });
  }

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(settings.shopName, margin + 24, 20);

  if (settings.tagline) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text(settings.tagline, margin + 24, 27);
  }

  // INVOICE text on gold area
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('INVOICE', pageWidth - 40, 26, { align: 'center' });

  // === SHOP DETAILS ===
  y = 52;
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice To:', margin, y);
  doc.text(`Invoice No: ${bill.billNumber}`, pageWidth - margin, y, { align: 'right' });
  
  y += 5;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(settings.shopName, margin, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Date: ${new Date(bill.date).toLocaleDateString('en-PK')}`, pageWidth - margin, y, { align: 'right' });

  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text(settings.address, margin, y);
  
  y += 5;
  const contactLine = [settings.phone1, settings.phone2].filter(Boolean).join(' | ');
  doc.setFont('helvetica', 'bold');
  doc.text(contactLine, margin, y);

  // Divider
  y += 6;
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  // === CUSTOMER BOX ===
  y += 4;
  // Gold header bar
  doc.setFillColor(255, 248, 225);
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');
  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('Invoice To :', margin + 4, y + 5.5);
  doc.text(`Invoice No: ${bill.billNumber}`, pageWidth - margin - 4, y + 5.5, { align: 'right' });

  y += 12;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(bill.buyerName, margin + 4, y);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text(`Date : ${new Date(bill.date).toLocaleDateString('en-PK')}`, pageWidth - margin - 4, y, { align: 'right' });
  
  if (bill.buyerPhone) {
    y += 5;
    doc.text(`Phone: ${bill.buyerPhone}`, margin + 4, y);
  }

  // === ITEMS TABLE ===
  y += 6;
  autoTable(doc, {
    startY: y,
    head: [['#', 'Part Name', 'Code', 'Brand', 'Qty', 'Price (Rs)', 'Total (Rs)']],
    body: items.map((item, i) => [
      i + 1,
      item.partName,
      item.partCode || '-',
      item.brand || '-',
      item.quantity,
      item.price.toLocaleString(),
      item.total.toLocaleString(),
    ]),
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'left' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center', cellWidth: 14 },
      5: { halign: 'right' },
      6: { halign: 'right' },
    },
    alternateRowStyles: { fillColor: [249, 249, 249] },
    theme: 'grid',
  });

  // === TOTALS ===
  y = (doc as any).lastAutoTable.finalY + 4;
  const totalsX = pageWidth - margin;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40);

  // Subtotal
  doc.text(`Subtotal :`, totalsX - 50, y, { align: 'right' });
  doc.text(`Rs ${bill.subtotal.toLocaleString()}`, totalsX, y, { align: 'right' });
  y += 6;

  // Discount
  if (bill.discount > 0) {
    doc.text(`Discount :`, totalsX - 50, y, { align: 'right' });
    doc.text(`Rs ${bill.discount.toLocaleString()}`, totalsX, y, { align: 'right' });
    y += 6;
  }

  // Grand Total bar
  y += 2;
  const gtBarWidth = 130;
  const gtBarX = pageWidth - margin - gtBarWidth;
  doc.setFillColor(218, 165, 32);
  doc.rect(gtBarX, y - 5, gtBarWidth, 12, 'F');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('GRAND TOTAL :', gtBarX + 8, y + 2);
  doc.text(`Rs ${bill.finalTotal.toLocaleString()}`, pageWidth - margin - 4, y + 2, { align: 'right' });

  // === TERMS & PAYMENT ===
  const showPayment = bill.showPaymentInfo ?? settings.showPaymentInfo;
  const paymentInfo = bill.paymentInfo ?? settings.paymentInfo;
  const showTerms = bill.showTerms ?? settings.showTerms;
  const terms = bill.termsConditions ?? settings.termsConditions;

  if (showTerms || showPayment) {
    y += 18;
    const colWidth = (pageWidth - margin * 2 - 10) / 2;

    if (showTerms && terms && terms.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(218, 165, 32);
      doc.text('TERMS & CONDITIONS', margin, y);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      terms.forEach((t, i) => {
        y += 5;
        doc.text(`• ${t}`, margin + 2, y);
      });
    }

    if (showPayment && paymentInfo) {
      let py = (doc as any).lastAutoTable.finalY + 34;
      const px = showTerms ? margin + colWidth + 10 : margin;
      if (!showTerms) py = y - 18 + 18;
      
      // Payment box
      doc.setDrawColor(218, 165, 32);
      doc.setLineWidth(0.5);
      const boxY = py - 5;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(218, 165, 32);
      doc.text('PAYMENT INFORMATION', px + 2, py);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      let pLine = py + 5;
      if (paymentInfo.bankName) { doc.text(`• Bank Name: ${paymentInfo.bankName}`, px + 4, pLine); pLine += 5; }
      if (paymentInfo.accountTitle) { doc.text(`• Account Title: ${paymentInfo.accountTitle}`, px + 4, pLine); pLine += 5; }
      if (paymentInfo.accountNumber) { doc.text(`• Account No. ${paymentInfo.accountNumber}`, px + 4, pLine); pLine += 5; }
      if (paymentInfo.iban) { doc.text(`• IBAN: ${paymentInfo.iban}`, px + 4, pLine); pLine += 5; }
      if (paymentInfo.easypaisaNumber) { doc.text(`• EasyPaisa: ${paymentInfo.easypaisaNumber}`, px + 4, pLine); pLine += 5; }
      if (paymentInfo.jazzcashNumber) { doc.text(`• JazzCash: ${paymentInfo.jazzcashNumber}`, px + 4, pLine); pLine += 5; }
      
      doc.rect(px, boxY, colWidth, pLine - boxY + 2, 'S');
      y = Math.max(y, pLine);
    }
  }

  // === NOTES ===
  if (bill.notes) {
    y += 12;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80);
    doc.text(`Notes: ${bill.notes}`, margin, y);
  }

  // === FOOTER MESSAGE ===
  if (settings.footerMessage) {
    y += 16;
    doc.setDrawColor(180);
    doc.setLineWidth(0.2);
    doc.line(margin + 40, y - 4, pageWidth - margin - 40, y - 4);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(settings.footerMessage, pageWidth / 2, y, { align: 'center' });
  }

  // === BOTTOM BAR ===
  const barH = 14;
  const barY = pageHeight - barH;
  doc.setFillColor(26, 26, 26);
  doc.rect(0, barY, pageWidth, barH, 'F');
  doc.setFontSize(8);
  doc.setTextColor(180);
  doc.setFont('helvetica', 'normal');
  const footerParts = [settings.phone1, settings.phone2].filter(Boolean);
  const footerText = footerParts.join('  |  ');
  doc.text(footerText, pageWidth / 2, barY + 9, { align: 'center' });

  return doc;
}
