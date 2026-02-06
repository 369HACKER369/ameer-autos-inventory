// Theme Mode Selector Component
// Light/Dark/System mode toggle

import { useAdvancedTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Sun, Moon, Smartphone } from 'lucide-react';

const modes = [
  { value: 'light' as const, label: 'Light', icon: Sun },
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'system' as const, label: 'System', icon: Smartphone },
];

export function ThemeModeSelector() {
  const { themeState, setMode } = useAdvancedTheme();

  return (
    <div className="flex gap-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = themeState.mode === mode.value;
        
        return (
          <button
            key={mode.value}
            onClick={() => setMode(mode.value)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all duration-200',
              isSelected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
