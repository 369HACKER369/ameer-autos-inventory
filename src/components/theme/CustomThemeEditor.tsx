// Custom Theme Editor Component
// Full customization panel for advanced users

import { useState } from 'react';
import { useAdvancedTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from './ColorPicker';
import { Palette, Type, Square, BarChart3, RotateCcw, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function CustomThemeEditor() {
  const { themeState, enableCustomTheme, setCustomColor, resetCustomColors, getCurrentColors } = useAdvancedTheme();
  const isEnabled = themeState.customConfig.enabled;
  const currentColors = getCurrentColors();
  const customColors = themeState.customConfig.colors;

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Custom Theme
          </CardTitle>
          <Switch
            checked={isEnabled}
            onCheckedChange={enableCustomTheme}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Fine-tune individual colors for a personalized look
        </p>
      </CardHeader>

      {isEnabled && (
        <CardContent className="pt-0">
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="global" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                Global
              </TabsTrigger>
              <TabsTrigger value="text" className="text-xs">
                <Type className="h-3 w-3 mr-1" />
                Text
              </TabsTrigger>
              <TabsTrigger value="components" className="text-xs">
                <Square className="h-3 w-3 mr-1" />
                UI
              </TabsTrigger>
              <TabsTrigger value="charts" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Charts
              </TabsTrigger>
            </TabsList>

            {/* Global Colors */}
            <TabsContent value="global" className="space-y-4 mt-0">
              <ColorPicker
                label="Primary Color"
                description="Main brand color for buttons and highlights"
                value={customColors.primary || currentColors.primary}
                onChange={(v) => setCustomColor('primary', v)}
                defaultValue={currentColors.primary}
              />
              <ColorPicker
                label="Accent Color"
                description="Secondary emphasis color"
                value={customColors.accent || currentColors.accent}
                onChange={(v) => setCustomColor('accent', v)}
                defaultValue={currentColors.accent}
              />
              <ColorPicker
                label="Background"
                description="Main page background"
                value={customColors.background || currentColors.background}
                onChange={(v) => setCustomColor('background', v)}
                defaultValue={currentColors.background}
              />
              <ColorPicker
                label="Card Background"
                description="Background for cards and panels"
                value={customColors.card || currentColors.card}
                onChange={(v) => setCustomColor('card', v)}
                defaultValue={currentColors.card}
              />
              <ColorPicker
                label="Border Color"
                description="Borders and dividers"
                value={customColors.border || currentColors.border}
                onChange={(v) => setCustomColor('border', v)}
                defaultValue={currentColors.border}
              />
            </TabsContent>

            {/* Text Colors */}
            <TabsContent value="text" className="space-y-4 mt-0">
              <ColorPicker
                label="Primary Text"
                description="Main headings and body text"
                value={customColors.foreground || currentColors.foreground}
                onChange={(v) => setCustomColor('foreground', v)}
                contrastWith={customColors.background || currentColors.background}
                defaultValue={currentColors.foreground}
              />
              <ColorPicker
                label="Muted Text"
                description="Secondary labels and hints"
                value={customColors.mutedForeground || currentColors.mutedForeground}
                onChange={(v) => setCustomColor('mutedForeground', v)}
                contrastWith={customColors.background || currentColors.background}
                defaultValue={currentColors.mutedForeground}
              />
              <ColorPicker
                label="Primary Button Text"
                description="Text on primary buttons"
                value={customColors.primaryForeground || currentColors.primaryForeground}
                onChange={(v) => setCustomColor('primaryForeground', v)}
                contrastWith={customColors.primary || currentColors.primary}
                defaultValue={currentColors.primaryForeground}
              />
              <ColorPicker
                label="Warning Text"
                description="Warning message text"
                value={customColors.warningForeground || currentColors.warningForeground}
                onChange={(v) => setCustomColor('warningForeground', v)}
                contrastWith={customColors.warning || currentColors.warning}
                defaultValue={currentColors.warningForeground}
              />
            </TabsContent>

            {/* Component Colors */}
            <TabsContent value="components" className="space-y-4 mt-0">
              <ColorPicker
                label="Success"
                description="Success states and confirmations"
                value={customColors.success || currentColors.success}
                onChange={(v) => setCustomColor('success', v)}
                defaultValue={currentColors.success}
              />
              <ColorPicker
                label="Warning"
                description="Warning alerts and cautions"
                value={customColors.warning || currentColors.warning}
                onChange={(v) => setCustomColor('warning', v)}
                defaultValue={currentColors.warning}
              />
              <ColorPicker
                label="Destructive"
                description="Errors and destructive actions"
                value={customColors.destructive || currentColors.destructive}
                onChange={(v) => setCustomColor('destructive', v)}
                defaultValue={currentColors.destructive}
              />
              <ColorPicker
                label="Info"
                description="Informational messages"
                value={customColors.info || currentColors.info}
                onChange={(v) => setCustomColor('info', v)}
                defaultValue={currentColors.info}
              />
              <ColorPicker
                label="Input Fields"
                description="Form input backgrounds"
                value={customColors.input || currentColors.input}
                onChange={(v) => setCustomColor('input', v)}
                defaultValue={currentColors.input}
              />
            </TabsContent>

            {/* Chart Colors */}
            <TabsContent value="charts" className="space-y-4 mt-0">
              <ColorPicker
                label="Sales Chart Color"
                description="Sales data in charts"
                value={customColors.chartSales || currentColors.chartSales}
                onChange={(v) => setCustomColor('chartSales', v)}
                defaultValue={currentColors.chartSales}
              />
              <ColorPicker
                label="Profit Chart Color"
                description="Profit data in charts"
                value={customColors.chartProfit || currentColors.chartProfit}
                onChange={(v) => setCustomColor('chartProfit', v)}
                defaultValue={currentColors.chartProfit}
              />
              <ColorPicker
                label="Inventory Chart Color"
                description="Inventory data in charts"
                value={customColors.chartInventory || currentColors.chartInventory}
                onChange={(v) => setCustomColor('chartInventory', v)}
                defaultValue={currentColors.chartInventory}
              />
              <ColorPicker
                label="Alert Chart Color"
                description="Alert indicators in charts"
                value={customColors.chartAlert || currentColors.chartAlert}
                onChange={(v) => setCustomColor('chartAlert', v)}
                defaultValue={currentColors.chartAlert}
              />
            </TabsContent>
          </Tabs>

          {/* Reset Button */}
          {Object.keys(customColors).length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All Custom Colors
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Reset Custom Theme?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all your custom color settings and revert to the selected preset theme.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetCustomColors}>
                    Reset Colors
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      )}
    </Card>
  );
}
