// Advanced Theme Context
// Manages theme state, presets, custom colors, and section overrides

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getSetting, updateSetting } from '@/db/database';
import type { ThemeState, CustomThemeConfig, ThemeColors, SectionOverrides } from '@/types/theme';
import { themePresets, getPresetColors } from '@/utils/themePresets';
import { applyThemeToDocument, validateColor, adjustForContrast } from '@/utils/themeUtils';

interface ThemeContextType {
  // Theme state
  themeState: ThemeState;
  
  // Mode controls
  setMode: (mode: 'light' | 'dark' | 'system') => Promise<void>;
  
  // Preset controls
  setPreset: (presetId: string) => Promise<void>;
  
  // Custom theme controls
  enableCustomTheme: (enabled: boolean) => Promise<void>;
  setCustomColor: (key: keyof ThemeColors, value: string) => Promise<void>;
  resetCustomColors: () => Promise<void>;
  
  // Section override controls
  setSectionOverride: (section: keyof SectionOverrides, colors: SectionOverrides[keyof SectionOverrides]) => Promise<void>;
  clearSectionOverride: (section: keyof SectionOverrides) => Promise<void>;
  
  // Utilities
  getCurrentColors: () => ThemeColors;
  getSectionColors: (section: keyof SectionOverrides) => Partial<ThemeColors>;
  validateThemeColor: (foreground: string, background: string) => { isValid: boolean; ratio: number };
  
  // Available presets
  presets: typeof themePresets;
  
  // Loading state
  isLoading: boolean;
}

const defaultCustomConfig: CustomThemeConfig = {
  enabled: false,
  basePreset: 'default',
  colors: {},
  sectionOverrides: {},
};

const defaultThemeState: ThemeState = {
  mode: 'dark',
  selectedPreset: 'default',
  customConfig: defaultCustomConfig,
  resolvedMode: 'dark',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AdvancedThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeState, setThemeState] = useState<ThemeState>(defaultThemeState);
  const [isLoading, setIsLoading] = useState(true);

  // Resolve system theme preference
  const resolveMode = useCallback((mode: 'light' | 'dark' | 'system'): 'light' | 'dark' => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode;
  }, []);

  // Load theme settings from database
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const savedMode = await getSetting<'light' | 'dark' | 'system'>('themeMode');
        const savedPreset = await getSetting<string>('themePreset');
        const savedCustomConfig = await getSetting<CustomThemeConfig>('themeCustomConfig');

        const mode = savedMode || 'dark';
        const resolvedMode = resolveMode(mode);

        setThemeState({
          mode,
          selectedPreset: savedPreset || 'default',
          customConfig: savedCustomConfig || defaultCustomConfig,
          resolvedMode,
        });
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemeSettings();
  }, [resolveMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeState.mode === 'system') {
        setThemeState(prev => ({
          ...prev,
          resolvedMode: resolveMode('system'),
        }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeState.mode, resolveMode]);

  // Get current theme colors
  const getCurrentColors = useCallback((): ThemeColors => {
    const baseColors = getPresetColors(themeState.selectedPreset, themeState.resolvedMode);
    
    if (themeState.customConfig.enabled && Object.keys(themeState.customConfig.colors).length > 0) {
      return { ...baseColors, ...themeState.customConfig.colors };
    }
    
    return baseColors;
  }, [themeState]);

  // Apply theme to document
  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    
    // Apply light/dark class
    root.classList.remove('light', 'dark');
    root.classList.add(themeState.resolvedMode);

    // Get and apply colors
    const colors = getCurrentColors();
    
    // Convert ThemeColors to CSS variable format
    const cssVars: Record<string, string> = {
      'primary': colors.primary,
      'primary-foreground': colors.primaryForeground,
      'secondary': colors.secondary,
      'secondary-foreground': colors.secondaryForeground,
      'accent': colors.accent,
      'accent-foreground': colors.accentForeground,
      'background': colors.background,
      'foreground': colors.foreground,
      'card': colors.card,
      'card-foreground': colors.cardForeground,
      'popover': colors.popover,
      'popover-foreground': colors.popoverForeground,
      'destructive': colors.destructive,
      'destructive-foreground': colors.destructiveForeground,
      'warning': colors.warning,
      'warning-foreground': colors.warningForeground,
      'success': colors.success,
      'success-foreground': colors.successForeground,
      'info': colors.info,
      'info-foreground': colors.infoForeground,
      'muted': colors.muted,
      'muted-foreground': colors.mutedForeground,
      'border': colors.border,
      'input': colors.input,
      'ring': colors.ring,
      'chart-sales': colors.chartSales,
      'chart-profit': colors.chartProfit,
      'chart-inventory': colors.chartInventory,
      'chart-alert': colors.chartAlert,
      'chart-neutral': colors.chartNeutral,
    };

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [themeState, isLoading, getCurrentColors]);

  // Set mode
  const setMode = useCallback(async (mode: 'light' | 'dark' | 'system') => {
    const resolvedMode = resolveMode(mode);
    setThemeState(prev => ({ ...prev, mode, resolvedMode }));
    await updateSetting('themeMode', mode);
  }, [resolveMode]);

  // Set preset
  const setPreset = useCallback(async (presetId: string) => {
    setThemeState(prev => ({ ...prev, selectedPreset: presetId }));
    await updateSetting('themePreset', presetId);
  }, []);

  // Enable/disable custom theme
  const enableCustomTheme = useCallback(async (enabled: boolean) => {
    setThemeState(prev => ({
      ...prev,
      customConfig: { ...prev.customConfig, enabled },
    }));
    await updateSetting('themeCustomConfig', {
      ...themeState.customConfig,
      enabled,
    });
  }, [themeState.customConfig]);

  // Set custom color
  const setCustomColor = useCallback(async (key: keyof ThemeColors, value: string) => {
    const newColors = { ...themeState.customConfig.colors, [key]: value };
    const newConfig = { ...themeState.customConfig, colors: newColors };
    
    setThemeState(prev => ({
      ...prev,
      customConfig: newConfig,
    }));
    await updateSetting('themeCustomConfig', newConfig);
  }, [themeState.customConfig]);

  // Reset custom colors
  const resetCustomColors = useCallback(async () => {
    const newConfig = { ...themeState.customConfig, colors: {}, sectionOverrides: {} };
    setThemeState(prev => ({
      ...prev,
      customConfig: newConfig,
    }));
    await updateSetting('themeCustomConfig', newConfig);
  }, [themeState.customConfig]);

  // Set section override
  const setSectionOverride = useCallback(async (
    section: keyof SectionOverrides,
    override: SectionOverrides[keyof SectionOverrides]
  ) => {
    const newOverrides = { ...themeState.customConfig.sectionOverrides, [section]: override };
    const newConfig = { ...themeState.customConfig, sectionOverrides: newOverrides };
    
    setThemeState(prev => ({
      ...prev,
      customConfig: newConfig,
    }));
    await updateSetting('themeCustomConfig', newConfig);
  }, [themeState.customConfig]);

  // Clear section override
  const clearSectionOverride = useCallback(async (section: keyof SectionOverrides) => {
    const newOverrides = { ...themeState.customConfig.sectionOverrides };
    delete newOverrides[section];
    const newConfig = { ...themeState.customConfig, sectionOverrides: newOverrides };
    
    setThemeState(prev => ({
      ...prev,
      customConfig: newConfig,
    }));
    await updateSetting('themeCustomConfig', newConfig);
  }, [themeState.customConfig]);

  // Get section colors (with overrides)
  const getSectionColors = useCallback((section: keyof SectionOverrides): Partial<ThemeColors> => {
    const baseColors = getCurrentColors();
    const sectionOverride = themeState.customConfig.sectionOverrides[section];
    
    if (sectionOverride?.enabled && sectionOverride.colors) {
      return { ...baseColors, ...sectionOverride.colors };
    }
    
    return baseColors;
  }, [getCurrentColors, themeState.customConfig.sectionOverrides]);

  // Validate theme color
  const validateThemeColor = useCallback((foreground: string, background: string) => {
    const result = validateColor(foreground, background);
    return { isValid: result.isValid, ratio: result.contrastRatio };
  }, []);

  const value = useMemo<ThemeContextType>(() => ({
    themeState,
    setMode,
    setPreset,
    enableCustomTheme,
    setCustomColor,
    resetCustomColors,
    setSectionOverride,
    clearSectionOverride,
    getCurrentColors,
    getSectionColors,
    validateThemeColor,
    presets: themePresets,
    isLoading,
  }), [
    themeState,
    setMode,
    setPreset,
    enableCustomTheme,
    setCustomColor,
    resetCustomColors,
    setSectionOverride,
    clearSectionOverride,
    getCurrentColors,
    getSectionColors,
    validateThemeColor,
    isLoading,
  ]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAdvancedTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAdvancedTheme must be used within an AdvancedThemeProvider');
  }
  return context;
}
