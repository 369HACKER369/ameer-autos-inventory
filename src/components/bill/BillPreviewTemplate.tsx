import { forwardRef } from 'react';
import type { BillSettings, Bill, BillItem } from '@/types/bill';

interface BillPreviewTemplateProps {
  settings: BillSettings;
  bill: Bill;
  items: BillItem[];
}

/* ── Premium Color Palette ── */
const TEAL = '#0a5c5c';
const TEAL_DARK = '#073f3f';
const GOLD = '#c9952a';
const GOLD_LIGHT = '#dbb042';
const LIGHT_BG = '#f7f6f2';
const WHITE = '#ffffff';
const TEXT_DARK = '#1a1a1a';
const TEXT_MED = '#555555';
const TEXT_LIGHT = '#888888';
const BORDER = '#e2e0da';

const BillPreviewTemplate = forwardRef<HTMLDivElement, BillPreviewTemplateProps>(
  ({ settings, bill, items }, ref) => {
    const showPayment = bill.showPaymentInfo ?? settings.showPaymentInfo;
    const paymentInfo = bill.paymentInfo ?? settings.paymentInfo;
    const showTerms = bill.showTerms ?? settings.showTerms;
    const terms = bill.termsConditions ?? settings.termsConditions;
    const initials = settings.shopName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
      <div
        ref={ref}
        id="bill-capture-root"
        style={{
          width: '794px',
          minHeight: '1123px',
          background: WHITE,
          color: TEXT_DARK,
          fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
          fontSize: '13px',
          lineHeight: '1.5',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ═══ HEADER ═══ Dark teal banner */}
        <div style={{
          background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
          padding: '30px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '22px',
        }}>
          {/* Logo */}
          {settings.logoPath ? (
            <img
              src={settings.logoPath}
              alt="Logo"
              style={{
                height: '78px', width: '78px', objectFit: 'contain',
                borderRadius: '50%', border: `3px solid ${GOLD}`,
                background: WHITE, padding: '3px',
              }}
              crossOrigin="anonymous"
            />
          ) : (
            <div style={{
              height: '78px', width: '78px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', fontWeight: 800, color: WHITE,
              border: `3px solid rgba(255,255,255,0.25)`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>
              {initials}
            </div>
          )}

          {/* Shop Name + Tagline */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '30px', fontWeight: 800, color: WHITE,
              letterSpacing: '1.5px', textTransform: 'uppercase',
            }}>
              {settings.shopName}
            </div>
            {settings.tagline && (
              <div style={{
                fontSize: '13px', color: 'rgba(255,255,255,0.7)',
                marginTop: '4px', letterSpacing: '0.5px',
              }}>
                {settings.tagline}
              </div>
            )}
          </div>

          {/* Right side contact */}
          <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.75)', fontSize: '11px', lineHeight: '1.9' }}>
            {settings.phone1 && <div>☎ {settings.phone1}</div>}
            {settings.address && <div style={{ maxWidth: '180px', marginLeft: 'auto' }}>⌂ {settings.address}</div>}
          </div>
        </div>

        {/* ═══ GOLD ACCENT BAR ═══ */}
        <div style={{
          height: '5px',
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`,
        }} />

        {/* ═══ INVOICE FROM STRIP ═══ */}
        <div style={{
          background: LIGHT_BG, padding: '10px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: `1px solid ${BORDER}`,
        }}>
          <div style={{ fontSize: '13px' }}>
            <span style={{ color: TEXT_LIGHT }}>Invoice From : </span>
            <span style={{ fontWeight: 700, color: TEXT_DARK, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {settings.shopName}
            </span>
          </div>
          {settings.ownerName && (
            <span style={{ fontSize: '11px', color: TEXT_LIGHT }}>
              Owner: {settings.ownerName}
            </span>
          )}
        </div>

        {/* ═══ CONTENT AREA ═══ */}
        <div style={{ flex: 1, padding: '0 40px', display: 'flex', flexDirection: 'column' }}>

          {/* ── Buyer + Invoice Info ── */}
          <div style={{ display: 'flex', marginTop: '22px', gap: '0' }}>
            {/* Left: Invoice To */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: TEAL, color: WHITE, padding: '9px 16px',
                fontWeight: 700, fontSize: '12px', letterSpacing: '0.5px',
              }}>
                INVOICE TO :
              </div>
              <div style={{ borderTop: `3px solid ${GOLD}`, border: `1px solid ${BORDER}`, borderTop: `3px solid ${GOLD}`, padding: '14px 16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', color: TEXT_DARK }}>
                  {bill.buyerName}
                </div>
                {bill.buyerPhone && (
                  <div style={{ fontSize: '12px', color: TEXT_MED, marginTop: '5px' }}>
                    Phone: {bill.buyerPhone}
                  </div>
                )}
              </div>
            </div>
            {/* Right: Invoice No + Date */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: TEAL, color: WHITE, padding: '9px 16px',
                fontWeight: 700, fontSize: '12px', textAlign: 'right', letterSpacing: '0.5px',
              }}>
                INVOICE NO : <span style={{ color: GOLD_LIGHT, fontWeight: 800 }}>{bill.billNumber}</span>
              </div>
              <div style={{ borderTop: `3px solid ${GOLD}`, border: `1px solid ${BORDER}`, borderLeft: 'none', borderTop: `3px solid ${GOLD}`, padding: '14px 16px', textAlign: 'right' }}>
                <div style={{ fontSize: '14px', color: TEXT_DARK }}>
                  Date : {new Date(bill.date).toLocaleDateString('en-PK')}
                </div>
                {bill.notes && (
                  <div style={{ fontSize: '11px', color: TEXT_LIGHT, marginTop: '5px', fontStyle: 'italic' }}>
                    Notes: {bill.notes}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── ITEMS TABLE ── */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginTop: '24px' }}>
            <thead>
              <tr style={{ background: TEAL }}>
                <th style={{ ...thStyle, width: '36px' }}>#</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Part Name</th>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Brand</th>
                <th style={{ ...thStyle, width: '50px' }}>QTY</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Price (RS)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Total (RS)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} style={{
                  borderBottom: `1px solid ${BORDER}`,
                  background: i % 2 === 0 ? WHITE : LIGHT_BG,
                }}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', fontWeight: 600, color: TEXT_DARK }}>{item.partName}</td>
                  <td style={{ ...tdStyle, color: TEXT_MED }}>{item.partCode || '-'}</td>
                  <td style={{ ...tdStyle, color: TEXT_MED }}>{item.brand || '-'}</td>
                  <td style={tdStyle}>{item.quantity}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{item.price.toLocaleString()}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: TEXT_DARK }}>{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── TOTALS ── */}
          <div style={{ marginTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ padding: '9px 16px', fontSize: '13px', fontWeight: 700, width: '160px', textAlign: 'right', color: TEXT_MED }}>Subtotal :</div>
              <div style={{ padding: '9px 16px', fontSize: '13px', width: '140px', textAlign: 'right', color: TEXT_DARK }}>Rs {bill.subtotal.toLocaleString()}</div>
            </div>
            {bill.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ padding: '9px 16px', fontSize: '13px', fontWeight: 700, width: '160px', textAlign: 'right', color: TEXT_MED }}>Discount :</div>
                <div style={{ padding: '9px 16px', fontSize: '13px', width: '140px', textAlign: 'right', color: '#c0392b', fontWeight: 600 }}>- {bill.discount.toLocaleString()}</div>
              </div>
            )}
            {/* Grand Total bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <div style={{ display: 'flex', overflow: 'hidden', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                <div style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  padding: '14px 24px', fontWeight: 800, fontSize: '15px',
                  color: TEXT_DARK, display: 'flex', alignItems: 'center',
                  letterSpacing: '1px',
                }}>
                  GRAND TOTAL :
                </div>
                <div style={{
                  background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`,
                  padding: '14px 28px', fontWeight: 800, fontSize: '15px',
                  color: WHITE, display: 'flex', alignItems: 'center',
                }}>
                  Rs {bill.finalTotal.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* ── TERMS & PAYMENT ── */}
          {(showTerms || showPayment) && (
            <div style={{ display: 'flex', gap: '24px', marginTop: '36px', fontSize: '12px' }}>
              {showTerms && terms && terms.length > 0 && (
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 700, color: TEAL, fontSize: '13px', marginBottom: '10px',
                    textTransform: 'uppercase', borderBottom: `2px solid ${GOLD}`, paddingBottom: '6px',
                    letterSpacing: '0.5px',
                  }}>
                    Terms & Conditions
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: TEXT_MED, lineHeight: '2.2' }}>
                    {terms.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}
              {showPayment && paymentInfo && (
                <div style={{
                  flex: 1, border: `2px solid ${TEAL}`, borderRadius: '8px',
                  padding: '16px 20px', background: 'rgba(10,92,92,0.02)',
                }}>
                  <div style={{
                    fontWeight: 700, color: TEAL, fontSize: '13px', marginBottom: '10px',
                    textTransform: 'uppercase', borderBottom: `2px solid ${GOLD}`, paddingBottom: '6px',
                    letterSpacing: '0.5px',
                  }}>
                    Payment Information
                  </div>
                  <div style={{ color: TEXT_MED, lineHeight: '2.2' }}>
                    {paymentInfo.bankName && <div>• Bank Name: {paymentInfo.bankName}</div>}
                    {paymentInfo.accountTitle && <div>• Account Name: {paymentInfo.accountTitle}</div>}
                    {paymentInfo.accountNumber && <div>• Account No: {paymentInfo.accountNumber}</div>}
                    {paymentInfo.iban && <div>• IBAN: {paymentInfo.iban}</div>}
                    {paymentInfo.easypaisaNumber && <div>• EasyPaisa: {paymentInfo.easypaisaNumber}</div>}
                    {paymentInfo.jazzcashNumber && <div>• JazzCash: {paymentInfo.jazzcashNumber}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ flex: 1 }} />
        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={{ marginTop: '20px' }}>
          {/* 3-column icon strip */}
          <div style={{ display: 'flex', background: TEAL }}>
            {/* Location */}
            <div style={{ flex: 1, padding: '14px 16px', textAlign: 'center', borderRight: `1px solid rgba(255,255,255,0.15)` }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>📍</div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px', lineHeight: '1.6', fontWeight: 500 }}>
                {settings.address || 'Shop Address'}
              </div>
            </div>
            {/* Contact */}
            <div style={{ flex: 1, padding: '14px 16px', textAlign: 'center', borderRight: `1px solid rgba(255,255,255,0.15)` }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>📞</div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px', lineHeight: '1.6', fontWeight: 500 }}>
                {settings.phone1 && <div>{settings.phone1}</div>}
                {settings.phone2 && <div>{settings.phone2}</div>}
              </div>
            </div>
            {/* Social */}
            <div style={{ flex: 1, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>🌐</div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px', lineHeight: '1.6', fontWeight: 500 }}>
                {settings.socialMedia || settings.website || 'Social Media'}
              </div>
            </div>
          </div>
          {/* Bottom gold accent */}
          <div style={{
            height: '4px',
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`,
          }} />
        </div>
      </div>
    );
  }
);

const thStyle: React.CSSProperties = {
  padding: '11px 10px',
  textAlign: 'center',
  fontWeight: 700,
  fontSize: '11px',
  color: '#ffffff',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 10px',
  textAlign: 'center',
  fontSize: '12px',
};

BillPreviewTemplate.displayName = 'BillPreviewTemplate';
export default BillPreviewTemplate;
