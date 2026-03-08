

## Redesign: About, Privacy Policy & Terms and Conditions Pages

### Current State
All three pages are functional but minimal -- short bullet lists, sparse content, and a basic card layout. They don't reflect the full feature set of the app (notifications, bill generator, bulk actions, autocomplete, backup/restore, etc.) and lack the polish expected from a production app.

### Plan

#### 1. About Page (`src/pages/settings/About.tsx`)
**Complete rewrite with these sections:**

- **Hero Card** -- App name pulled from `useApp().appName`, version badge, tagline, "Made in Pakistan" badge, and a brief mission statement
- **App Statistics Card** -- Live stats from `useApp()`: total parts, brands, categories, total sales count (gives the page a dynamic feel)
- **Key Features** -- Expanded to ~12 items covering all current features:
  - Inventory Management, Sales & Profit Tracking, Professional Reports & Analytics, Bill Generator (PDF/Image), Notification System (custom + low stock alerts), Smart Autocomplete, Backup & Restore, Google Drive Sync, Theme & AMOLED Black, Typography & Icon Sizing, Soft Delete System, QuickSell & Quick Actions
- **Tech Stack** -- Keep the current grouped grid but add Notifications (sonner, custom scheduler) group
- **Developer Card** -- Enhanced with avatar placeholder, role title, and email
- **Why Choose Us** -- Expanded with 3-4 highlight points in a grid (Offline-First, Crash-Safe, Rs Only, No Tracking)
- **Version History** -- Updated changelog to v1.3.0 reflecting notification system, bulk delete, autocomplete, bill features

#### 2. Privacy Policy Page (`src/pages/settings/PrivacyPolicy.tsx`)
**Expanded with more detailed, professional sections:**

- **Hero** -- Same shield icon, "Effective Date: March 2026", short summary paragraph
- **Data Collection & Storage** -- Expanded from 4 to 6 items:
  - Inventory Data, Sales & Reports, Billing Data, Notification Data (stored locally, never shared), Activity Logs (local audit trail), App Settings & Preferences
- **Data Security** -- New section: encryption at rest (IndexedDB), no external analytics, no third-party SDKs, crash-safe writes
- **Cloud Sync & Third Parties** -- Dedicated section: Google Drive is user-initiated only, API key encrypted locally, no other third-party services
- **Your Rights** -- Expanded: view/edit/delete records, export all data (PDF/Excel/CSV), disable sync anytime, clear all data, soft-delete protection
- **Data Retention** -- New section: data persists until user deletes, soft deletes archived, no automatic purging
- **Children's Privacy** -- Brief note: app not directed at children under 13
- **Contact Card** -- Developer email with last-updated date

#### 3. Terms & Conditions Page (`src/pages/settings/TermsConditions.tsx`)
**Expanded with comprehensive, numbered sections:**

- **Hero** -- FileText icon, effective date, brief intro paragraph
- **Acceptance of Terms** -- Expanded language
- **Use of App** -- More detail: intended for spare parts businesses in Pakistan, offline-first, user responsible for device security
- **User Responsibilities** -- New section: accurate data entry, device maintenance, backup responsibility
- **Data Integrity & Storage** -- IndexedDB guarantees, soft deletes, crash-safe architecture
- **Intellectual Property** -- All rights reserved to Zeeshan Khan
- **Cloud Sync Disclaimer** -- Sync is optional, app not liable for Google Drive issues, API key security is user's responsibility
- **Billing & Exports** -- Bills generated locally, accuracy is user's responsibility
- **Limitation of Liability** -- Financial losses, device failures, data corruption from external factors
- **Modifications to Terms** -- Updates shown in Settings, continued use = acceptance
- **Governing Law** -- Laws of Pakistan
- **Contact & Support** -- Developer email, support expectations

### Design Improvements (all three pages)

- **Numbered section badges** for Terms (e.g., "Section 1", "Section 2") for a legal-document feel
- **Gradient accent** on hero cards (subtle primary gradient background)
- **Separator** lines between major sections for visual hierarchy
- **"Last Updated" and "Effective Date"** timestamps in hero cards
- **Collapsible sections** on Terms page using Accordion for long content (keeps page scannable)
- **Consistent footer** across all three with app version + developer email

### Files to Modify
1. `src/pages/settings/About.tsx` -- Full rewrite
2. `src/pages/settings/PrivacyPolicy.tsx` -- Full rewrite
3. `src/pages/settings/TermsConditions.tsx` -- Full rewrite

No new dependencies needed. All components (Accordion, Badge, Separator, Card) already exist.

