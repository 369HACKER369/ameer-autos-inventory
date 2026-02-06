// Section Theme Override Component
// Per-page color customization

import { useState } from 'react';
import { useAdvancedTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './ColorPicker';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SectionOverrides } from '@/types/theme';
import { LayoutDashboard, Package, BarChart3, Settings, RotateCcw } from 'lucide-react';

const sections: Array<{
  key: keyof SectionOverrides;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Dashboard cards and stats' },
  { key: 'inventory', label: 'Inventory', icon: Package, description: 'Inventory list and items' },
  { key: 'reports', label: 'Reports', icon: BarChart3, description: 'Charts and analytics' },
  { key: 'settings', label: 'Settings', icon: Settings, description: 'Settings panels' },
];

export function SectionThemeOverrides() {
  const { themeState, setSectionOverride, clearSectionOverride, getCurrentColors } = useAdvancedTheme();
  const baseColors = getCurrentColors();
  const overrides = themeState.customConfig.sectionOverrides;

  const handleToggleSection = (section: keyof SectionOverrides, enabled: boolean) => {
    if (enabled) {
      setSectionOverride(section, { enabled: true, colors: {} });
    } else {
      clearSectionOverride(section);
    }
  };

  const handleColorChange = (section: keyof SectionOverrides, colorKey: string, value: string) => {
    const current = overrides[section];
    setSectionOverride(section, {
      enabled: true,
      colors: { ...(current?.colors || {}), [colorKey]: value },
    });
  };

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          Section Overrides
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Customize colors for specific pages (optional)
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section) => {
            const Icon = section.icon;
            const sectionOverride = overrides[section.key];
            const isEnabled = sectionOverride?.enabled || false;

            return (
              <AccordionItem key={section.key} value={section.key}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{section.label}</p>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleToggleSection(section.key, checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {isEnabled && (
                    <div className="space-y-4 pt-2 pb-4">
                      <ColorPicker
                        label="Background"
                        value={sectionOverride?.colors?.background || baseColors.background}
                        onChange={(v) => handleColorChange(section.key, 'background', v)}
                        defaultValue={baseColors.background}
                      />
                      <ColorPicker
                        label="Card Background"
                        value={sectionOverride?.colors?.card || baseColors.card}
                        onChange={(v) => handleColorChange(section.key, 'card', v)}
                        defaultValue={baseColors.card}
                      />
                      <ColorPicker
                        label="Primary Color"
                        value={sectionOverride?.colors?.primary || baseColors.primary}
                        onChange={(v) => handleColorChange(section.key, 'primary', v)}
                        defaultValue={baseColors.primary}
                      />
                      <ColorPicker
                        label="Border Color"
                        value={sectionOverride?.colors?.border || baseColors.border}
                        onChange={(v) => handleColorChange(section.key, 'border', v)}
                        defaultValue={baseColors.border}
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => clearSectionOverride(section.key)}
                      >
                        <RotateCcw className="h-3 w-3 mr-2" />
                        Reset {section.label} Colors
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
