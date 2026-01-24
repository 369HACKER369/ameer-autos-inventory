import { useLiveQuery } from 'dexie-react-hooks';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { db } from '@/db/database';
import { getRelativeDate, formatTime } from '@/utils/dateUtils';
import { getActivityIcon, getActivityColor } from '@/services/activityLogService';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ShoppingCart, 
  Download, 
  Upload, 
  RefreshCw,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityAction } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Plus,
  Pencil,
  Trash2,
  ShoppingCart,
  Download,
  Upload,
  RefreshCw,
  Activity,
};

export default function ActivityLogPage() {
  const activityLogs = useLiveQuery(
    () => db.activityLogs.orderBy('createdAt').reverse().toArray(),
    []
  ) ?? [];

  const getIcon = (action: ActivityAction) => {
    const iconName = getActivityIcon(action);
    return iconMap[iconName] || Activity;
  };

  return (
    <AppLayout>
      <Header title="Activity Log" showBack />

      <div className="p-4">
        {activityLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No activity yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Activities will appear here as you use the app
            </p>
          </div>
        ) : (
          <Card className="bg-card">
            <CardContent className="p-0 divide-y divide-border">
              {activityLogs.map((log) => {
                const Icon = getIcon(log.action);
                const colorClass = getActivityColor(log.action);
                
                return (
                  <div key={log.id} className="flex items-start gap-3 p-4">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                      'bg-muted'
                    )}>
                      <Icon className={cn('h-4 w-4', colorClass)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{log.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {getRelativeDate(log.createdAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
