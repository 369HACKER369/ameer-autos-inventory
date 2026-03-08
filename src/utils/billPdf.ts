import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { BillSettings, Bill, BillItem } from '@/types/bill';

// Exact colors from reference: #1B3D3D, #C9A020, #CC2E2E
const TEAL: [number, number, number] = [27, 61, 61];
const GOLD: [number, number, number] = [201, 160, 32];
const RED_PILL: [number, number, number] = [204, 46, 46];

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
  const mx = 15; // horizontal margin
  let y = 0;

  const initials = settings.shopName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // ═══ HEADER BANNER ═══
  const headerH = 32;
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pw, headerH, 'F');

  // Logo circle
  const logoX = mx + 12;
  const logoY = headerH / 2;
  const logoR = 12;
  let logoRendered = false;

  if (settings.logoPath) {
    const parsed = parseLogoDataUrl(settings.logoPath);
    if (parsed) {
      try {
        // Outer gold ring
        doc.setDrawColor(...GOLD);
        doc.setLineWidth(1);
        doc.setFillColor(...TEAL);
        doc.circle(logoX, logoY, logoR, 'FD');
        // Inner gold ring
        doc.setLineWidth(0.7);
        doc.circle(logoX, logoY, logoR - 1.5, 'S');
        // Image
        const imgSize = logoR * 1.4;
        doc.addImage(parsed.data, parsed.format, logoX - imgSize / 2, logoY - imgSize / 2, imgSize, imgSize);
        logoRendered = true;
      } catch (e) {
        console.warn('PDF logo rendering failed:', e);
      }
    }
  }

  if (!logoRendered) {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1);
    doc.setFillColor(20, 46, 46);
    doc.circle(logoX, logoY, logoR, 'FD');
    doc.setLineWidth(0.7);
    doc.circle(logoX, logoY, logoR - 1.5, 'S');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GOLD);
    doc.text(initials, logoX, logoY + 4, { align: 'center' });
  }

  // Shop name (large)
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(settings.shopName, mx + 28, headerH / 2 - 1);

  // Tagline
  if (settings.tagline) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(208, 208, 208);
    doc.text(settings.tagline, mx + 28, headerH / 2 + 6);
  }

  y = headerH;

  // ═══ GOLD INVOICE FROM BANNER ═══
  const bannerH = 8;
  doc.setFillColor(...GOLD);
  doc.rect(0, y, pw, bannerH, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEAL);
  doc.text('Invoice From :', mx, y + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.shopName.toUpperCase(), mx + 26, y + 5.5);
  y += bannerH + 4;

  // ═══ INVOICE TO BLOCK ═══
  const blockW = pw - mx * 2;

  // Teal header bar
  const blockHeaderH = 8;
  doc.setFillColor(...TEAL);
  doc.rect(mx, y, blockW, blockHeaderH, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Invoice To :', mx + 4, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice No :', pw - mx - 50, y + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.text(bill.billNumber, pw - mx - 4, y + 5.5, { align: 'right' });
  y += blockHeaderH;

  // Body box
  const bodyH = 16;
  doc.setDrawColor(204, 204, 204);
  doc.setLineWidth(0.3);
  doc.rect(mx, y, blockW, bodyH, 'S');

  // Buyer name
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(bill.buyerName.toUpperCase(), mx + 4, y + 7);
  if (bill.buyerPhone) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    doc.text(`Phone: ${bill.buyerPhone}`, mx + 4, y + 12);
  }

  // Date right
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 51, 51);
  doc.text(`Date : ${new Date(bill.date).toLocaleDateString('en-PK')}`, pw - mx - 4, y + 7, { align: 'right' });

  y += bodyH + 4;

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
    margin: { left: mx, right: mx },
    styles: { fontSize: 10, cellPadding: 3.5, textColor: [34, 34, 34] },
    headStyles: {
      fillColor: TEAL,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 10,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'left' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center', cellWidth: 14 },
      5: { halign: 'center' },
      6: { halign: 'center' },
    },
    theme: 'grid',
    tableLineColor: [221, 221, 221],
    tableLineWidth: 0.2,
  });

  // ═══ TOTALS ═══
  y = (doc as any).lastAutoTable.finalY + 4;

  // Subtotal
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 51, 51);
  doc.text('Subtotal :', pw - mx - 50, y + 4);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(`Rs ${bill.subtotal.toLocaleString()}`, pw - mx, y + 4, { align: 'right' });

  // Divider
  y += 8;
  doc.setDrawColor(204, 204, 204);
  doc.setLineWidth(0.2);
  doc.line(pw - mx - 80, y, pw - mx, y);

  // Discount
  if (bill.discount > 0) {
    y += 2;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Discount', pw - mx - 50, y + 4);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(`${bill.discount.toLocaleString()}`, pw - mx, y + 4, { align: 'right' });
    y += 8;
  }

  // ═══ GRAND TOTAL BAR ═══
  y += 4;
  const gtBarH = 14;
  const gtRightW = 100;
  const gtLeftW = pw - gtRightW;

  // Gold left section
  doc.setFillColor(...GOLD);
  doc.rect(0, y, gtLeftW, gtBarH, 'F');

  // Teal right section
  doc.setFillColor(...TEAL);
  doc.rect(gtLeftW, y, gtRightW, gtBarH, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('GRAND TOTAL :', gtLeftW + 4, y + gtBarH / 2 + 1);
  doc.setFontSize(14);
  doc.text(`Rs ${bill.finalTotal.toLocaleString()}`, pw - 6, y + gtBarH / 2 + 1, { align: 'right' });

  y += gtBarH;

  // ═══ TERMS & PAYMENT ═══
  const showPayment = bill.showPaymentInfo ?? settings.showPaymentInfo;
  const paymentInfo = bill.paymentInfo ?? settings.paymentInfo;
  const showTerms = bill.showTerms ?? settings.showTerms;
  const terms = bill.termsConditions ?? settings.termsConditions;

  if (showTerms || showPayment) {
    y += 12;
    const colW = (pw - mx * 2 - 10) / 2;

    if (showTerms && terms && terms.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 26);
      doc.text('TERMS & CONDITIONS', mx, y);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
      let ty = y + 7;
      terms.forEach(t => {
        if (ty < ph - 50) {
          doc.text(`• ${t}`, mx + 2, ty);
          ty += 5;
        }
      });
    }

    if (showPayment && paymentInfo) {
      const px = showTerms ? mx + colW + 10 : mx;
      const py = y;

      // Dashed border box
      doc.setDrawColor(153, 153, 153);
      doc.setLineWidth(0.5);
      doc.setLineDashPattern([2, 2], 0);
      doc.roundedRect(px, py - 4, colW, 42, 2, 2, 'S');
      doc.setLineDashPattern([], 0);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 26);
      doc.text('PAYMENT INFORMATION', px + 4, py);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
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
  const footerH = 24;
  const fy = ph - footerH;
  const thirdW = pw / 3;

  doc.setFillColor(...TEAL);
  doc.rect(0, fy, pw, footerH, 'F');

  // Red pill icons + text for each column
  const pillW = 16;
  const pillH = 9;
  const pillR = 4;
  const pillY = fy + 4;

  // Helper: draw red pill
  const drawPill = (cx: number) => {
    doc.setFillColor(...RED_PILL);
    doc.roundedRect(cx - pillW / 2, pillY, pillW, pillH, pillR, pillR, 'F');
  };

  // Location
  const col1X = thirdW * 0.5;
  drawPill(col1X);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(settings.address || 'Shop Address', col1X, fy + 18, { align: 'center', maxWidth: thirdW - 8 });

  // Phone
  const col2X = thirdW * 1.5;
  drawPill(col2X);
  const phones = [settings.phone1, settings.phone2].filter(Boolean).join(' | ');
  doc.text(phones || 'Contact', col2X, fy + 18, { align: 'center' });

  // Social
  const col3X = thirdW * 2.5;
  drawPill(col3X);
  doc.text(settings.socialMedia || settings.website || 'Social Media', col3X, fy + 18, { align: 'center', maxWidth: thirdW - 8 });

  return doc;
}
