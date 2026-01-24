import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { db, initializeDatabase, getSetting, updateSetting } from '@/db/database';
import { useLiveQuery } from 'dexie-react-hooks';
import type { DashboardStats, Part, Sale, ActivityLog, Brand, Category } from '@/types';
import { startOfDay, endOfDay, startOfMonth } from 'date-fns';

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

  // Initialize database
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        
        // Load settings
        const savedTheme = await getSetting<'dark' | 'light' | 'system'>('theme');
        const savedNotifications = await getSetting<boolean>('notifications');
        
        if (savedTheme) setThemeState(savedTheme);
        if (savedNotifications !== undefined) setNotificationsState(savedNotifications);
        
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

  // Calculate dashboard stats
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
      const inventoryValue = allParts.reduce((sum, p) => sum + (p.quantity * p.buyingPrice), 0);
      const lowStockCount = allParts.filter(p => p.quantity <= p.minStockLevel).length;

      // Get today's sales
      const allSales = await db.sales.toArray();
      const todaySalesData = allSales.filter(s => {
        const saleDate = new Date(s.createdAt);
        return saleDate >= todayStart && saleDate <= todayEnd;
      });
      const todaySales = todaySalesData.reduce((sum, s) => sum + s.totalAmount, 0);
      const todayProfit = todaySalesData.reduce((sum, s) => sum + s.profit, 0);

      // Get monthly profit
      const monthlySalesData = allSales.filter(s => {
        const saleDate = new Date(s.createdAt);
        return saleDate >= monthStart && saleDate <= todayEnd;
      });
      const monthlyProfit = monthlySalesData.reduce((sum, s) => sum + s.profit, 0);

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
