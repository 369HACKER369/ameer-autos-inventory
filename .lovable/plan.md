
## Plan: Full Settings Persistence & Database Integrity Hardening

The app already has a solid foundation with Dexie.js for local persistence and `useLiveQuery` for real-time reactivity. However, several UI preferences reset on reload. This plan addresses those gaps and adds defensive error handling.

---

### 1. Persist Inventory View Preferences

**File:** `src/pages/Inventory.tsx`

Currently, `viewMode`, `sortColumn`, and `sortDirection` reset to defaults on page reload.

**Changes:**
- On mount, load saved preferences from `getSetting('inventoryViewMode')`, `getSetting('inventorySortColumn')`, `getSetting('inventorySortDirection')`
- When user changes view/sort, call `updateSetting(...)` to persist
- Add `useEffect` to initialize state from DB on load

```tsx
// Add useEffect to load persisted preferences
useEffect(() => {
  Promise.all([
    getSetting<ViewMode>('inventoryViewMode'),
    getSetting<SortColumn>('inventorySortColumn'),
    getSetting<SortDirection>('inventorySortDirection'),
  ]).then(([vm, sc, sd]) => {
    if (vm) setViewMode(vm);
    if (sc) setSortColumn(sc);
    if (sd) setSortDirection(sd);
  });
}, []);

// Update setters to persist
const cycleViewMode = () => {
  const next = VIEW_CYCLE[(VIEW_CYCLE.indexOf(viewMode) + 1) % 3];
  setViewMode(next);
  updateSetting('inventoryViewMode', next);
};
```

---

### 2. Persist Reports Time Range Selection

**File:** `src/pages/Reports.tsx`

Currently, `selectedRangeIndex` resets to `5` on reload.

**Changes:**
- Load from `getSetting('reportsTimeRangeIndex')` on mount
- Save on change via `updateSetting`

---

### 3. Add Error Boundary for Crash Protection

**New File:** `src/components/ErrorBoundary.tsx`

A React error boundary to catch rendering errors and display a recovery UI instead of crashing:

```tsx
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };
  
  static getDerivedStateFromError() { return { hasError: true }; }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

**File:** `src/App.tsx` — Wrap main routes with `<ErrorBoundary>`

---

### 4. Add Database Transaction Safety

**Files:** `src/services/inventoryService.ts`, `src/services/salesService.ts`

Already using Dexie transactions for atomic operations. Add explicit error logging and retry logic for failed writes:

```tsx
// Wrap critical operations
try {
  await db.transaction('rw', [db.parts, db.activityLogs], async () => { ... });
} catch (error) {
  console.error('Transaction failed:', error);
  throw error; // Re-throw for UI handling
}
```

---

### 5. Ensure Bill Settings Persistence

**File:** `src/services/billService.ts`

Already persisted via `billSettings` table. Add validation to ensure settings always merge with defaults (already done with spread operator).

---

### 6. Add Loading States for Preference Hydration

**File:** `src/pages/Inventory.tsx`

Add a brief loading state while preferences load to prevent UI flicker:

```tsx
const [prefsLoaded, setPrefsLoaded] = useState(false);

useEffect(() => {
  loadPrefs().then(() => setPrefsLoaded(true));
}, []);

if (!prefsLoaded) return <Skeleton />;
```

---

### Summary of Changes

| File | Change |
|------|--------|
| `src/pages/Inventory.tsx` | Persist viewMode, sortColumn, sortDirection to settings DB |
| `src/pages/Reports.tsx` | Persist selectedRangeIndex to settings DB |
| `src/components/ErrorBoundary.tsx` | New crash protection component |
| `src/App.tsx` | Wrap routes with ErrorBoundary |
| `src/services/inventoryService.ts` | Add defensive error logging |

This ensures all user preferences survive app restarts, phone reboots, and unexpected errors — delivering a stable, professional experience.
