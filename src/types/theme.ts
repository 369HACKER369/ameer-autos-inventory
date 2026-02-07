// Theme System Types
// Comprehensive type definitions for the advanced theming system

export interface ThemeColors {
  // Core colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  
  // Background colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  
  // Semantic colors
  destructive: string;
  destructiveForeground: string;
  warning: string;
  warningForeground: string;
  success: string;
  successForeground: string;
  info: string;
  infoForeground: string;
  
  // UI colors
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  
  // Chart colors
  chartSales: string;
  chartProfit: string;
  chartInventory: string;
  chartAlert: string;
  chartNeutral: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface SectionOverride {
  enabled: boolean;
  colors: Partial<{
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    accent: string;
    border: string;
  }>;
}

export interface SectionOverrides {
  dashboard?: SectionOverride;
  inventory?: SectionOverride;
  reports?: SectionOverride;
  settings?: SectionOverride;
}

export interface CustomThemeConfig {
  enabled: boolean;
  basePreset: string;
  colors: Partial<ThemeColors>;
  sectionOverrides: SectionOverrides;
}

export interface ThemeState {
  // Base mode
  mode: 'light' | 'dark' | 'system';
  
  // Selected preset
  selectedPreset: string;
  
  // Custom theme configuration
  customConfig: CustomThemeConfig;
  
  // Resolved mode (after system preference)
  resolvedMode: 'light' | 'dark';
}

export type ThemePresetId = 
  | 'default'
  | 'glacier'
  | 'harvest'
  | 'lavender'
  | 'brutalist'
  | 'obsidian'
  | 'orchid'
  | 'solar'
  | 'tide'
  | 'verdant'
  | 'industrial-steel'
  | 'factory-floor';

// Color validation types
export interface ContrastResult {
  ratio: number;
  aa: boolean;
  aaa: boolean;
}

export interface ColorValidation {
  isValid: boolean;
  contrastRatio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  suggestions?: string[];
}
