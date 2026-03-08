

## Bug Fix: Backup Restore Data Loss on Refresh

### Root Cause

The data loss chain is:

1. `importDatabase()` clears **all tables** including `settings` (line 168-172 of database.ts)
2. The backup's `settings` array is restored, but it may not contain the `demoDataCleared` flag
3. On next app load, `AppContext.tsx` line 84 calls `clearAllDemoData()`
4. Since `demoDataCleared` setting is missing, the cleanup runs and **deletes all brands and categories that aren't referenced by parts** — and if the backup had standalone brands/categories, they get wiped as "orphans"
5. Additionally, the restore flow doesn't trigger a React state refresh — it just shows a toast saying "Please refresh"

### Fix (2 files)

**1. `src/services/demoSeedService.ts`** — Make `clearAllDemoData` only delete items explicitly marked as demo, not orphans:
- Remove the orphan brand/category cleanup entirely (lines 18-33). It's destructive and unnecessary now that demo data seeding is disabled.
- Keep only the `isDemo` part deletion and the flag set.

**2. `src/pages/settings/BackupRestore.tsx`** — After successful restore, force a full page reload so all React state and Dexie live queries re-initialize from the freshly imported data:
- Replace `toast.success('Backup restored successfully! Please refresh the app.')` with `window.location.reload()` after a brief toast.

**3. `src/db/database.ts`** — In `importDatabase`, after restoring settings, ensure the `demoDataCleared` flag is always set so the cleanup never runs on restored data:
- After `bulkAdd` of settings, add `demoDataCleared = true` setting if not already present in the imported data.

