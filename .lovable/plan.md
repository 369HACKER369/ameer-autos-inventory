

## Plan: Remove Demo Data & Add Table View to Inventory

### 1. Remove Demo Data Seeding

**`src/contexts/AppContext.tsx`** — Remove the `seedDemoDataIfNeeded()` call (line 84) and the import (line 3). The app will start clean with no data.

**`src/services/demoSeedService.ts`** — Add a new `clearAllDemoData()` function that deletes all parts where `isDemo === true`, plus any brands/categories that were seeded. Call this once on startup to purge any existing demo data from users who already have it, then reset the `demoDataInserted` flag.

**`src/contexts/AppContext.tsx`** — Replace `seedDemoDataIfNeeded()` with `clearAllDemoData()` so existing installs get cleaned up on next load. After cleanup runs once, it becomes a no-op.

### 2. Add Table View Mode

**`src/types/index.ts`** — Extend `ViewMode` from `'list' | 'grid'` to `'list' | 'grid' | 'table'`.

**`src/pages/Inventory.tsx`** — Three changes:

- **View toggle button**: Replace the single toggle button with a 3-way cycle (`list → grid → table → list`). Use `List`, `Grid3X3`, and `Table2` icons from lucide-react.

- **Table view rendering**: Add a third branch in the render logic for `viewMode === 'table'`. Render a horizontally scrollable `<Table>` (from `src/components/ui/table.tsx`) with columns: Part Name, SKU, Brand, Qty, Price. No images. Each row is clickable (navigates to part detail). Low stock rows get the emergency indicator next to the name and colored quantity text.

- **Column sorting**: Add `sortColumn` and `sortDirection` state. Clicking a table header toggles sort. Apply sorting in the `filteredParts` memo when in table view.

### UI Spec for Table View

```text
┌─────────────────────────────────────────────────┐
│ Name ▲     │ SKU        │ Brand  │ Qty │ Price  │
├─────────────────────────────────────────────────┤
│ Brake Pad  │ BP-001     │ CAT    │  5  │ Rs 800 │
│ Oil Filter │ OF-102     │ Bosch  │  0  │ Rs 350 │  ← red qty
└─────────────────────────────────────────────────┘
← horizontally scrollable on mobile →
```

The table container uses `overflow-x-auto` for mobile scroll. Text sizes are compact (`text-xs`/`text-sm`). Consistent with existing card-based views.

### Files Changed
1. `src/types/index.ts` — extend ViewMode
2. `src/contexts/AppContext.tsx` — swap seed for cleanup
3. `src/services/demoSeedService.ts` — add clearAllDemoData
4. `src/pages/Inventory.tsx` — add table view + 3-way toggle + sorting

