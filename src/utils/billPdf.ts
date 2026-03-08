import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { BillSettings, Bill, BillItem } from '@/types/bill';

const TEAL: [number, number, number] = [10, 92, 92];
const TEAL_DARK: [number, number, number] = [7, 63, 63];
const GOLD: [number, number, number] = [201, 149, 42];
const GOLD_LIGHT: [number, number, number] = [219, 176, 66];

/**
 * Converts a base64 data URL to a format jsPDF can use for addImage.
 * Returns { data, format } or null if not a valid image data URL.
 */
function parseLogoDataUrl(dataUrl: string): { data: string; format: string } | null {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return null;
  const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/);
  if (!match) return null;
  const format = match[1].toUpperCase() === 'JPG' ? 'JPEG' : match[1].toUpperCase();
  return { data: dataUrl, format };
}

export function generateBillPdf(
  settings: BillSettings,
  bill: Bill,
  items: BillItem[],
): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 15;
  let y = 0;

  const initials = settings.shopName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // ═══ HEADER BANNER ═══
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pw, 38, 'F');

  // Logo - Try to render the actual image
  const logoX = m + 12;
  const logoY = 19;
  const logoR = 11;
  let logoRendered = false;

  if (settings.logoPath) {
    const parsed = parseLogoDataUrl(settings.logoPath);
    if (parsed) {
      try {
        // Draw circular clip background
        doc.setFillColor(255, 255, 255);
        doc.circle(logoX, logoY, logoR + 1, 'F');
        doc.setDrawColor(...GOLD);
        doc.setLineWidth(0.8);
        doc.circle(logoX, logoY, logoR + 1, 'S');
        
        // Add the logo image (square inscribed in circle)
        const imgSize = logoR * 1.5;
        doc.addImage(parsed.data, parsed.format, logoX - imgSize / 2, logoY - imgSize / 2, imgSize, imgSize);
        logoRendered = true;
      } catch (e) {
        console.warn('PDF logo rendering failed, using initials fallback:', e);
      }
    }
  }

  if (!logoRendered) {
    // Fallback: gold circle with initials
    doc.setFillColor(...GOLD);
    doc.circle(logoX, logoY, logoR, 'F');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(initials, logoX, logoY + 4, { align: 'center' });
  }

  // Shop name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(settings.shopName.toUpperCase(), m + 28, 18);

  // Tagline
  if (settings.tagline) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 230, 230);
    doc.text(settings.tagline, m + 28, 25);
  }

  // Header right: contact
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 230, 230);
  let hy = 15;
  if (settings.phone1) { doc.text(settings.phone1, pw - m, hy, { align: 'right' }); hy += 4.5; }
  if (settings.address) { doc.text(settings.address, pw - m, hy, { align: 'right', maxWidth: 60 }); }

  // ═══ GOLD SEPARATOR ═══
  y = 38;
  doc.setFillColor(...GOLD);
  doc.rect(0, y, pw, 2.5, 'F');
  y += 2.5;

  // ═══ Invoice From strip ═══
  doc.setFillColor(247, 246, 242);
  doc.rect(0, y, pw, 9, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(136);
  doc.text('Invoice From :', m, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26);
  doc.text(settings.shopName.toUpperCase(), m + 28, y + 6);
  if (settings.ownerName) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(136);
    doc.text(`Owner: ${settings.ownerName}`, pw - m, y + 6, { align: 'right' });
  }
  y += 12;

  // ═══ BUYER / INVOICE INFO ═══
  const halfW = (pw - m * 2) / 2;

  // Left: Invoice To header
  doc.setFillColor(...TEAL);
  doc.rect(m, y, halfW, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE TO :', m + 4, y + 5.5);

  // Right: Invoice No header
  doc.setFillColor(...TEAL);
  doc.rect(m + halfW, y, halfW, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE NO :', pw - m - 55, y + 5.5);
  doc.setTextColor(...GOLD_LIGHT);
  doc.text(bill.billNumber, pw - m - 4, y + 5.5, { align: 'right' });

  y += 8;

  // Gold top border on boxes
  doc.setFillColor(...GOLD);
  doc.rect(m, y, halfW, 1.5, 'F');
  doc.rect(m + halfW, y, halfW, 1.5, 'F');
  y += 1.5;

  // Left box content
  doc.setDrawColor(226, 224, 218);
  doc.rect(m, y, halfW, 16, 'S');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26);
  doc.text(bill.buyerName.toUpperCase(), m + 4, y + 7);
  if (bill.buyerPhone) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(85);
    doc.text(`Phone: ${bill.buyerPhone}`, m + 4, y + 12);
  }

  // Right box content
  doc.rect(m + halfW, y, halfW, 16, 'S');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);
  doc.text(`Date : ${new Date(bill.date).toLocaleDateString('en-PK')}`, pw - m - 4, y + 7, { align: 'right' });
  if (bill.notes) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(136);
    doc.text(`Notes: ${bill.notes}`, pw - m - 4, y + 12, { align: 'right', maxWidth: halfW - 8 });
  }

  y += 20;

  // ═══ ITEMS TABLE ═══
  autoTable(doc, {
    startY: y,
    head: [['#', 'Part Name', 'Code', 'Brand', 'QTY', 'Price (RS)', 'Total (RS)']],
    body: items.map((item, i) => [
      i + 1,
      item.partName,
      item.partCode || '-',
      item.brand || '-',
      item.quantity,
      item.price.toLocaleString(),
      item.total.toLocaleString(),
    ]),
    margin: { left: m, right: m },
    styles: { fontSize: 10, cellPadding: 3.5 },
    headStyles: {
      fillColor: TEAL,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 9,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'left' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center', cellWidth: 14 },
      5: { halign: 'right' },
      6: { halign: 'right' },
    },
    alternateRowStyles: { fillColor: [247, 246, 242] },
    theme: 'grid',
    tableLineColor: [226, 224, 218],
    tableLineWidth: 0.2,
  });

  // ═══ TOTALS ═══
  y = (doc as any).lastAutoTable.finalY + 2;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(85);
  doc.text('Subtotal :', pw - m - 55, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26);
  doc.text(`Rs ${bill.subtotal.toLocaleString()}`, pw - m, y + 5, { align: 'right' });

  if (bill.discount > 0) {
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(85);
    doc.text('Discount :', pw - m - 55, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(192, 57, 43);
    doc.text(`- ${bill.discount.toLocaleString()}`, pw - m, y + 5, { align: 'right' });
  }

  // Grand Total bar
  y += 12;
  const barW = 120;
  const barX = pw - m - barW;
  const splitAt = barW * 0.55;

  doc.setFillColor(...GOLD);
  doc.rect(barX, y, splitAt, 12, 'F');
  doc.setFillColor(...TEAL);
  doc.rect(barX + splitAt, y, barW - splitAt, 12, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26);
  doc.text('GRAND TOTAL :', barX + 6, y + 8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Rs ${bill.finalTotal.toLocaleString()}`, pw - m - 4, y + 8, { align: 'right' });

  // ═══ TERMS & PAYMENT ═══
  const showPayment = bill.showPaymentInfo ?? settings.showPaymentInfo;
  const paymentInfo = bill.paymentInfo ?? settings.paymentInfo;
  const showTerms = bill.showTerms ?? settings.showTerms;
  const terms = bill.termsConditions ?? settings.termsConditions;

  if (showTerms || showPayment) {
    y += 20;
    const colW = (pw - m * 2 - 10) / 2;

    if (showTerms && terms && terms.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...TEAL);
      doc.text('TERMS & CONDITIONS', m, y);
      doc.setFillColor(...GOLD);
      doc.rect(m, y + 1.5, 45, 0.8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(85);
      let ty = y + 7;
      terms.forEach(t => {
        if (ty < ph - 40) {
          doc.text(`• ${t}`, m + 2, ty);
          ty += 5;
        }
      });
    }

    if (showPayment && paymentInfo) {
      const px = showTerms ? m + colW + 10 : m;
      let py = y;
      const boxH = 42;

      doc.setDrawColor(...TEAL);
      doc.setLineWidth(0.5);
      doc.roundedRect(px, py - 4, colW, boxH, 2, 2, 'S');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...TEAL);
      doc.text('PAYMENT INFORMATION', px + 4, py);
      doc.setFillColor(...GOLD);
      doc.rect(px + 4, py + 1.5, 50, 0.8, 'F');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(85);
      let pl = py + 7;
      const addLine = (label: string, val: string) => {
        if (val) { doc.text(`• ${label}: ${val}`, px + 6, pl); pl += 5; }
      };
      addLine('Bank Name', paymentInfo.bankName);
      addLine('Account Name', paymentInfo.accountTitle);
      addLine('Account No', paymentInfo.accountNumber);
      addLine('IBAN', paymentInfo.iban);
      addLine('EasyPaisa', paymentInfo.easypaisaNumber);
      addLine('JazzCash', paymentInfo.jazzcashNumber);
    }
  }

  // ═══ FOOTER ═══
  const footerH = 20;
  const fy = ph - footerH;
  const thirdW = pw / 3;

  // Teal footer bar with 3 columns
  doc.setFillColor(...TEAL);
  doc.rect(0, fy, pw, footerH, 'F');

  // Divider lines
  doc.setDrawColor(255, 255, 255, 40);
  doc.setLineWidth(0.15);
  doc.line(thirdW, fy + 3, thirdW, fy + footerH - 3);
  doc.line(thirdW * 2, fy + 3, thirdW * 2, fy + footerH - 3);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 240, 240);

  // Location
  doc.setFontSize(9);
  doc.text('📍', thirdW * 0.5 - 2, fy + 7, { align: 'center' });
  doc.setFontSize(7);
  doc.text(settings.address || 'Shop Address', thirdW * 0.5, fy + 13, { align: 'center', maxWidth: thirdW - 10 });

  // Phone
  doc.setFontSize(9);
  doc.text('📞', thirdW * 1.5 - 2, fy + 7, { align: 'center' });
  doc.setFontSize(7);
  const phones = [settings.phone1, settings.phone2].filter(Boolean).join(' | ');
  doc.text(phones || 'Contact', thirdW * 1.5, fy + 13, { align: 'center' });

  // Social
  doc.setFontSize(9);
  doc.text('🌐', thirdW * 2.5 - 2, fy + 7, { align: 'center' });
  doc.setFontSize(7);
  doc.text(settings.socialMedia || settings.website || 'Social Media', thirdW * 2.5, fy + 13, { align: 'center', maxWidth: thirdW - 10 });

  // Bottom gold accent
  doc.setFillColor(...GOLD);
  doc.rect(0, ph - 2, pw, 2, 'F');

  return doc;
}
