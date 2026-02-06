// Professional Theme Presets
// 9 carefully designed themes + default

import type { ThemePreset, ThemeColors } from '@/types/theme';

// Default theme colors (matches current index.css)
const defaultLight: ThemeColors = {
  primary: '152 45% 38%',
  primaryForeground: '0 0% 100%',
  secondary: '220 14% 94%',
  secondaryForeground: '220 25% 25%',
  accent: '152 45% 38%',
  accentForeground: '0 0% 100%',
  background: '220 20% 97%',
  foreground: '220 25% 20%',
  card: '0 0% 100%',
  cardForeground: '220 25% 20%',
  popover: '0 0% 100%',
  popoverForeground: '220 25% 20%',
  destructive: '0 65% 50%',
  destructiveForeground: '0 0% 100%',
  warning: '35 85% 52%',
  warningForeground: '35 90% 15%',
  success: '152 45% 38%',
  successForeground: '0 0% 100%',
  info: '210 65% 48%',
  infoForeground: '0 0% 100%',
  muted: '220 14% 92%',
  mutedForeground: '220 10% 46%',
  border: '220 14% 88%',
  input: '220 14% 88%',
  ring: '152 45% 38%',
  chartSales: '152 45% 42%',
  chartProfit: '210 65% 50%',
  chartInventory: '175 50% 42%',
  chartAlert: '0 65% 55%',
  chartNeutral: '220 10% 60%',
};

const defaultDark: ThemeColors = {
  primary: '152 42% 45%',
  primaryForeground: '220 18% 8%',
  secondary: '220 14% 18%',
  secondaryForeground: '220 15% 85%',
  accent: '152 42% 45%',
  accentForeground: '220 18% 8%',
  background: '220 18% 8%',
  foreground: '220 15% 88%',
  card: '220 16% 12%',
  cardForeground: '220 15% 90%',
  popover: '220 16% 12%',
  popoverForeground: '220 15% 90%',
  destructive: '0 60% 55%',
  destructiveForeground: '0 0% 100%',
  warning: '35 75% 50%',
  warningForeground: '35 90% 10%',
  success: '152 42% 45%',
  successForeground: '220 18% 8%',
  info: '210 60% 55%',
  infoForeground: '0 0% 100%',
  muted: '220 12% 20%',
  mutedForeground: '220 10% 55%',
  border: '220 12% 22%',
  input: '220 12% 18%',
  ring: '152 42% 45%',
  chartSales: '152 40% 48%',
  chartProfit: '210 55% 55%',
  chartInventory: '175 45% 48%',
  chartAlert: '0 55% 58%',
  chartNeutral: '220 8% 50%',
};

// Glacier - Cool blue tones
const glacierLight: ThemeColors = {
  ...defaultLight,
  primary: '200 70% 45%',
  primaryForeground: '0 0% 100%',
  accent: '195 65% 50%',
  accentForeground: '0 0% 100%',
  success: '170 60% 40%',
  successForeground: '0 0% 100%',
  ring: '200 70% 45%',
  chartSales: '200 60% 50%',
  chartProfit: '170 55% 45%',
  chartInventory: '185 50% 45%',
};

const glacierDark: ThemeColors = {
  ...defaultDark,
  primary: '200 65% 55%',
  primaryForeground: '200 80% 10%',
  accent: '195 60% 50%',
  accentForeground: '200 80% 10%',
  success: '170 55% 50%',
  successForeground: '170 80% 10%',
  ring: '200 65% 55%',
  chartSales: '200 55% 55%',
  chartProfit: '170 50% 50%',
  chartInventory: '185 45% 50%',
};

// Harvest - Warm orange tones
const harvestLight: ThemeColors = {
  ...defaultLight,
  primary: '25 85% 50%',
  primaryForeground: '0 0% 100%',
  accent: '35 80% 55%',
  accentForeground: '25 90% 15%',
  success: '85 50% 42%',
  successForeground: '0 0% 100%',
  ring: '25 85% 50%',
  chartSales: '25 75% 55%',
  chartProfit: '85 45% 45%',
  chartInventory: '45 65% 50%',
};

const harvestDark: ThemeColors = {
  ...defaultDark,
  primary: '25 75% 55%',
  primaryForeground: '25 90% 10%',
  accent: '35 70% 50%',
  accentForeground: '25 90% 10%',
  success: '85 45% 50%',
  successForeground: '85 80% 10%',
  ring: '25 75% 55%',
  chartSales: '25 65% 55%',
  chartProfit: '85 40% 50%',
  chartInventory: '45 55% 50%',
};

// Lavender - Soft purple tones
const lavenderLight: ThemeColors = {
  ...defaultLight,
  primary: '270 50% 55%',
  primaryForeground: '0 0% 100%',
  accent: '280 45% 60%',
  accentForeground: '0 0% 100%',
  success: '165 50% 42%',
  successForeground: '0 0% 100%',
  ring: '270 50% 55%',
  chartSales: '270 45% 55%',
  chartProfit: '165 45% 45%',
  chartInventory: '250 40% 55%',
};

const lavenderDark: ThemeColors = {
  ...defaultDark,
  primary: '270 45% 60%',
  primaryForeground: '270 80% 10%',
  accent: '280 40% 55%',
  accentForeground: '270 80% 10%',
  success: '165 45% 50%',
  successForeground: '165 80% 10%',
  ring: '270 45% 60%',
  chartSales: '270 40% 58%',
  chartProfit: '165 40% 50%',
  chartInventory: '250 35% 55%',
};

// Brutalist - High contrast monochrome
const brutalistLight: ThemeColors = {
  ...defaultLight,
  primary: '0 0% 15%',
  primaryForeground: '0 0% 100%',
  secondary: '0 0% 92%',
  secondaryForeground: '0 0% 15%',
  accent: '0 0% 25%',
  accentForeground: '0 0% 100%',
  background: '0 0% 98%',
  foreground: '0 0% 10%',
  card: '0 0% 100%',
  cardForeground: '0 0% 10%',
  muted: '0 0% 94%',
  mutedForeground: '0 0% 40%',
  border: '0 0% 82%',
  ring: '0 0% 15%',
  chartSales: '0 0% 25%',
  chartProfit: '0 0% 45%',
  chartInventory: '0 0% 60%',
  chartNeutral: '0 0% 70%',
};

const brutalistDark: ThemeColors = {
  ...defaultDark,
  primary: '0 0% 90%',
  primaryForeground: '0 0% 5%',
  secondary: '0 0% 18%',
  secondaryForeground: '0 0% 90%',
  accent: '0 0% 85%',
  accentForeground: '0 0% 5%',
  background: '0 0% 5%',
  foreground: '0 0% 92%',
  card: '0 0% 10%',
  cardForeground: '0 0% 92%',
  muted: '0 0% 15%',
  mutedForeground: '0 0% 55%',
  border: '0 0% 20%',
  ring: '0 0% 90%',
  chartSales: '0 0% 75%',
  chartProfit: '0 0% 55%',
  chartInventory: '0 0% 40%',
  chartNeutral: '0 0% 30%',
};

// Obsidian - Deep dark with teal accent
const obsidianLight: ThemeColors = {
  ...defaultLight,
  primary: '175 65% 40%',
  primaryForeground: '0 0% 100%',
  accent: '185 60% 45%',
  accentForeground: '0 0% 100%',
  background: '200 15% 96%',
  card: '200 10% 100%',
  ring: '175 65% 40%',
  chartSales: '175 55% 45%',
  chartProfit: '200 50% 50%',
  chartInventory: '160 50% 42%',
};

const obsidianDark: ThemeColors = {
  ...defaultDark,
  primary: '175 55% 50%',
  primaryForeground: '175 80% 8%',
  accent: '185 50% 45%',
  accentForeground: '175 80% 8%',
  background: '200 25% 6%',
  foreground: '180 15% 90%',
  card: '200 20% 10%',
  cardForeground: '180 15% 90%',
  muted: '200 15% 15%',
  border: '200 15% 18%',
  ring: '175 55% 50%',
  chartSales: '175 50% 52%',
  chartProfit: '200 45% 55%',
  chartInventory: '160 45% 48%',
};

// Orchid - Pink/magenta tones
const orchidLight: ThemeColors = {
  ...defaultLight,
  primary: '330 65% 52%',
  primaryForeground: '0 0% 100%',
  accent: '340 60% 58%',
  accentForeground: '0 0% 100%',
  success: '160 55% 40%',
  successForeground: '0 0% 100%',
  ring: '330 65% 52%',
  chartSales: '330 55% 55%',
  chartProfit: '160 50% 45%',
  chartInventory: '300 45% 55%',
};

const orchidDark: ThemeColors = {
  ...defaultDark,
  primary: '330 55% 60%',
  primaryForeground: '330 80% 10%',
  accent: '340 50% 55%',
  accentForeground: '330 80% 10%',
  success: '160 50% 48%',
  successForeground: '160 80% 10%',
  ring: '330 55% 60%',
  chartSales: '330 50% 58%',
  chartProfit: '160 45% 50%',
  chartInventory: '300 40% 55%',
};

// Solar - Yellow/amber tones
const solarLight: ThemeColors = {
  ...defaultLight,
  primary: '42 85% 48%',
  primaryForeground: '42 90% 12%',
  accent: '35 80% 52%',
  accentForeground: '35 90% 12%',
  success: '95 55% 42%',
  successForeground: '0 0% 100%',
  ring: '42 85% 48%',
  chartSales: '42 75% 52%',
  chartProfit: '95 50% 45%',
  chartInventory: '55 65% 50%',
};

const solarDark: ThemeColors = {
  ...defaultDark,
  primary: '42 75% 55%',
  primaryForeground: '42 90% 8%',
  accent: '35 70% 50%',
  accentForeground: '35 90% 8%',
  success: '95 50% 48%',
  successForeground: '95 80% 10%',
  ring: '42 75% 55%',
  chartSales: '42 65% 55%',
  chartProfit: '95 45% 50%',
  chartInventory: '55 55% 52%',
};

// Tide - Blue/cyan tones
const tideLight: ThemeColors = {
  ...defaultLight,
  primary: '195 80% 42%',
  primaryForeground: '0 0% 100%',
  accent: '180 70% 45%',
  accentForeground: '0 0% 100%',
  success: '155 55% 42%',
  successForeground: '0 0% 100%',
  ring: '195 80% 42%',
  chartSales: '195 70% 48%',
  chartProfit: '155 50% 45%',
  chartInventory: '210 55% 50%',
};

const tideDark: ThemeColors = {
  ...defaultDark,
  primary: '195 70% 52%',
  primaryForeground: '195 85% 10%',
  accent: '180 60% 48%',
  accentForeground: '195 85% 10%',
  success: '155 50% 50%',
  successForeground: '155 80% 10%',
  ring: '195 70% 52%',
  chartSales: '195 60% 55%',
  chartProfit: '155 45% 50%',
  chartInventory: '210 50% 52%',
};

// Verdant - Green tones (enhanced version of default)
const verdantLight: ThemeColors = {
  ...defaultLight,
  primary: '140 60% 38%',
  primaryForeground: '0 0% 100%',
  accent: '160 55% 42%',
  accentForeground: '0 0% 100%',
  ring: '140 60% 38%',
  chartSales: '140 50% 45%',
  chartProfit: '180 45% 45%',
  chartInventory: '120 45% 42%',
};

const verdantDark: ThemeColors = {
  ...defaultDark,
  primary: '140 50% 48%',
  primaryForeground: '140 80% 10%',
  accent: '160 45% 45%',
  accentForeground: '140 80% 10%',
  ring: '140 50% 48%',
  chartSales: '140 45% 52%',
  chartProfit: '180 40% 50%',
  chartInventory: '120 40% 48%',
};

// All theme presets
export const themePresets: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Professional green theme',
    icon: '🌿',
    light: defaultLight,
    dark: defaultDark,
  },
  {
    id: 'glacier',
    name: 'Glacier',
    description: 'Cool blue tones',
    icon: '🧊',
    light: glacierLight,
    dark: glacierDark,
  },
  {
    id: 'harvest',
    name: 'Harvest',
    description: 'Warm orange tones',
    icon: '🍂',
    light: harvestLight,
    dark: harvestDark,
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'Soft purple tones',
    icon: '💜',
    light: lavenderLight,
    dark: lavenderDark,
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'High contrast monochrome',
    icon: '◼️',
    light: brutalistLight,
    dark: brutalistDark,
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Deep dark with teal accent',
    icon: '🖤',
    light: obsidianLight,
    dark: obsidianDark,
  },
  {
    id: 'orchid',
    name: 'Orchid',
    description: 'Pink and magenta tones',
    icon: '🌸',
    light: orchidLight,
    dark: orchidDark,
  },
  {
    id: 'solar',
    name: 'Solar',
    description: 'Yellow and amber tones',
    icon: '☀️',
    light: solarLight,
    dark: solarDark,
  },
  {
    id: 'tide',
    name: 'Tide',
    description: 'Blue and cyan tones',
    icon: '🌊',
    light: tideLight,
    dark: tideDark,
  },
  {
    id: 'verdant',
    name: 'Verdant',
    description: 'Rich green tones',
    icon: '🌲',
    light: verdantLight,
    dark: verdantDark,
  },
];

export function getPresetById(id: string): ThemePreset | undefined {
  return themePresets.find(p => p.id === id);
}

export function getPresetColors(presetId: string, mode: 'light' | 'dark'): ThemeColors {
  const preset = getPresetById(presetId) || themePresets[0];
  return mode === 'light' ? preset.light : preset.dark;
}
