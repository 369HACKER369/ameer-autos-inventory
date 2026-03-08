

## Add User Profile Section to Settings Page

### What
Add a profile card at the top of the Settings page (below the search bar) showing the shop name, a store avatar, and 3 quick stats from the existing `useApp()` context.

### Design
- **Avatar**: Large circle with store icon or first letter of `appName`
- **Shop name**: Bold, prominent text from `appName`
- **Subtitle**: "Inventory & Sales Manager"
- **Quick stats row**: 3 mini stat pills showing Total Parts, Total Brands, and Low Stock count — all already available from `useApp()`

Layout: Card with centered content, avatar on top, name below, then a horizontal row of 3 stats with icons.

### File Change
**`src/pages/Settings.tsx`**
- Import `Avatar`, `AvatarFallback` from UI components, plus `Package`, `Tags`, `AlertTriangle` icons
- Pull `totalParts`, `totalBrands`, `stats.lowStockCount`, `customLogo` from `useApp()`
- Add profile card between the search input and the Branding section
- 3 stats displayed as small bordered rounded boxes in a flex row

### Stats Shown
| Stat | Source | Icon |
|------|--------|------|
| Total Parts | `totalParts` | Package |
| Brands | `totalBrands` | Tags |
| Low Stock | `stats.lowStockCount` | AlertTriangle |

