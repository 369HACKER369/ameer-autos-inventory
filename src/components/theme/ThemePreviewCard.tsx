// Theme Preview Card Component
// Live preview of current theme settings

import { useAdvancedTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Package, TrendingUp, AlertTriangle, Check } from 'lucide-react';

export function ThemePreviewCard() {
  const { themeState, getCurrentColors } = useAdvancedTheme();
  const colors = getCurrentColors();

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
                <Package className="h-4 w-4" style={{ color: `hsl(${colors.primaryForeground})` }} />
              </div>
              <div>
                <p 
                  className="font-medium text-sm"
                  style={{ color: `hsl(${colors.foreground})` }}
                >
                  Inventory Stats
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
            <div className="flex gap-2">
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  background: `hsl(${colors.success})`,
                  color: `hsl(${colors.successForeground})`
                }}
              >
                Success
              </span>
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  background: `hsl(${colors.warning})`,
                  color: `hsl(${colors.warningForeground})`
                }}
              >
                Warning
              </span>
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  background: `hsl(${colors.destructive})`,
                  color: `hsl(${colors.destructiveForeground})`
                }}
              >
                Error
              </span>
            </div>
          </div>

          {/* Sample chart colors */}
          <div className="flex gap-1 h-8">
            <div 
              className="flex-1 rounded"
              style={{ background: `hsl(${colors.chartSales})` }}
              title="Sales"
            />
            <div 
              className="flex-1 rounded"
              style={{ background: `hsl(${colors.chartProfit})` }}
              title="Profit"
            />
            <div 
              className="flex-1 rounded"
              style={{ background: `hsl(${colors.chartInventory})` }}
              title="Inventory"
            />
            <div 
              className="flex-1 rounded"
              style={{ background: `hsl(${colors.chartAlert})` }}
              title="Alert"
            />
          </div>

          {/* Sample buttons */}
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 rounded-lg text-sm font-medium"
              style={{ 
                background: `hsl(${colors.primary})`,
                color: `hsl(${colors.primaryForeground})`
              }}
            >
              Primary
            </button>
            <button
              className="flex-1 py-2 rounded-lg text-sm font-medium"
              style={{ 
                background: `hsl(${colors.secondary})`,
                color: `hsl(${colors.secondaryForeground})`
              }}
            >
              Secondary
            </button>
          </div>
        </div>

        {/* Current theme info */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Mode: <span className="font-medium text-foreground capitalize">{themeState.mode}</span>
          </span>
          <span>
            Preset: <span className="font-medium text-foreground capitalize">{themeState.selectedPreset}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
