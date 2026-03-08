

## Plan: Redesign Time Range Filter as Dropdown Selector

### Overview
Replace the horizontal scrollable pill buttons in `TimeRangeSelector` with a single premium dropdown selector. When "Custom Range" is selected, inline date pickers appear below.

### Changes

**1. Update `src/utils/dateUtils.ts` — Add missing date ranges**
Add "3 Days", "2 Months" ranges to `getDateRanges()` so the full list matches requirements: Today, 3 Days, Week (This Week), 2 Weeks, 3 Weeks, Month, Previous Month, 2 Months, 3 Months, 6 Months, 1 Year.

**2. Rewrite `src/components/reports/TimeRangeSelector.tsx`**
- Replace pill buttons with a single `Select` dropdown (Radix via shadcn)
- Trigger styled as a rounded container with `CalendarIcon` left, selected label center, `ChevronDown` right
- Options list includes all time ranges plus a "Custom Range" entry
- Selecting "Custom Range" shows inline From/To date pickers (reuse existing calendar popover logic)
- Selecting any preset clears custom dates
- Below the selector, display the active date range as small text: `01 Mar 2026 — 31 Mar 2026`

**3. Update `src/pages/Reports.tsx`**
- Update default `selectedRangeIndex` to match the new "Month" index (will be index 5)
- Props interface stays the same — no other changes needed

### UI Spec
```text
┌──────────────────────────────┐
│  📅  Month                 ▼ │  ← Single dropdown trigger
└──────────────────────────────┘
      01 Mar 2026 — 31 Mar 2026   ← Date range subtitle

When "Custom Range" selected:
┌─────────────┐  →  ┌─────────────┐
│  From date  │     │  To date    │
└─────────────┘     └─────────────┘
```

