import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full px-2 py-1 transition-colors touch-target',
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon 
                className={cn(
                  'h-5 w-5 mb-0.5 transition-transform',
                  active && 'scale-110'
                )} 
              />
              <span 
                className={cn(
                  'text-[10px] font-medium leading-tight',
                  active && 'font-semibold'
                )}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
