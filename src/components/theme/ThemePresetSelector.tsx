// Theme Preset Selector Component
// Simple selector for Industrial Dark & Factory Light themes

import { useAdvancedTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Check, Moon, Sun } from 'lucide-react';
import type { ThemeId } from '@/types/theme';

export function ThemePresetSelector() {
  const { themeState, setTheme, presets } = useAdvancedTheme();

  return (
    <div className="grid grid-cols-1 gap-3">
      {presets.map((preset) => {
        const isSelected = themeState.selectedTheme === preset.id;
        const colors = preset.colors;
        const isDark = preset.category === 'dark';
        
        return (
          <button
            key={preset.id}
            onClick={() => setTheme(preset.id as ThemeId)}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all duration-200 text-left',
              isSelected
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div className="flex items-center gap-4">
              {/* Theme icon and mode indicator */}
              <div 
                className="h-14 w-14 rounded-xl flex items-center justify-center shadow-md"
                style={{ 
                  background: isDark 
                    ? `linear-gradient(135deg, hsl(${colors.primary}), hsl(${colors.accent}))` 
                    : `linear-gradient(135deg, hsl(${colors.primary}), hsl(${colors.secondary}))`
                }}
              >
                {isDark ? (
                  <Moon className="h-7 w-7 text-white" />
                ) : (
                  <Sun className="h-7 w-7 text-white" />
                )}
              </div>

              {/* Theme info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{preset.icon}</span>
                  <p className="font-semibold text-base">{preset.name}</p>
                  <span 
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      isDark 
                        ? "bg-muted text-muted-foreground" 
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {isDark ? 'Dark' : 'Light'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{preset.description}</p>
                
                {/* Color swatches */}
                <div className="flex gap-1.5 mt-2">
                  <div
                    className="h-5 w-5 rounded-md shadow-sm border border-border/50"
                    style={{ background: `hsl(${colors.primary})` }}
                    title="Primary"
                  />
                  <div
                    className="h-5 w-5 rounded-md shadow-sm border border-border/50"
                    style={{ background: `hsl(${colors.secondary})` }}
                    title="Secondary"
                  />
                  <div
                    className="h-5 w-5 rounded-md shadow-sm border border-border/50"
                    style={{ background: `hsl(${colors.accent})` }}
                    title="Accent"
                  />
                  <div
                    className="h-5 w-5 rounded-md shadow-sm border border-border/50"
                    style={{ background: `hsl(${colors.background})` }}
                    title="Background"
                  />
                  <div
                    className="h-5 w-5 rounded-md shadow-sm border border-border/50"
                    style={{ background: `hsl(${colors.card})` }}
                    title="Card"
                  />
                </div>
              </div>
            </div>
            
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
