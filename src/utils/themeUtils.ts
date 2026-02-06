// Theme Utility Functions
// Color validation, contrast checking, and HSL manipulation

import type { ContrastResult, ColorValidation } from '@/types/theme';

/**
 * Parse HSL string to components
 * Accepts formats: "220 15% 88%" or "hsl(220, 15%, 88%)"
 */
export function parseHSL(hsl: string): { h: number; s: number; l: number } | null {
  // Handle "h s% l%" format
  const simpleMatch = hsl.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%?\s+(\d+(?:\.\d+)?)%?$/);
  if (simpleMatch) {
    return {
      h: parseFloat(simpleMatch[1]),
      s: parseFloat(simpleMatch[2]),
      l: parseFloat(simpleMatch[3]),
    };
  }
  
  // Handle "hsl(h, s%, l%)" format
  const hslMatch = hsl.match(/hsl\((\d+(?:\.\d+)?),?\s*(\d+(?:\.\d+)?)%?,?\s*(\d+(?:\.\d+)?)%?\)/i);
  if (hslMatch) {
    return {
      h: parseFloat(hslMatch[1]),
      s: parseFloat(hslMatch[2]),
      l: parseFloat(hslMatch[3]),
    };
  }
  
  return null;
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert hex color to HSL string
 */
export function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 0%';
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  const { h, s, l } = rgbToHsl(r, g, b);
  return `${h} ${s}% ${l}%`;
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(hsl: string): string {
  const parsed = parseHSL(hsl);
  if (!parsed) return '#000000';
  
  const { r, g, b } = hslToRgb(parsed.h, parsed.s, parsed.l);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Calculate relative luminance for WCAG contrast
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const sRGB = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two HSL colors
 */
export function getContrastRatio(hsl1: string, hsl2: string): ContrastResult {
  const parsed1 = parseHSL(hsl1);
  const parsed2 = parseHSL(hsl2);
  
  if (!parsed1 || !parsed2) {
    return { ratio: 1, aa: false, aaa: false };
  }
  
  const rgb1 = hslToRgb(parsed1.h, parsed1.s, parsed1.l);
  const rgb2 = hslToRgb(parsed2.h, parsed2.s, parsed2.l);
  
  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
  };
}

/**
 * Validate a color for accessibility
 */
export function validateColor(
  foreground: string,
  background: string
): ColorValidation {
  const contrast = getContrastRatio(foreground, background);
  const suggestions: string[] = [];
  
  if (!contrast.aa) {
    suggestions.push('Increase contrast for better readability');
    
    const fgParsed = parseHSL(foreground);
    const bgParsed = parseHSL(background);
    
    if (fgParsed && bgParsed) {
      if (bgParsed.l > 50) {
        suggestions.push('Try using a darker foreground color');
      } else {
        suggestions.push('Try using a lighter foreground color');
      }
    }
  }
  
  return {
    isValid: contrast.aa,
    contrastRatio: contrast.ratio,
    meetsAA: contrast.aa,
    meetsAAA: contrast.aaa,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Adjust color lightness to meet contrast requirements
 */
export function adjustForContrast(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string {
  const fgParsed = parseHSL(foreground);
  const bgParsed = parseHSL(background);
  
  if (!fgParsed || !bgParsed) return foreground;
  
  let { h, s, l } = fgParsed;
  const bgLight = bgParsed.l;
  const direction = bgLight > 50 ? -1 : 1;
  
  // Iteratively adjust lightness
  for (let i = 0; i < 50; i++) {
    const testHsl = `${h} ${s}% ${l}%`;
    const contrast = getContrastRatio(testHsl, background);
    
    if (contrast.ratio >= targetRatio) {
      return testHsl;
    }
    
    l += direction * 2;
    l = Math.max(0, Math.min(100, l));
  }
  
  return `${h} ${s}% ${l}%`;
}

/**
 * Generate a shade of a color
 */
export function generateShade(hsl: string, amount: number): string {
  const parsed = parseHSL(hsl);
  if (!parsed) return hsl;
  
  const newL = Math.max(0, Math.min(100, parsed.l + amount));
  return `${parsed.h} ${parsed.s}% ${newL}%`;
}

/**
 * Check if a color is too similar to another
 */
export function areColorsTooSimilar(hsl1: string, hsl2: string, threshold: number = 10): boolean {
  const p1 = parseHSL(hsl1);
  const p2 = parseHSL(hsl2);
  
  if (!p1 || !p2) return false;
  
  const hDiff = Math.abs(p1.h - p2.h);
  const sDiff = Math.abs(p1.s - p2.s);
  const lDiff = Math.abs(p1.l - p2.l);
  
  return hDiff < threshold && sDiff < threshold && lDiff < threshold;
}

/**
 * Apply theme colors to CSS variables
 */
export function applyThemeToDocument(colors: Record<string, string>): void {
  const root = document.documentElement;
  
  Object.entries(colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });
}

/**
 * Remove custom theme styles from document
 */
export function removeCustomThemeFromDocument(keys: string[]): void {
  const root = document.documentElement;
  
  keys.forEach(key => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.removeProperty(cssVar);
  });
}

/**
 * Get CSS variable value from computed styles
 */
export function getCSSVariable(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}
