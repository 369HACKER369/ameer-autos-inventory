// Theme Preset Selector Component
// Grid of preset theme cards with preview

import { useAdvancedTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function ThemePresetSelector() {
  const { themeState, setPreset, presets } = useAdvancedTheme();

  return (
    <div className="grid grid-cols-2 gap-3">
      {presets.map((preset) => {
        const isSelected = themeState.selectedPreset === preset.id;
        const colors = themeState.resolvedMode === 'light' ? preset.light : preset.dark;
        
        return (
          <button
            key={preset.id}
            onClick={() => setPreset(preset.id)}
            className={cn(
              'relative p-3 rounded-xl border-2 transition-all duration-200 text-left',
              isSelected
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
          >
            {/* Preview swatch */}
            <div className="flex gap-1.5 mb-2">
              <div
                className="h-6 w-6 rounded-md shadow-sm"
                style={{ background: `hsl(${colors.primary})` }}
              />
              <div
                className="h-6 w-6 rounded-md shadow-sm"
                style={{ background: `hsl(${colors.accent})` }}
              />
              <div
                className="h-6 w-6 rounded-md border"
                style={{ 
                  background: `hsl(${colors.background})`,
                  borderColor: `hsl(${colors.border})`
                }}
              />
            </div>
            
            {/* Label */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{preset.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{preset.name}</p>
                <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
              </div>
            </div>
            
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
