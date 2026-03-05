import { forwardRef } from 'react';
import type { BillSettings, Bill, BillItem } from '@/types/bill';

interface BillPreviewTemplateProps {
  settings: BillSettings;
  bill: Bill;
  items: BillItem[];
}

const BillPreviewTemplate = forwardRef<HTMLDivElement, BillPreviewTemplateProps>(
  ({ settings, bill, items }, ref) => {
    const showPayment = bill.showPaymentInfo ?? settings.showPaymentInfo;
    const paymentInfo = bill.paymentInfo ?? settings.paymentInfo;
    const showTerms = bill.showTerms ?? settings.showTerms;
    const terms = bill.termsConditions ?? settings.termsConditions;
    const contactLine = [settings.phone1, settings.phone2].filter(Boolean).join(' | ');
    const initials = settings.shopName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
      <div
        ref={ref}
        style={{
          width: '794px',
          minHeight: '1123px',
          background: '#ffffff',
          color: '#1a1a1a',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '13px',
          lineHeight: '1.5',
          position: 'absolute',
          left: '-9999px',
          top: '0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Banner */}
        <div style={{ position: 'relative', height: '140px', background: '#1a1a1a', overflow: 'hidden' }}>
          {/* Decorative gold waves */}
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60px' }} viewBox="0 0 794 60" preserveAspectRatio="none">
            <path d="M0,30 C200,60 400,0 794,30 L794,60 L0,60 Z" fill="#DAA520" opacity="0.3" />
            <path d="M0,40 C150,20 350,60 794,35 L794,60 L0,60 Z" fill="#DAA520" opacity="0.5" />
          </svg>
          {/* Gold diagonal accent */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '140px', background: 'linear-gradient(135deg, #DAA520 0%, #F4C430 50%, #DAA520 100%)', clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} />
          
          {/* Logo + Shop name */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', padding: '24px 40px', gap: '16px' }}>
            {settings.logoPath ? (
              <img src={settings.logoPath} alt="Logo" style={{ height: '60px', width: '60px', objectFit: 'contain', borderRadius: '50%', background: '#fff', padding: '4px' }} crossOrigin="anonymous" />
            ) : (
              <div style={{ height: '60px', width: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #DAA520, #F4C430)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a' }}>
                {initials}
              </div>
            )}
            <div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>
                {settings.shopName}
              </div>
              {settings.tagline && (
                <div style={{ fontSize: '12px', color: '#ccc', marginTop: '2px', letterSpacing: '1px' }}>
                  {settings.tagline}
                </div>
              )}
            </div>
          </div>

          {/* INVOICE text */}
          <div style={{ position: 'absolute', top: '35px', right: '50px', zIndex: 2, fontSize: '36px', fontWeight: 'bold', color: '#1a1a1a', letterSpacing: '3px' }}>
            INVOICE
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '0 40px', display: 'flex', flexDirection: 'column' }}>
          {/* Shop details row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #ddd' }}>
            <div style={{ fontSize: '12px', color: '#555' }}>
              <div><strong>Invoice To:</strong></div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', marginTop: '2px' }}>{settings.shopName}</div>
              <div style={{ marginTop: '4px' }}>{settings.address}</div>
              <div style={{ marginTop: '2px', fontWeight: 600 }}>{contactLine}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#555' }}>
              <div>Invoice No: <strong style={{ fontSize: '14px', color: '#1a1a1a' }}>{bill.billNumber}</strong></div>
              <div style={{ marginTop: '4px' }}>Date: <strong>{new Date(bill.date).toLocaleDateString('en-PK')}</strong></div>
            </div>
          </div>

          {/* Customer section */}
          <div style={{ border: '1px solid #DAA520', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#FFF8E1', padding: '8px 16px', borderBottom: '1px solid #DAA520' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Invoice To :</div>
              <div style={{ fontSize: '13px' }}>Invoice No: <strong>{bill.billNumber}</strong></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{bill.buyerName}</div>
                {bill.buyerPhone && <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>Phone: {bill.buyerPhone}</div>}
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#555' }}>
                Date : {new Date(bill.date).toLocaleDateString('en-PK')}
              </div>
            </div>

            {/* Items table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#333', color: '#fff' }}>
                  <th style={thStyle}>#</th>
                  <th style={{ ...thStyle, textAlign: 'left', width: '25%' }}>Part Name</th>
                  <th style={thStyle}>Code</th>
                  <th style={thStyle}>Brand</th>
                  <th style={thStyle}>Qty</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Price (Rs)</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Total (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9', borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={{ ...tdStyle, textAlign: 'left', fontWeight: 500 }}>{item.partName}</td>
                    <td style={tdStyle}>{item.partCode || '-'}</td>
                    <td style={tdStyle}>{item.brand || '-'}</td>
                    <td style={tdStyle}>{item.quantity}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{item.price.toLocaleString()}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ borderTop: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 16px', fontSize: '13px' }}>
                <span style={{ width: '120px', textAlign: 'right', fontWeight: 600 }}>Subtotal :</span>
                <span style={{ width: '120px', textAlign: 'right' }}>Rs {bill.subtotal.toLocaleString()}</span>
              </div>
              {bill.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 16px', fontSize: '13px' }}>
                  <span style={{ width: '120px', textAlign: 'right', fontWeight: 600 }}>Discount :</span>
                  <span style={{ width: '120px', textAlign: 'right' }}>Rs {bill.discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px 12px' }}>
                <div style={{ display: 'flex', background: '#DAA520', padding: '8px 20px', fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a' }}>
                  <span style={{ marginRight: '20px' }}>GRAND TOTAL :</span>
                  <span>Rs {bill.finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Payment Info */}
          {(showTerms || showPayment) && (
            <div style={{ display: 'flex', gap: '24px', marginTop: '24px', fontSize: '12px' }}>
              {showTerms && terms && terms.length > 0 && (
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#DAA520', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.5px' }}>TERMS & CONDITIONS</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#444', lineHeight: '1.8' }}>
                    {terms.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}
              {showPayment && paymentInfo && (
                <div style={{ flex: 1, border: '1px solid #DAA520', padding: '12px 16px', background: '#FFFDF5' }}>
                  <div style={{ fontWeight: 'bold', color: '#DAA520', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.5px' }}>PAYMENT INFORMATION</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#444', lineHeight: '1.8', listStyle: 'disc' }}>
                    {paymentInfo.bankName && <li>Bank Name: {paymentInfo.bankName}</li>}
                    {paymentInfo.accountTitle && <li>Account Title: {paymentInfo.accountTitle}</li>}
                    {paymentInfo.accountNumber && <li>Account No. {paymentInfo.accountNumber}</li>}
                    {paymentInfo.iban && <li>IBAN: {paymentInfo.iban}</li>}
                    {paymentInfo.easypaisaNumber && <li>EasyPaisa: {paymentInfo.easypaisaNumber}</li>}
                    {paymentInfo.jazzcashNumber && <li>JazzCash: {paymentInfo.jazzcashNumber}</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {bill.notes && (
            <div style={{ marginTop: '20px', fontSize: '11px', color: '#555', fontStyle: 'italic' }}>
              Notes: {bill.notes}
            </div>
          )}

          {/* Footer message */}
          {settings.footerMessage && (
            <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '14px', color: '#555', borderTop: '1px dashed #ccc', paddingTop: '16px' }}>
              {settings.footerMessage}
            </div>
          )}

          <div style={{ flex: 1 }} />
        </div>

        {/* Bottom footer bar */}
        <div style={{ background: '#1a1a1a', padding: '16px 40px', display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '12px', color: '#ccc', marginTop: '20px' }}>
          {settings.phone1 && <span>📞 {settings.phone1}</span>}
          {settings.phone2 && <span>📱 {settings.phone2}</span>}
          {settings.address && <span style={{ maxWidth: '300px', textAlign: 'center' }}>📍 {settings.address.split(',').slice(0, 2).join(',')}</span>}
        </div>
      </div>
    );
  }
);

const thStyle: React.CSSProperties = {
  padding: '10px 8px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '12px',
};

const tdStyle: React.CSSProperties = {
  padding: '8px',
  textAlign: 'center',
};

BillPreviewTemplate.displayName = 'BillPreviewTemplate';
export default BillPreviewTemplate;
