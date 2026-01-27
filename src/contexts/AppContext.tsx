import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { db, initializeDatabase, getSetting, updateSetting } from '@/db/database';
import { useLiveQuery } from 'dexie-react-hooks';
import type { DashboardStats, Part, Sale, ActivityLog, Brand, Category } from '@/types';
import { startOfDay, endOfDay, startOfMonth } from 'date-fns';
import { toSafeNumber, toSafeQuantity, safeAdd } from '@/utils/safeNumber';

type NavigationLayout = 'bottom' | 'sidebar';

interface AppContextType {
  // Database initialization
  isInitialized: boolean;
  
  // Dashboard stats
  stats: DashboardStats;
  isLoadingStats: boolean;
  refreshStats: () => Promise<void>;
  
  // Low stock parts
  lowStockParts: Part[];
  
  // Recent activity
  recentActivity: ActivityLog[];
  
  // Quick counts
  totalParts: number;
  totalBrands: number;
  totalCategories: number;
  
  // Settings
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => Promise<void>;
  notifications: boolean;
  setNotifications: (enabled: boolean) => Promise<void>;

  // Navigation settings
  navShowLabels: boolean;
  setNavShowLabels: (show: boolean) => Promise<void>;
  navCompactMode: boolean;
  setNavCompactMode: (compact: boolean) => Promise<void>;
  
  // Navigation layout
  navigationLayout: NavigationLayout;
  setNavigationLayout: (layout: NavigationLayout) => Promise<void>;
  
  // Custom logo
  customLogo: string | null;
  setCustomLogo: (logo: string | null) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalParts: 0,
    inventoryValue: 0,
    todaySales: 0,
    todayProfit: 0,
    monthlyProfit: 0,
    lowStockCount: 0,
  });
  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>('dark');
  const [notifications, setNotificationsState] = useState(true);
  const [navShowLabels, setNavShowLabelsState] = useState(true);
  const [navCompactMode, setNavCompactModeState] = useState(false);
  const [navigationLayout, setNavigationLayoutState] = useState<NavigationLayout>('bottom');
  const [customLogo, setCustomLogoState] = useState<string | null>(null);

  // Initialize database
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        
        // Load settings
        const savedTheme = await getSetting<'dark' | 'light' | 'system'>('theme');
        const savedNotifications = await getSetting<boolean>('notifications');
        const savedShowLabels = await getSetting<boolean>('navShowLabels');
        const savedCompactMode = await getSetting<boolean>('navCompactMode');
        const savedNavigationLayout = await getSetting<NavigationLayout>('navigationLayout');
        const savedCustomLogo = await getSetting<string | null>('customLogo');
        
        if (savedTheme) setThemeState(savedTheme);
        if (savedNotifications !== undefined) setNotificationsState(savedNotifications);
        if (savedShowLabels !== undefined) setNavShowLabelsState(savedShowLabels);
        if (savedCompactMode !== undefined) setNavCompactModeState(savedCompactMode);
        if (savedNavigationLayout) setNavigationLayoutState(savedNavigationLayout);
        if (savedCustomLogo !== undefined) setCustomLogoState(savedCustomLogo);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setIsInitialized(true); // Still set to true to show error state
      }
    };
    
    init();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Live query for parts
  const parts = useLiveQuery(() => db.parts.toArray(), []) ?? [];
  const sales = useLiveQuery(() => db.sales.toArray(), []) ?? [];
  const brands = useLiveQuery(() => db.brands.toArray(), []) ?? [];
  const categories = useLiveQuery(() => db.categories.toArray(), []) ?? [];
  const activityLogs = useLiveQuery(
    () => db.activityLogs.orderBy('createdAt').reverse().limit(10).toArray(),
    []
  ) ?? [];

  // Calculate low stock parts
  const lowStockParts = parts.filter(p => p.quantity <= p.minStockLevel);

  // Calculate dashboard stats with defensive NaN checks
  const refreshStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);
      const monthStart = startOfMonth(today);

      // Get all parts for inventory value
      const allParts = await db.parts.toArray();
      const totalParts = allParts.length;
      
      // Calculate inventory value with safe number handling
      const inventoryValue = allParts.reduce((sum, p) => {
        const qty = toSafeQuantity(p.quantity, 0);
        const price = toSafeNumber(p.buyingPrice, 0);
        return safeAdd(sum, qty * price);
      }, 0);
      
      // Calculate low stock count with safe comparison
      const lowStockCount = allParts.filter(p => {
        const qty = toSafeQuantity(p.quantity, 0);
        const minStock = toSafeQuantity(p.minStockLevel, 0);
        return qty <= minStock;
      }).length;

      // Get today's sales
      const allSales = await db.sales.toArray();
      const todaySalesData = allSales.filter(s => {
        const saleDate = new Date(s.createdAt);
        return saleDate >= todayStart && saleDate <= todayEnd;
      });
      
      // Calculate today's totals with safe number handling
      const todaySales = todaySalesData.reduce((sum, s) => {
        return safeAdd(sum, toSafeNumber(s.totalAmount, 0));
      }, 0);
      
      const todayProfit = todaySalesData.reduce((sum, s) => {
        return safeAdd(sum, toSafeNumber(s.profit, 0));
      }, 0);

      // Get monthly profit
      const monthlySalesData = allSales.filter(s => {
        const saleDate = new Date(s.createdAt);
        return saleDate >= monthStart && saleDate <= todayEnd;
      });
      
      const monthlyProfit = monthlySalesData.reduce((sum, s) => {
        return safeAdd(sum, toSafeNumber(s.profit, 0));
      }, 0);

      setStats({
        totalParts,
        inventoryValue,
        todaySales,
        todayProfit,
        monthlyProfit,
        lowStockCount,
      });
    } catch (error) {
      console.error('Failed to refresh stats:', error);
      // Set safe defaults on error
      setStats({
        totalParts: 0,
        inventoryValue: 0,
        todaySales: 0,
        todayProfit: 0,
        monthlyProfit: 0,
        lowStockCount: 0,
      });
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Refresh stats when parts or sales change
  useEffect(() => {
    if (isInitialized) {
      refreshStats();
    }
  }, [isInitialized, parts.length, sales.length, refreshStats]);

  // Theme setter
  const setTheme = async (newTheme: 'dark' | 'light' | 'system') => {
    setThemeState(newTheme);
    await updateSetting('theme', newTheme);
  };

  // Notifications setter
  const setNotifications = async (enabled: boolean) => {
    setNotificationsState(enabled);
    await updateSetting('notifications', enabled);
  };

  // Nav settings setters
  const setNavShowLabels = async (show: boolean) => {
    setNavShowLabelsState(show);
    await updateSetting('navShowLabels', show);
  };

  const setNavCompactMode = async (compact: boolean) => {
    setNavCompactModeState(compact);
    await updateSetting('navCompactMode', compact);
  };

  // Navigation layout setter
  const setNavigationLayout = async (layout: NavigationLayout) => {
    setNavigationLayoutState(layout);
    await updateSetting('navigationLayout', layout);
  };

  // Custom logo setter
  const setCustomLogo = async (logo: string | null) => {
    setCustomLogoState(logo);
    await updateSetting('customLogo', logo);
  };

  const value: AppContextType = {
    isInitialized,
    stats,
    isLoadingStats,
    refreshStats,
    lowStockParts,
    recentActivity: activityLogs,
    totalParts: parts.length,
    totalBrands: brands.length,
    totalCategories: categories.length,
    theme,
    setTheme,
    notifications,
    setNotifications,
    navShowLabels,
    setNavShowLabels,
    navCompactMode,
    setNavCompactMode,
    navigationLayout,
    setNavigationLayout,
    customLogo,
    setCustomLogo,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
