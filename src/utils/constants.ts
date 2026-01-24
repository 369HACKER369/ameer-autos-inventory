// Ameer Autos - Application Constants

// App Information
export const APP_NAME = 'Ameer Autos';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = 'Inventory & Sales Manager';

// Currency
export const CURRENCY_SYMBOL = 'Rs';
export const CURRENCY_CODE = 'PKR';
export const LOCALE = 'en-PK';

// Unit Types
export const UNIT_TYPES = [
  { value: 'piece', label: 'Piece' },
  { value: 'set', label: 'Set' },
  { value: 'pair', label: 'Pair' },
  { value: 'box', label: 'Box' },
  { value: 'custom', label: 'Custom' },
] as const;

// Stock Status
export const STOCK_STATUS = [
  { value: 'all', label: 'All Items' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
] as const;

// Default minimum stock level
export const DEFAULT_MIN_STOCK_LEVEL = 5;

// Maximum images per part
export const MAX_IMAGES_PER_PART = 5;

// Maximum image size (500KB)
export const MAX_IMAGE_SIZE = 500 * 1024;

// Accepted image types
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Thumbnail dimensions
export const THUMBNAIL_WIDTH = 100;
export const THUMBNAIL_HEIGHT = 100;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Activity log display limit
export const RECENT_ACTIVITY_LIMIT = 10;

// Low stock threshold (as percentage of min stock)
export const LOW_STOCK_THRESHOLD = 1; // <= minStockLevel

// Backup format options
export const BACKUP_FORMATS = [
  { value: 'json', label: 'JSON', extension: '.json' },
  { value: 'xlsx', label: 'Excel', extension: '.xlsx' },
  { value: 'csv', label: 'CSV', extension: '.csv' },
] as const;

// Theme options
export const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark (AMOLED)' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
] as const;

// Language options (for future)
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ur', label: 'اردو (Urdu)' },
] as const;

// Navigation items
export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/inventory', label: 'Inventory', icon: 'Package' },
  { path: '/reports', label: 'Reports', icon: 'BarChart3' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
] as const;

// Validation rules
export const VALIDATION = {
  name: { min: 3, max: 100 },
  sku: { min: 2, max: 50 },
  notes: { max: 500 },
  location: { max: 100 },
  phone: { pattern: /^(\+92|0)?[0-9]{10}$/ },
} as const;

// Chart colors (using CSS variables for theme support)
export const CHART_COLORS = {
  primary: 'hsl(142, 76%, 36%)',
  secondary: 'hsl(0, 0%, 65%)',
  success: 'hsl(142, 76%, 36%)',
  warning: 'hsl(38, 92%, 50%)',
  destructive: 'hsl(0, 84%, 60%)',
  muted: 'hsl(0, 0%, 45%)',
} as const;

// Export file prefixes
export const EXPORT_PREFIX = 'ameer-autos';

// Database name
export const DB_NAME = 'AmeerAutosDB';

// Local storage keys (for non-sensitive data)
export const STORAGE_KEYS = {
  viewMode: 'ameer-autos-view-mode',
  sidebarState: 'ameer-autos-sidebar',
  lastRoute: 'ameer-autos-last-route',
} as const;
