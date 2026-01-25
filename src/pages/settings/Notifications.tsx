import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { getSetting, updateSetting } from '@/db/database';
import { toast } from 'sonner';
import { 
  Bell, 
  Package, 
  RefreshCw, 
  Check,
  BellOff 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Notifications() {
  const { notifications, setNotifications } = useApp();
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [syncAlerts, setSyncAlerts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedLowStock = await getSetting<boolean>('lowStockAlerts');
        const savedSync = await getSetting<boolean>('syncAlerts');
        
        if (savedLowStock !== undefined) setLowStockAlerts(savedLowStock);
        if (savedSync !== undefined) setSyncAlerts(savedSync);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateSetting('lowStockAlerts', lowStockAlerts),
        updateSetting('syncAlerts', syncAlerts),
      ]);
      toast.success('Notification settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Header title="Notifications" showBack />
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="Notifications" showBack />

      <div className="p-4 space-y-4">
        {/* Master Toggle */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  notifications ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  {notifications ? (
                    <Bell className="h-5 w-5 text-primary" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Label className="font-medium">All Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    {notifications ? 'Notifications are enabled' : 'All notifications disabled'}
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card className={`bg-card ${!notifications ? 'opacity-50' : ''}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notification Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Low Stock Alerts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Package className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <Label className="font-medium">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when items are running low
                  </p>
                </div>
              </div>
              <Switch
                checked={lowStockAlerts && notifications}
                onCheckedChange={setLowStockAlerts}
                disabled={!notifications}
              />
            </div>

            {/* Sync Alerts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label className="font-medium">Sync Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about sync status
                  </p>
                </div>
              </div>
              <Switch
                checked={syncAlerts && notifications}
                onCheckedChange={setSyncAlerts}
                disabled={!notifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Notifications are displayed in-app and work completely offline. 
              Push notifications are not required and your privacy is protected.
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
