import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Sun, Info, RefreshCw, Wrench } from 'lucide-react';
import {
  ThemePresetSelector,
  CustomThemeEditor,
  SectionThemeOverrides,
  ThemePreviewCard,
} from '@/components/theme';
import { useAdvancedTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Component, ReactNode } from 'react';

// Error boundary for theme context issues
class ThemeErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <AppLayout>
          <Header title="Theme & Appearance" showBack />
          <div className="p-4 space-y-4">
            <Card className="bg-card">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Theme system is loading. Please refresh the page.
                </p>
                <Button onClick={() => window.location.reload()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </AppLayout>
      );
    }
    return this.props.children;
  }
}

function ThemeAppearanceContent() {
  const { isLoading, isDarkTheme } = useAdvancedTheme();

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
        {/* Theme Selection */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Industrial Themes
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Professional themes designed for heavy machinery and industrial use
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

        {/* Theme Info - Dark */}
        {isDarkTheme && (
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <Moon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Industrial Dark Theme</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    AMOLED-optimized dark surfaces with Deep Blue primary and Industrial 
                    Orange accents. Designed for heavy-duty workshop environments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Theme Info - Light */}
        {!isDarkTheme && (
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <Sun className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Factory Light Theme</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clean, bright industrial theme with Slate Gray primary and Warning 
                    Amber accents. Optimized for office and bright shop environments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Persistence Info */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Offline-First Persistence</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All theme settings are saved locally and persist across app restarts.
                  Changes apply instantly with smooth 250ms transitions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function ThemeAppearance() {
  return (
    <ThemeErrorBoundary>
      <ThemeAppearanceContent />
    </ThemeErrorBoundary>
  );
}
