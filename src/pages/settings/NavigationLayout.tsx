import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Layout, Tag, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NavigationLayout() {
  const {
    navShowLabels,
    setNavShowLabels,
    navCompactMode,
    setNavCompactMode,
    isInitialized
  } = useApp();

  const [localShowLabels, setLocalShowLabels] = useState(navShowLabels);
  const [localCompactMode, setLocalCompactMode] = useState(navCompactMode);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalShowLabels(navShowLabels);
    setLocalCompactMode(navCompactMode);
  }, [navShowLabels, navCompactMode]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        setNavShowLabels(localShowLabels),
        setNavCompactMode(localCompactMode),
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
        {/* Navigation Options */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              Bottom Navigation
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

        {/* Preview */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent>
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
