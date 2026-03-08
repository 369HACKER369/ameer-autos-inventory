

# Currency Formatting & Dashboard Layout Fix

## Problem
1. Dashboard KPI cards allow currency text to wrap ("Rs 6.00" on line 1, "Lac" on line 2)
2. No settings-driven currency display mode (numeric vs compact)
3. `formatCurrencyShort` is hardcoded — not reactive to user settings

## Plan

### 1. Upgrade `src/utils/currency.ts` — Add display mode support

Add a new `CurrencyDisplayMode` type (`'numeric' | 'compact'`) and a new formatter function `formatCurrencyAdaptive(amount, mode)`:

- **numeric mode**: Full number with Pakistani locale commas (e.g., `Rs 1,00,000`)
- **compact mode** (default): Uses K / Lac / Crore units with clean rounding

Update `formatCurrencyShort` to use "Crore" instead of "Cr" for consistency.

Thresholds for compact mode:
- `≥ 1,00,00,000` → `X.XX Crore`
- `≥ 1,00,000` → `X.XX Lac`  
- `≥ 1,000` → `X.XK`
- Below → plain number

### 2. Create `src/hooks/useCurrencyFormat.ts` — Settings-reactive hook

A lightweight hook that reads `currencyDisplayMode` from the DB (via `getSetting`) and exposes:
- `displayMode: 'numeric' | 'compact'`
- `formatValue(amount): string` — returns formatted string without "Rs" prefix
- `formatFull(amount): string` — returns with "Rs" prefix

This hook will be used by KPI cards and anywhere else that needs settings-reactive formatting. Uses `useLiveQuery` or a simple state + effect to stay in sync.

### 3. Fix Dashboard KPI Card layout — `src/pages/Dashboard.tsx`

In the inline `KPICard` component (line 377–431):
- Add `whitespace-nowrap` to the value container
- Use the `useCurrencyFormat` hook for formatting
- Apply responsive text sizing: use `text-xl` normally, scale down to `text-lg` for values with units (Lac/Crore) via a simple length check
- Keep the existing `[Rs] [value]` structure but ensure nowrap

### 4. Fix standalone `src/components/reports/KPICard.tsx`

Same nowrap and responsive sizing fix. Use the `useCurrencyFormat` hook.

### 5. Upgrade `src/pages/settings/LanguageLocalization.tsx`

Replace the current "Currency Format" card (which only changes the symbol Rs/₨/PKR — currently unused elsewhere) with an **Advanced Currency Display** card:

- **Currency Symbol**: Rs / ₨ / PKR (existing)
- **Display Mode**: New setting
  - `Compact Units` — "10K, 2.5 Lac, 1.2 Crore" (default)
  - `Full Numbers` — "10,000 / 1,00,000 / 1,20,00,000"

Save as `currencyDisplayMode` in DB settings.

### 6. Update all currency display call sites

Files that use `formatCurrencyShort` or `formatCurrency` for display:
- `src/pages/Dashboard.tsx` (KPI cards, weekly total, monthly overview)
- `src/components/reports/KPICard.tsx`
- `src/components/reports/InsightsPanel.tsx`
- `src/components/reports/TopSellingParts.tsx`
- `src/components/reports/InventoryDistributionChart.tsx`
- `src/pages/RecordSale.tsx`
- `src/pages/BillHistory.tsx`

For chart tooltips and detailed views (RecordSale line items, bill amounts), keep `formatCurrency` (full number) since those need precision. For summary/KPI displays, switch to the adaptive formatter.

### Files Modified
| File | Change |
|------|--------|
| `src/utils/currency.ts` | Add `formatCurrencyAdaptive`, update `formatCurrencyShort` |
| `src/hooks/useCurrencyFormat.ts` | **New** — settings-reactive currency hook |
| `src/pages/Dashboard.tsx` | Nowrap fix, use hook, responsive text |
| `src/components/reports/KPICard.tsx` | Nowrap fix, use hook |
| `src/components/reports/InsightsPanel.tsx` | Use adaptive formatter |
| `src/pages/settings/LanguageLocalization.tsx` | Add display mode setting |

### What stays unchanged
- Database schema / stored values (all amounts remain raw numbers)
- Inventory / sales data logic
- Dashboard UI structure / layout / design
- `formatCurrency` for detailed views (bills, sale line items)

