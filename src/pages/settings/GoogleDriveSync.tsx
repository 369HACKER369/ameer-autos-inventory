import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSetting, updateSetting } from '@/db/database';
import { toast } from 'sonner';
import { 
  Cloud, 
  Key, 
  FolderOpen, 
  RefreshCw, 
  Check, 
  AlertTriangle,
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function GoogleDriveSync() {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [folderId, setFolderId] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSyncEnabled = await getSetting<boolean>('syncEnabled');
        const savedApiKey = await getSetting<string>('syncApiKey');
        const savedFolderId = await getSetting<string>('syncFolderId');
        const savedLastSync = await getSetting<string>('lastSyncTime');
        
        if (savedSyncEnabled !== undefined) setSyncEnabled(savedSyncEnabled);
        if (savedApiKey) setApiKey(savedApiKey);
        if (savedFolderId) setFolderId(savedFolderId);
        if (savedLastSync) setLastSyncTime(new Date(savedLastSync));
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
        updateSetting('syncEnabled', syncEnabled),
        updateSetting('syncApiKey', apiKey), // In production, encrypt this
        updateSetting('syncFolderId', folderId),
      ]);
      toast.success('Sync settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSync = async () => {
    if (!apiKey) {
      toast.error('Please enter your API key first');
      return;
    }
    
    setIsSyncing(true);
    try {
      // Simulate sync process - in production, this would call Google Drive API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const now = new Date();
      setLastSyncTime(now);
      await updateSetting('lastSyncTime', now.toISOString());
      
      toast.success('Sync completed successfully');
    } catch (error) {
      toast.error('Sync failed. Please check your connection.');
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Header title="Google Drive Sync" showBack />
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="Google Drive Sync" showBack />

      <div className="p-4 space-y-4">
        {/* Sync Status */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  syncEnabled ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Cloud className={`h-5 w-5 ${syncEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <Label className="font-medium">Enable Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    {syncEnabled ? 'Auto-sync is active' : 'Sync is disabled'}
                  </p>
                </div>
              </div>
              <Switch
                checked={syncEnabled}
                onCheckedChange={setSyncEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Credentials */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              API Credentials
            </CardTitle>
            <CardDescription>
              Enter your Google Drive API credentials for automatic sync
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="folderId">Drive Folder ID (Optional)</Label>
              <Input
                id="folderId"
                placeholder="Enter folder ID for backups"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use root folder
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-card border-warning/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Security Notice</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your API key is stored locally on this device and is never sent to our servers. 
                  All sync operations happen directly between your device and Google Drive.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Actions */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Manual Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleManualSync}
              disabled={isSyncing || !apiKey}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
            
            {lastSyncTime && (
              <p className="text-sm text-muted-foreground text-center">
                Last synced: {lastSyncTime.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Offline Notice */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <WifiOff className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Offline First</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The app works fully offline. Sync is optional and will only run 
                  when you have an internet connection. Your data is always saved locally first.
                </p>
              </div>
            </div>
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
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </AppLayout>
  );
}
