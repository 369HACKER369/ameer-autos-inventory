import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, Package, DollarSign, Globe, FileText, Mail, UserCheck,
  Bell, ClipboardList, Settings, Lock, ServerOff, ScanEye, 
  Clock, Baby, type LucideIcon
} from 'lucide-react';

const dataItems: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Package, title: 'Inventory Data', desc: 'Part names, SKUs, prices, quantities, brands, and categories — all stored locally in IndexedDB on your device.' },
  { icon: DollarSign, title: 'Sales & Reports', desc: 'Sales records, profit calculations, and analytics data. Generated from your local data and never transmitted externally.' },
  { icon: FileText, title: 'Billing Data', desc: 'Bills are generated and stored locally in PDF or image format. They are not uploaded unless you manually share them.' },
  { icon: Bell, title: 'Notification Data', desc: 'Custom reminders, low-stock alerts, and notification history. All stored locally and never shared with third parties.' },
  { icon: ClipboardList, title: 'Activity Logs', desc: 'A local audit trail of all actions (add, edit, delete, sales). Used for your reference only — never sent anywhere.' },
  { icon: Settings, title: 'App Settings & Preferences', desc: 'Theme, language, navigation layout, typography, and notification preferences. Stored locally in IndexedDB.' },
];

const securityPoints = [
  'All data is stored in IndexedDB, a browser-native encrypted database on your device.',
  'No external analytics, tracking pixels, or third-party SDKs are included in this app.',
  'Crash-safe write operations ensure data integrity even during unexpected app closures.',
  'API keys for Google Drive sync are encrypted locally before storage.',
  'The app does not collect, transmit, or sell any personal information.',
];

const rights = [
  'View, edit, or delete any inventory, sales, or billing record at any time.',
  'Export all your data in PDF, Excel, or CSV format for personal records.',
  'Disable Google Drive cloud sync at any time from Settings.',
  'Clear all app data from your device through Backup & Restore settings.',
  'Benefit from soft-delete protection — deleted items are archived, not permanently removed.',
  'Request information about how your data is handled by contacting the developer.',
];

export default function PrivacyPolicy() {
  return (
    <AppLayout>
      <Header title="Privacy Policy" showBack />
      <div className="p-4 space-y-4 pb-8">
        {/* Hero */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto ring-2 ring-primary/20">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-bold">Privacy Policy 🔒</h1>
              <Badge variant="secondary" className="text-[11px]">Effective: March 2026</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your privacy is our priority. This app is designed to <strong>store all data locally on your device</strong>. 
              No personal or inventory data is shared unless you explicitly enable the optional cloud sync feature.
            </p>
          </div>
        </Card>

        {/* Data Collection & Storage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📦 Data Collection & Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <p className="text-xs text-muted-foreground mb-2">
              The following types of data are collected and stored <strong>exclusively on your device</strong>:
            </p>
            {dataItems.map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {securityPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Cloud Sync & Third Parties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Cloud Sync & Third Parties
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
              <p className="text-xs font-medium">Google Drive Sync (Optional)</p>
              <ul className="space-y-1.5">
                {[
                  'Cloud sync is entirely user-initiated and can be disabled at any time.',
                  'When enabled, your data is backed up to your personal Google Drive account.',
                  'Your Google Drive API key is encrypted locally — it is never sent to our servers.',
                  'We do not have access to your Google Drive or any backed-up data.',
                ].map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 items-start rounded-lg border border-primary/20 bg-primary/5 p-3">
              <ServerOff className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <strong>No other third-party services</strong> are used. The app does not integrate with analytics platforms, ad networks, or external APIs beyond Google Drive (when user-enabled).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {rights.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {[
                'Your data persists on your device until you choose to delete it.',
                'Deleted items are soft-deleted (archived) and can be recovered.',
                'There is no automatic data purging or expiration.',
                'Clearing browser data or uninstalling the app will remove all local data.',
              ].map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                  <span className="text-primary font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Baby className="h-4 w-4 text-primary" />
              Children's Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              This app is intended for business use and is not directed at children under the age of 13. 
              We do not knowingly collect personal information from children.
            </p>
          </CardContent>
        </Card>

        {/* No Tracking Banner */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3 items-start">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ScanEye className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Zero Tracking Promise</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We do not use cookies, analytics, fingerprinting, or any form of tracking technology. 
                  Your usage data stays on your device and is never monitored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm font-medium">📬 Contact Us</p>
            <p className="text-xs text-muted-foreground">
              If you have questions about this Privacy Policy or how your data is handled, please reach out:
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:zeeshankhan25102006@gmail.com" className="text-primary underline text-xs">
                zeeshankhan25102006@gmail.com
              </a>
            </div>
            <Separator />
            <p className="text-[11px] text-muted-foreground text-center">Last updated: March 2026</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
