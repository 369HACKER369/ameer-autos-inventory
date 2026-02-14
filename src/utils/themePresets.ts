// Industrial Theme Presets
// Two professional themes designed for heavy machinery and industrial inventory use

import type { ThemePreset, ThemeColors, ThemeId } from '@/types/theme';

// ============================================
// INDUSTRIAL DARK THEME
// Professional dark mode for heavy-duty workshop use
// ============================================
const industrialDarkColors: ThemeColors = {
  primary: '43 96% 56%',
  primaryForeground: '20 91% 14%',
  secondary: '24 5% 44%',
  secondaryForeground: '60 9% 97%',
  accent: '25 83% 14%',
  accentForeground: '47 95% 53%',
  background: '24 9% 10%',
  foreground: '60 9% 97%',
  card: '12 6% 15%',
  cardForeground: '60 9% 97%',
  popover: '30 6% 25%',
  popoverForeground: '60 9% 97%',
  destructive: '0 84% 60%',
  destructiveForeground: '0 85% 97%',
  warning: '43 96% 56%',
  warningForeground: '20 91% 14%',
  success: '122 39% 39%',
  successForeground: '0 0% 100%',
  info: '207 90% 54%',
  infoForeground: '0 0% 100%',
  muted: '24 5% 44%',
  mutedForeground: '60 9% 97%',
  border: '33 5% 32%',
  input: '33 5% 32%',
  ring: '43 96% 56%',
  chartPrimary: '45 96% 64%',
  chartSecondary: '48 96% 76%',
  chartAccent: '43 96% 56%',
  chartSuccess: '37 92% 50%',
  chartWarning: '33 5% 32%',
  chartNeutral: '24 5% 44%',
  sidebarBackground: '12 6% 15%',
  sidebarForeground: '60 9% 97%',
  sidebarPrimary: '43 96% 56%',
  sidebarPrimaryForeground: '20 91% 14%',
  sidebarAccent: '47 95% 53%',
  sidebarAccentForeground: '25 83% 14%',
  sidebarBorder: '33 5% 32%',
};

// ============================================
// FACTORY LIGHT THEME
// Bright, clean, professional theme for office/shop usage
// ============================================
const factoryLightColors: ThemeColors = {
  primary: '37 92% 50%',
  primaryForeground: '47 100% 96%',
  secondary: '24 5% 44%',
  secondaryForeground: '60 9% 97%',
  accent: '47 100% 96%',
  accentForeground: '37 92% 50%',
  background: '60 4% 95%',
  foreground: '24 9% 10%',
  card: '60 9% 97%',
  cardForeground: '24 9% 10%',
  popover: '20 5% 90%',
  popoverForeground: '24 9% 10%',
  destructive: '0 72% 50%',
  destructiveForeground: '0 85% 97%',
  warning: '37 92% 50%',
  warningForeground: '47 100% 96%',
  success: '122 39% 39%',
  successForeground: '0 0% 100%',
  info: '207 90% 54%',
  infoForeground: '0 0% 100%',
  muted: '23 5% 82%',
  mutedForeground: '24 9% 10%',
  border: '23 5% 82%',
  input: '23 5% 82%',
  ring: '37 92% 50%',
  chartPrimary: '45 96% 64%',
  chartSecondary: '47 95% 53%',
  chartAccent: '43 96% 56%',
  chartSuccess: '37 92% 50%',
  chartWarning: '24 5% 44%',
  chartNeutral: '23 5% 82%',
  sidebarBackground: '60 9% 97%',
  sidebarForeground: '24 9% 10%',
  sidebarPrimary: '37 92% 50%',
  sidebarPrimaryForeground: '47 100% 96%',
  sidebarAccent: '24 5% 44%',
  sidebarAccentForeground: '60 9% 97%',
  sidebarBorder: '23 5% 82%',
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
