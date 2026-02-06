import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Info } from 'lucide-react';
import {
  ThemePresetSelector,
  ThemeModeSelector,
  CustomThemeEditor,
  SectionThemeOverrides,
  ThemePreviewCard,
} from '@/components/theme';
import { useAdvancedTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function ThemeAppearance() {
  const { isLoading } = useAdvancedTheme();

  if (isLoading) {
    return (
      <AppLayout>
        <Header title="Theme & Appearance" showBack />
        <div className="p-4 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="Theme & Appearance" showBack />

      <div className="p-4 space-y-4 pb-8">
        {/* Mode Selection */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Display Mode</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ThemeModeSelector />
          </CardContent>
        </Card>

        {/* Theme Presets */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Theme Presets</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a professional color palette
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <ThemePresetSelector />
          </CardContent>
        </Card>

        {/* Live Preview */}
        <ThemePreviewCard />

        {/* Custom Theme Editor */}
        <CustomThemeEditor />

        {/* Section Overrides */}
        <SectionThemeOverrides />

        {/* AMOLED Info */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-black border border-border flex items-center justify-center shrink-0">
                <Moon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">AMOLED Optimized</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The dark theme uses deep charcoal backgrounds optimized for 
                  AMOLED displays. Use the "Obsidian" preset for even deeper blacks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Info */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Theme Persistence</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All theme settings are saved locally and will persist across app restarts.
                  Changes apply instantly with smooth 200ms transitions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
