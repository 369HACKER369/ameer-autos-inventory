// Industrial Theme Presets
// Two professional themes designed for heavy machinery and industrial inventory use

import type { ThemePreset, ThemeColors, ThemeId } from '@/types/theme';

// ============================================
// INDUSTRIAL DARK THEME
// Professional dark mode for heavy-duty workshop use
// ============================================
const industrialDarkColors: ThemeColors = {
  // Core colors - Deep Blue primary with Industrial Orange accent
  primary: '207 90% 32%',              // #0D47A1 - Deep Blue
  primaryForeground: '0 0% 100%',      // White
  secondary: '200 18% 26%',            // #37474F - Slate Gray
  secondaryForeground: '200 10% 85%',  // #B0BEC5
  accent: '27 100% 50%',               // #FF6D00 - Industrial Orange
  accentForeground: '0 0% 100%',       // White
  
  // Background colors - AMOLED dark surfaces
  background: '0 0% 7%',               // #121212
  foreground: '0 0% 100%',             // White
  card: '0 0% 12%',                    // #1E1E1E
  cardForeground: '0 0% 100%',         // White
  popover: '0 0% 12%',                 // #1E1E1E
  popoverForeground: '0 0% 100%',      // White
  
  // Semantic colors
  destructive: '0 72% 51%',            // #D32F2F
  destructiveForeground: '0 0% 100%',  // White
  warning: '27 100% 50%',              // #FF6D00 - matches accent
  warningForeground: '0 0% 100%',      // White
  success: '122 39% 39%',              // #388E3C
  successForeground: '0 0% 100%',      // White
  info: '207 90% 54%',                 // #1E88E5
  infoForeground: '0 0% 100%',         // White
  
  // UI colors
  muted: '200 15% 16%',                // Slightly lighter than card
  mutedForeground: '200 10% 65%',      // #78909C - Muted text
  border: '200 24% 23%',               // #263238
  input: '200 18% 20%',                // Slightly lighter for inputs
  ring: '27 100% 50%',                 // Industrial Orange - focus ring
  
  // Chart colors - gradients from primary to accent
  chartPrimary: '207 90% 40%',         // Deep Blue
  chartSecondary: '200 18% 35%',       // Slate Gray
  chartAccent: '27 100% 50%',          // Industrial Orange
  chartSuccess: '122 39% 45%',         // Green
  chartWarning: '27 100% 55%',         // Orange
  chartNeutral: '200 10% 50%',         // Gray

  // Sidebar colors
  sidebarBackground: '0 0% 9%',        // Slightly lighter than bg
  sidebarForeground: '0 0% 100%',      // White
  sidebarPrimary: '207 90% 32%',       // Deep Blue
  sidebarPrimaryForeground: '0 0% 100%', // White
  sidebarAccent: '200 15% 16%',        // Muted
  sidebarAccentForeground: '200 10% 85%', // Light gray
  sidebarBorder: '200 24% 23%',        // Border
};

// ============================================
// FACTORY LIGHT THEME
// Bright, clean, professional theme for office/shop usage
// ============================================
const factoryLightColors: ThemeColors = {
  // Core colors - Slate Gray primary with Amber accent
  primary: '200 18% 26%',              // #37474F - Slate Gray
  primaryForeground: '0 0% 100%',      // White
  secondary: '200 16% 62%',            // #90A4AE - Soft Gray-Blue
  secondaryForeground: '0 0% 100%',    // White
  accent: '38 100% 50%',               // #FF8F00 - Warning Amber
  accentForeground: '0 0% 13%',        // Dark text on amber
  
  // Background colors - Clean light surfaces
  background: '0 0% 96%',              // #F5F5F5
  foreground: '0 0% 13%',              // #212121
  card: '0 0% 100%',                   // White
  cardForeground: '0 0% 13%',          // #212121
  popover: '0 0% 100%',                // White
  popoverForeground: '0 0% 13%',       // #212121
  
  // Semantic colors
  destructive: '0 72% 51%',            // #D32F2F
  destructiveForeground: '0 0% 100%',  // White
  warning: '38 100% 50%',              // #FF8F00 - matches accent
  warningForeground: '0 0% 13%',       // Dark text
  success: '122 39% 39%',              // #388E3C
  successForeground: '0 0% 100%',      // White
  info: '207 90% 54%',                 // #1E88E5
  infoForeground: '0 0% 100%',         // White
  
  // UI colors
  muted: '200 12% 90%',                // Light muted
  mutedForeground: '200 18% 34%',      // #546E7A - Secondary text
  border: '200 14% 82%',               // #CFD8DC
  input: '200 14% 86%',                // Slightly darker for inputs
  ring: '38 100% 50%',                 // Amber - focus ring
  
  // Chart colors - gradients from primary to accent
  chartPrimary: '200 18% 32%',         // Slate Gray
  chartSecondary: '200 16% 55%',       // Soft Gray-Blue
  chartAccent: '38 100% 50%',          // Amber
  chartSuccess: '122 39% 45%',         // Green
  chartWarning: '38 100% 55%',         // Amber
  chartNeutral: '200 12% 60%',         // Gray

  // Sidebar colors
  sidebarBackground: '0 0% 98%',       // Almost white
  sidebarForeground: '0 0% 13%',       // Dark text
  sidebarPrimary: '200 18% 26%',       // Slate Gray
  sidebarPrimaryForeground: '0 0% 100%', // White
  sidebarAccent: '200 12% 92%',        // Light muted
  sidebarAccentForeground: '200 18% 34%', // Secondary text
  sidebarBorder: '200 14% 82%',        // Border
};

// ============================================
// THEME PRESETS EXPORT
// ============================================
export const themePresets: ThemePreset[] = [
  {
    id: 'industrial-dark',
    name: 'Industrial Dark',
    description: 'Professional dark mode for heavy-duty workshop use',
    icon: '⚙️',
    category: 'dark',
    colors: industrialDarkColors,
  },
  {
    id: 'factory-light',
    name: 'Factory Light',
    description: 'Bright, clean industrial theme for office/shop usage',
    icon: '🏭',
    category: 'light',
    colors: factoryLightColors,
  },
];

export function getPresetById(id: ThemeId): ThemePreset {
  return themePresets.find(p => p.id === id) || themePresets[0];
}

export function getPresetColors(themeId: ThemeId): ThemeColors {
  const preset = getPresetById(themeId);
  return preset.colors;
}

export function getThemeCategory(themeId: ThemeId): 'dark' | 'light' {
  const preset = getPresetById(themeId);
  return preset.category;
}
