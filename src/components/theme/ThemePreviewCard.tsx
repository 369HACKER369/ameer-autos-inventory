// Theme Preview Card Component
// Live preview of current Industrial theme settings

import { useAdvancedTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Package, TrendingUp, AlertTriangle, Wrench } from 'lucide-react';

export function ThemePreviewCard() {
  const { themeState, getCurrentColors, isDarkTheme, presets } = useAdvancedTheme();
  const colors = getCurrentColors();
  const currentPreset = presets.find(p => p.id === themeState.selectedTheme);

  return (
    <Card className="bg-card overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Preview container with theme colors */}
        <div 
          className="rounded-lg p-4 space-y-3"
          style={{ 
            background: `hsl(${colors.background})`,
            border: `1px solid hsl(${colors.border})`
          }}
        >
          {/* Sample card */}
          <div 
            className="rounded-lg p-3"
            style={{ 
              background: `hsl(${colors.card})`,
              border: `1px solid hsl(${colors.border})`
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: `hsl(${colors.primary})` }}
              >
                <Wrench className="h-4 w-4" style={{ color: `hsl(${colors.primaryForeground})` }} />
              </div>
              <div>
                <p 
                  className="font-medium text-sm"
                  style={{ color: `hsl(${colors.foreground})` }}
                >
                  Parts Inventory
                </p>
                <p 
                  className="text-xs"
                  style={{ color: `hsl(${colors.mutedForeground})` }}
                >
                  Sample card preview
                </p>
              </div>
            </div>
            
            {/* Sample badges */}
            <div className="flex gap-2 flex-wrap">
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  background: `hsl(${colors.success})`,
                  color: `hsl(${colors.successForeground})`
                }}
              >
                In Stock
              </span>
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  background: `hsl(${colors.warning})`,
                  color: `hsl(${colors.warningForeground})`
                }}
              >
                Low Stock
              </span>
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  background: `hsl(${colors.destructive})`,
                  color: `hsl(${colors.destructiveForeground})`
                }}
              >
                Out of Stock
              </span>
            </div>
          </div>

          {/* Sample chart colors */}
          <div className="flex gap-1 h-8">
            <div 
              className="flex-1 rounded"
              style={{ background: `hsl(${colors.chartPrimary})` }}
              title="Primary"
            />
            <div 
              className="flex-1 rounded"
              style={{ background: `hsl(${colors.chartSecondary})` }}
              title="Secondary"
            />
            <div 
              className="flex-1 rounded"
              style={{ background: `hsl(${colors.chartAccent})` }}
              title="Accent"
            />
            <div 
              className="flex-1 rounded"
              style={{ background: `hsl(${colors.chartSuccess})` }}
              title="Success"
            />
          </div>

          {/* Sample buttons */}
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ 
                background: `hsl(${colors.primary})`,
                color: `hsl(${colors.primaryForeground})`
              }}
            >
              Primary
            </button>
            <button
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ 
                background: `hsl(${colors.accent})`,
                color: `hsl(${colors.accentForeground})`
              }}
            >
              Accent
            </button>
          </div>
        </div>

        {/* Current theme info */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Theme: <span className="font-medium text-foreground">{currentPreset?.name || 'Unknown'}</span>
          </span>
          <span>
            Mode: <span className="font-medium text-foreground capitalize">{isDarkTheme ? 'Dark' : 'Light'}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
