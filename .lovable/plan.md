

# End-to-End Testing & Bug Fixing Plan

## Scope

The app is an offline-first inventory and sales manager using Dexie.js (IndexedDB), React, Recharts, and shadcn/ui. There is no remote backend — all data operations are local. Testing will cover all routes, services, UI interactions, and edge cases.

## Approach

Rather than manual browser testing (which is expensive and non-reproducible), we will write comprehensive **Vitest + React Testing Library** test suites for every critical path, plus audit and fix any code-level issues found during review.

The testing infrastructure (vitest, jsdom, setup file) already exists. We will create test files alongside the relevant code.

---

## Phase 1: Code Audit & Immediate Fixes

Review all services and pages for bugs found during exploration:

**Potential issues identified:**
- `recordSale` (single-item) calls `logActivity` **outside** the transaction — if the log fails, the sale still proceeds but the log call could throw an unhandled error. `recordMultiSale` has the same pattern. (Low risk since logActivity is a simple DB add, but inconsistent.)
- `QuickSellModal` writes directly to `db.sales` without a transaction wrapper — no atomicity guarantee.
- `deleteSale` restores stock for inventory-linked sales, but QuickSell sales have `partId: ''` — `db.parts.get('')` returns undefined, so stock restore is silently skipped. This is correct behavior but should be explicitly guarded.
- Dashboard `KPI_CONFIG` casts `stats[kpi.key]` to `number` but `weeklySales` and `stockDistribution` are also on `stats` — the cast is safe only because KPI_CONFIG keys are restricted, but TypeScript doesn't enforce this.

**Files to fix:** `src/services/salesService.ts`, `src/components/dashboard/QuickSellModal.tsx`

---

## Phase 2: Service Layer Tests

Create test files for each service to validate all CRUD operations, edge cases, and data integrity.

### 2a. Inventory Service Tests (`src/services/inventoryService.test.ts`)
- Create part → verify saved in DB with correct fields
- Update part → verify only changed fields updated
- Delete part → verify removed from DB
- SKU uniqueness check
- Stock update (positive/negative) → verify quantity clamped at 0
- Low stock / out-of-stock queries
- Inventory value calculation

### 2b. Sales Service Tests (`src/services/salesService.test.ts`)
- Record single sale → stock decremented, sale saved
- Record multi-item sale → all items processed atomically
- Insufficient stock → returns error, no data changed
- Delete sale → stock restored
- QuickSell (partId='') delete → stock NOT restored (no crash)
- Sales summary calculations
- Date range filtering
- Top selling parts aggregation

### 2c. Bill Service Tests (`src/services/billService.test.ts`)
- Get/create default settings
- Update settings
- Bill number generation (sequential)
- Create bill with items
- Edit bill (replace items)
- Delete bill

### 2d. Activity Log Service Tests (`src/services/activityLogService.test.ts`)
- Log creation with all action types
- Query by entity type/id
- Soft delete (isDeleted flag)
- Date range filtering

### 2e. Backup & Restore Tests (`src/utils/backupValidation.test.ts`)
- Valid backup file passes validation
- Malformed JSON rejected
- Missing required fields rejected
- Oversized strings rejected
- Import → export roundtrip preserves data

---

## Phase 3: UI Component Tests

### 3a. Dashboard (`src/pages/Dashboard.test.tsx`)
- Renders KPI cards with correct values
- Quick action buttons navigate to correct routes
- Weekly sales chart renders without errors
- Inventory health bar segments match stock distribution
- Low stock alerts display correctly
- Empty state (no data) renders gracefully

### 3b. Inventory Page (`src/pages/Inventory.test.tsx`)
- Search filters parts by name/SKU
- Brand/category/stock filters work correctly
- View mode toggle (list/grid/table)
- Sort by each column
- Bulk delete flow
- Empty state message

### 3c. Add/Edit Part Form (`src/pages/AddEditPart.test.tsx`)
- Required field validation
- Numeric field validation
- SKU uniqueness validation
- Image upload (max 5)
- Edit mode loads existing data
- Custom brand/category creation

### 3d. Record Sale (`src/pages/RecordSale.test.tsx`)
- Part selection populates price
- Cart add/edit/remove
- Quantity exceeds stock → error
- Complete sale → navigates to dashboard
- Empty cart → error toast

### 3e. Quick Sell Modal (`src/components/dashboard/QuickSellModal.test.tsx`)
- Form validation
- Profit calculation display
- Successful submission

---

## Phase 4: Edge Case & Stress Tests

Add edge case scenarios to existing test files:
- Empty string inputs → validation catches them
- Zero/negative prices → rejected
- Duplicate SKU → blocked
- Rapid double-submit (button disabled during submission)
- Very large numbers (999,999,999) → no overflow
- Special characters in names/notes → stored correctly
- Date boundary testing (sales at midnight)

---

## Phase 5: Integration & Data Persistence Tests

- Add part → refresh context → part appears in stats
- Sell part → stock decremented in real-time queries
- Backup export → clear DB → restore → all data intact
- Settings persist across context re-initialization

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/services/inventoryService.test.ts` | Create |
| `src/services/salesService.test.ts` | Create |
| `src/services/billService.test.ts` | Create |
| `src/services/activityLogService.test.ts` | Create |
| `src/utils/backupValidation.test.ts` | Create |
| `src/pages/Dashboard.test.tsx` | Create |
| `src/pages/Inventory.test.tsx` | Create |
| `src/pages/AddEditPart.test.tsx` | Create |
| `src/pages/RecordSale.test.tsx` | Create |
| `src/components/dashboard/QuickSellModal.test.tsx` | Create |
| `src/services/salesService.ts` | Fix: guard QuickSell delete stock restore |
| `src/components/dashboard/QuickSellModal.tsx` | Fix: wrap DB write in transaction |

## Estimated Scope
- ~10 new test files
- ~2 bug fixes
- All tests runnable via `vitest`

