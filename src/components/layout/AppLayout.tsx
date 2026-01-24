import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  className?: string;
}

export function AppLayout({ children, hideNav = false, className }: AppLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background flex flex-col', className)}>
      <main className={cn(
        'flex-1 overflow-auto',
        !hideNav && 'pb-16' // Add padding for bottom nav
      )}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
