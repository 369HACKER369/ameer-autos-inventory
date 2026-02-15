import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency, formatCurrencyShort } from '@/utils/currency';
import { getRelativeDate, formatTime } from '@/utils/dateUtils';
import { toSafeQuantity } from '@/utils/safeNumber';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  AlertTriangle,
  Plus,
  BarChart3,
  Download,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmergencyIndicator, isLowStock } from '@/components/ui/emergency-indicator';

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    stats, 
    isLoadingStats, 
    lowStockParts, 
    recentActivity,
    isInitialized,
    appName,
  } = useApp();

  if (!isInitialized) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title={appName} subtitle="Inventory & Sales Manager" />
      
      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            title="Total Parts"
            value={isLoadingStats ? null : stats.totalParts.toString()}
            icon={Package}
            iconColor="text-primary"
          />
          <SummaryCard
            title="Inventory Value"
            value={isLoadingStats ? null : formatCurrencyShort(stats.inventoryValue)}
            icon={TrendingUp}
            iconColor="text-primary"
          />
          <SummaryCard
            title="Today's Sales"
            value={isLoadingStats ? null : formatCurrency(stats.todaySales)}
            icon={ShoppingCart}
            iconColor="text-primary"
          />
          <SummaryCard
            title="Low Stock"
            value={isLoadingStats ? null : stats.lowStockCount.toString()}
            icon={AlertTriangle}
            iconColor={stats.lowStockCount > 0 ? 'text-warning' : 'text-muted-foreground'}
            highlight={stats.lowStockCount > 0}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-2">
            <QuickAction
              icon={Plus}
              label="Add Part"
              onClick={() => navigate('/inventory/add')}
            />
            <QuickAction
              icon={ShoppingCart}
              label="New Sale"
              onClick={() => navigate('/sale')}
            />
            <QuickAction
              icon={BarChart3}
              label="Reports"
              onClick={() => navigate('/reports')}
            />
            <QuickAction
              icon={Download}
              label="Backup"
              onClick={() => navigate('/settings/backup')}
            />
          </div>
        </div>

        {/* Low Stock Alerts */}
        {lowStockParts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground">Low Stock Alerts</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => navigate('/inventory?status=low-stock')}
              >
                View All
              </Button>
            </div>
            <Card className="bg-card">
              <CardContent className="p-0 divide-y divide-border">
                {lowStockParts.slice(0, 5).map((part) => {
                  const qty = toSafeQuantity(part.quantity, 0);
                  const minStock = toSafeQuantity(part.minStockLevel, 0);
                  
                  return (
                    <div 
                      key={part.id}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/inventory/${part.id}`)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{part.name}</p>
                          {isLowStock(qty, minStock) && (
                            <EmergencyIndicator size="sm" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">SKU: {part.sku}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn(
                          'text-sm font-semibold',
                          qty === 0 ? 'text-destructive' : 'text-warning'
                        )}>
                          {qty} left
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">Recent Activity</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => navigate('/activity-log')}
            >
              View All
            </Button>
          </div>
          <Card className="bg-card">
            <CardContent className="p-0 divide-y divide-border">
              {recentActivity.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No activity yet</p>
                  <p className="text-xs mt-1">Start by adding your first part</p>
                </div>
              ) : (
                recentActivity.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3">
                    <div className="shrink-0 mt-0.5">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">{log.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getRelativeDate(log.createdAt)} at {formatTime(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Stats */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Monthly Profit</p>
                <p className="text-xl font-bold text-primary mt-1">
                  {formatCurrency(stats.monthlyProfit)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

// Summary Card Component
interface SummaryCardProps {
  title: string;
  value: string | null;
  icon: React.ElementType;
  iconColor?: string;
  highlight?: boolean;
}

function SummaryCard({ title, value, icon: Icon, iconColor = 'text-primary', highlight }: SummaryCardProps) {
  return (
    <Card className={cn('bg-card', highlight && 'border-warning/50')}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground truncate">{title}</p>
            {value === null ? (
              <Skeleton className="h-6 w-16 mt-1" />
            ) : (
              <p className="text-lg font-bold mt-1 truncate">{value}</p>
            )}
          </div>
          <Icon className={cn('h-5 w-5 shrink-0', iconColor)} />
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Action Button Component
interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function QuickAction({ icon: Icon, label, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors touch-target"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
    </button>
  );
}
