

## Improve Settings Page with Section Headers and Better Visual Grouping

### Current Issue
The Settings page has grouped cards but no visible section headers -- users see a flat list of cards with no context for why items are grouped together. The Notifications and Activity Log cards also feel disconnected from other groups.

### Plan

**Single file change: `src/pages/Settings.tsx`**

#### 1. Add Section Headers
Add labeled headers above each card group with uppercase styling:
- **Branding** -- above the branding card
- **General** -- above the 5-item general settings card
- **Data & Sync** -- above sync card, and move Notifications + Activity Log into this group
- **Legal & Info** -- above the legal card

Each header: `<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Section Name</p>`

Headers are hidden when their group is empty (filtered out by search).

#### 2. Consolidate Notifications into Data & Sync Group
Move the standalone Notifications card into the "Data & Sync" card alongside Google Drive and Backup items -- it logically fits with alerts/sync. The switch toggle stays inline.

#### 3. Simplify Activity Log Card
Move Activity Log as a regular `SettingItem` into its own "Activity & Logs" section header, keeping the Backup/Sync shortcut buttons below it but styled more subtly.

#### 4. Increase Section Spacing
Change outer `space-y-4` to `space-y-6` for better breathing room between sections. Within each section, use `space-y-1.5` between header and card.

#### 5. Wrap Each Section in a Fragment
Each section (header + card) wrapped in a container div with `space-y-1.5` so the header sits close to its card.

### Result
Clear visual hierarchy: users instantly see "General", "Data & Sync", "Legal & Info" labels above each group, making the page scannable and professional.

