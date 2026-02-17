import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSetting, updateSetting } from '@/db/database';

export interface TypographyScale {
  global: number; // 0.85 - 1.3
  iconSize: 'small' | 'medium' | 'large';
  pages: {
    dashboard: { title: number; body: number; cardValue: number };
    inventory: { title: number; body: number; cardValue: number };
    reports: { title: number; body: number; cardValue: number };
    settings: { title: number; body: number; cardValue: number };
  };
  sections: {
    cardMainValue: number;
    cardLabel: number;
    chartLegend: number;
  };
}

const DEFAULT_SCALE: TypographyScale = {
  global: 1,
  iconSize: 'medium',
  pages: {
    dashboard: { title: 1, body: 1, cardValue: 1 },
    inventory: { title: 1, body: 1, cardValue: 1 },
    reports: { title: 1, body: 1, cardValue: 1 },
    settings: { title: 1, body: 1, cardValue: 1 },
  },
  sections: {
    cardMainValue: 1,
    cardLabel: 1,
    chartLegend: 1,
  },
};

interface TypographyContextType {
  scale: TypographyScale;
  setGlobalScale: (v: number) => void;
  setIconSize: (v: 'small' | 'medium' | 'large') => void;
  setPageScale: (page: keyof TypographyScale['pages'], field: 'title' | 'body' | 'cardValue', v: number) => void;
  setSectionScale: (field: keyof TypographyScale['sections'], v: number) => void;
  isLoaded: boolean;
}

const TypographyContext = createContext<TypographyContextType | undefined>(undefined);

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState<TypographyScale>(DEFAULT_SCALE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getSetting<TypographyScale>('typographyScale').then(saved => {
      if (saved) setScale({ ...DEFAULT_SCALE, ...saved });
      setIsLoaded(true);
    }).catch(() => setIsLoaded(true));
  }, []);

  // Apply CSS custom properties whenever scale changes
  useEffect(() => {
    if (!isLoaded) return;
    const root = document.documentElement;
    root.style.setProperty('--text-scale', String(scale.global));
    root.style.setProperty('--card-value-scale', String(scale.sections.cardMainValue));
    root.style.setProperty('--card-label-scale', String(scale.sections.cardLabel));
    root.style.setProperty('--chart-legend-scale', String(scale.sections.chartLegend));

    const iconMap = { small: '0.8', medium: '1', large: '1.25' };
    root.style.setProperty('--icon-scale', iconMap[scale.iconSize]);
  }, [scale, isLoaded]);

  const persist = useCallback((next: TypographyScale) => {
    setScale(next);
    updateSetting('typographyScale', next).catch(() => {});
  }, []);

  const setGlobalScale = useCallback((v: number) => {
    persist({ ...scale, global: v });
  }, [scale, persist]);

  const setIconSize = useCallback((v: 'small' | 'medium' | 'large') => {
    persist({ ...scale, iconSize: v });
  }, [scale, persist]);

  const setPageScale = useCallback((page: keyof TypographyScale['pages'], field: 'title' | 'body' | 'cardValue', v: number) => {
    persist({
      ...scale,
      pages: { ...scale.pages, [page]: { ...scale.pages[page], [field]: v } },
    });
  }, [scale, persist]);

  const setSectionScale = useCallback((field: keyof TypographyScale['sections'], v: number) => {
    persist({
      ...scale,
      sections: { ...scale.sections, [field]: v },
    });
  }, [scale, persist]);

  return (
    <TypographyContext.Provider value={{ scale, setGlobalScale, setIconSize, setPageScale, setSectionScale, isLoaded }}>
      {children}
    </TypographyContext.Provider>
  );
}

export function useTypography() {
  const ctx = useContext(TypographyContext);
  if (!ctx) return undefined; // safe fallback
  return ctx;
}
