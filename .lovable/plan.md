

## Upgrade Icon System Across the Entire App

### Scope
Visual-only changes to icon choices, sizing, container styling, and color treatment. No functionality, navigation, or logic changes.

### Current State
The app uses `lucide-react` icons throughout (~49 files). Icons are generally appropriate but use basic styling — plain `h-5 w-5` sizing with minimal container treatment. The icon containers in Settings use a flat `bg-muted` square, KPI cards have basic rounded containers, and many screens lack visual polish in icon presentation.

### Approach
Rather than swapping the icon library (Lucide is excellent and tree-shakable), the upgrade focuses on:

1. **Better icon choices** — Replace generic icons with more specific, descriptive alternatives from Lucide
2. **Premium icon containers** — Add gradient backgrounds, subtle shadows, and rounded styling
3. **Consistent sizing system** — Enforce a size hierarchy across the app
4. **Color-coded icon treatments** — Each section gets a distinct accent color for its icon container

### Changes by File

**1. `src/pages/Settings.tsx`** — Premium icon containers with individual accent colors
- Replace flat `bg-muted` icon containers with color-coded gradient backgrounds (e.g., Globe → blue tint, Palette → purple tint, Cloud → sky tint, Database → emerald tint, Shield → amber tint)
- Swap generic icons: `ImageIcon` → `Store`, `Database` → `HardDrive`, `Info` → `BadgeInfo`, `FileText` → `ScrollText`
- Add subtle `shadow-sm` to icon containers

**2. `src/pages/Dashboard.tsx`** — Enhanced KPI and action icons
- Quick Actions: Replace `Plus` → `PackagePlus`, `ShoppingCart` → `Receipt`, `Zap` → `BoltIcon`; add colored gradient containers per action
- Activity icons: upgrade container styling with subtle border treatment
- Weekly Sales icon: `TrendingUp` → `ArrowUpRight` for a more modern feel

**3. `src/pages/Inventory.tsx`** — Refined toolbar and empty state icons
- View mode icons: add active state background treatment
- Filter icon: `Filter` → `SlidersHorizontal` for modern look
- Empty state: larger icon (48px) with muted gradient container
- Search icon styling with primary color on focus

**4. `src/components/layout/BottomNav.tsx`** — Premium nav icons
- Replace `LayoutDashboard` → `LayoutGrid`, `Package` → `Boxes`, `BarChart3` → `ChartColumnBig`
- Active state: filled-style appearance via increased strokeWidth + scale
- Add subtle icon container background on active state

**5. `src/components/layout/SidebarNav.tsx`** — Match BottomNav icon upgrades
- Same icon replacements as BottomNav for consistency
- Add individual color accents per nav item icon container

**6. `src/components/layout/Header.tsx`** — Refined header icons
- Back arrow: `ChevronLeft` → `ArrowLeft` for a cleaner look
- Menu hamburger: slightly larger touch target styling

**7. `src/pages/BillHistory.tsx`** — Bill action icons
- `Plus` → `FilePlus2`, `Palette` → `SwatchBook`
- Dropdown actions: `ImageIcon` → `Camera`, `MessageCircle` → `MessageCircleMore`

**8. `src/pages/RecordSale.tsx`** — Sale flow icons
- `ShoppingCart` → `HandCoins` for the sale action
- Empty/success states with premium containers

**9. `src/pages/Reports.tsx`** — Chart section icons
- Ensure report cards use distinct colored icon containers
- Swap any generic icons for more descriptive chart-type icons

**10. `src/pages/AddEditPart.tsx`** — Form icons
- `Camera` → `ImagePlus` consistency, ensure image picker icons are polished

**11. `src/components/layout/NotificationCenter.tsx`** — Alert bell and notification type icons
- Add colored dot/badge styling for notification types

**12. `src/pages/settings/ActivityLogSettings.tsx`** — Activity log icons
- Match dashboard activity icon upgrades

**13. Empty state pattern** — Create a consistent empty state icon treatment
- All empty states: 48px icon inside a 80px rounded-2xl muted/gradient container
- Consistent text hierarchy below

### Icon Size System (enforced consistently)
| Context | Icon Size | Container |
|---------|-----------|-----------|
| Bottom nav | `h-5 w-5` | none |
| Toolbar/header buttons | `h-5 w-5` | ghost button |
| Settings list items | `h-5 w-5` | `h-10 w-10` rounded-xl colored bg |
| KPI cards | `h-5 w-5` | `h-10 w-10` rounded-xl |
| Quick action buttons | `h-5 w-5` | `h-10 w-10` rounded-xl |
| Empty states | `h-10 w-10` | `h-20 w-20` rounded-2xl |
| Card section headers | `h-4 w-4` | inline with text |

### Color Treatment for Settings Icon Containers
- Language/Globe → `bg-blue-500/10 text-blue-500`
- Theme/Palette → `bg-purple-500/10 text-purple-500`
- Typography → `bg-indigo-500/10 text-indigo-500`
- Navigation → `bg-teal-500/10 text-teal-500`
- Autocomplete → `bg-amber-500/10 text-amber-500`
- Cloud Sync → `bg-sky-500/10 text-sky-500`
- Backup → `bg-emerald-500/10 text-emerald-500`
- Notifications → `bg-orange-500/10 text-orange-500`
- About → `bg-slate-500/10 text-slate-500`
- Privacy → `bg-green-500/10 text-green-500`
- Terms → `bg-rose-500/10 text-rose-500`
- Branding → `bg-primary/10 text-primary`

### Files Modified (~12-13 files)
All visual-only. No data models, services, routing, or business logic touched.

