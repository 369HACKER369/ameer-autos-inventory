import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Layout, Tag, Eye, Check, PanelLeft, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavigationLayoutType = 'bottom' | 'sidebar';

const LAYOUT_OPTIONS = [
  {
    value: 'bottom' as const,
    label: 'Bottom Navigation',
    description: 'Classic tab bar at the bottom of the screen',
    icon: Grid2X2,
  },
  {
    value: 'sidebar' as const,
    label: 'Side Navigation Drawer',
    description: 'Slide-out menu from the left side',
    icon: PanelLeft,
  },
];

export default function NavigationLayout() {
  const {
    navShowLabels,
    setNavShowLabels,
    navCompactMode,
    setNavCompactMode,
    navigationLayout,
    setNavigationLayout,
    isInitialized
  } = useApp();

  const [localShowLabels, setLocalShowLabels] = useState(navShowLabels);
  const [localCompactMode, setLocalCompactMode] = useState(navCompactMode);
  const [localLayout, setLocalLayout] = useState<NavigationLayoutType>(navigationLayout);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalShowLabels(navShowLabels);
    setLocalCompactMode(navCompactMode);
    setLocalLayout(navigationLayout);
  }, [navShowLabels, navCompactMode, navigationLayout]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        setNavShowLabels(localShowLabels),
        setNavCompactMode(localCompactMode),
        setNavigationLayout(localLayout),
      ]);
      toast.success('Navigation settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isInitialized) {
    return (
      <AppLayout>
        <Header title="Navigation Layout" showBack />
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="Navigation Layout" showBack />

      <div className="p-4 space-y-4">
        {/* Navigation Style */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              Navigation Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {LAYOUT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = localLayout === option.value;

              return (
                <div
                  key={option.value}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-muted/50'
                  )}
                  onClick={() => setLocalLayout(option.value)}
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

        {/* Bottom Navigation Options - Only show when bottom nav is selected */}
        {localLayout === 'bottom' && (
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Grid2X2 className="h-5 w-5 text-primary" />
                Bottom Navigation Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Show Labels */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <Label className="font-medium">Show Labels</Label>
                    <p className="text-sm text-muted-foreground">
                      Display text labels under icons
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localShowLabels}
                  onCheckedChange={setLocalShowLabels}
                />
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <Label className="font-medium">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Reduce navigation bar height
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localCompactMode}
                  onCheckedChange={setLocalCompactMode}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {localLayout === 'bottom' ? (
              <div className={cn(
                "bg-background border border-border rounded-lg p-2 flex justify-around",
                localCompactMode ? "py-1" : "py-2"
              )}>
                {['Dashboard', 'Inventory', 'Reports', 'Settings'].map((label) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="h-6 w-6 rounded bg-muted" />
                    {localShowLabels && (
                      <span className="text-xs text-muted-foreground">{label}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-background border border-border rounded-lg overflow-hidden flex">
                <div className="w-24 bg-card border-r border-border p-2 space-y-2">
                  <div className="h-8 w-full rounded bg-primary/20" />
                  {['', '', '', ''].map((_, i) => (
                    <div key={i} className="h-8 w-full rounded bg-muted" />
                  ))}
                </div>
                <div className="flex-1 p-3">
                  <div className="h-4 w-20 bg-muted rounded mb-2" />
                  <div className="h-16 w-full bg-muted/50 rounded" />
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3 text-center">
              This is a preview of how your navigation will look
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Check className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </AppLayout>
  );
}
