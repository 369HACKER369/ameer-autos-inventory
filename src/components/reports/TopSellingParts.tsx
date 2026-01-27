import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency';
import { Trophy, TrendingUp } from 'lucide-react';

interface TopPartData {
  partId: string;
  partName: string;
  sku: string;
  quantitySold: number;
  totalRevenue: number;
  totalProfit: number;
}

interface TopSellingPartsProps {
  data: TopPartData[];
  title?: string;
}

export function TopSellingParts({ data, title = "Top Selling Parts" }: TopSellingPartsProps) {
  if (data.length === 0) return null;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <Trophy className="h-3 w-3 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-xs font-bold text-white">
            2
          </div>
        );
      case 3:
        return (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xs font-bold text-white">
            3
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
            {rank}
          </div>
        );
    }
  };

  return (
    <Card className="bg-card border-border/50 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {data.map((part, index) => (
            <div 
              key={part.partId} 
              className="flex items-center justify-between p-3 transition-colors hover:bg-muted/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                {getRankBadge(index + 1)}
                <div>
                  <p className="font-medium text-sm line-clamp-1">{part.partName}</p>
                  <p className="text-xs text-muted-foreground">
                    {part.quantitySold} sold • SKU: {part.sku}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{formatCurrency(part.totalRevenue)}</p>
                <p className="text-xs text-primary flex items-center justify-end gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  +{formatCurrency(part.totalProfit)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
