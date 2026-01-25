import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { Palette, Moon, Smartphone, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEME_OPTIONS = [
  { 
    value: 'light' as const, 
    label: 'Light', 
    icon: Sun,
    description: 'Bright theme for daytime use'
  },
  { 
    value: 'dark' as const, 
    label: 'Dark', 
    icon: Moon,
    description: 'AMOLED black for battery saving'
  },
  { 
    value: 'system' as const, 
    label: 'System', 
    icon: Smartphone,
    description: 'Follow device settings'
  },
];

export default function ThemeAppearance() {
  const { theme, setTheme } = useApp();

  return (
    <AppLayout>
      <Header title="Theme & Appearance" showBack />

      <div className="p-4 space-y-4">
        {/* Theme Selection */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              App Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              
              return (
                <div
                  key={option.value}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border',
                    isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:bg-muted/50'
                  )}
                  onClick={() => setTheme(option.value)}
                >
                  <div className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <div className={cn(
                    'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                  )}>
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

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
                  The dark theme uses pure black (#000000) backgrounds optimized for 
                  AMOLED displays. This saves battery and reduces eye strain in low light.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Theme Display */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Current theme: <span className="font-medium text-foreground capitalize">{theme}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Theme changes are applied immediately and saved automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
