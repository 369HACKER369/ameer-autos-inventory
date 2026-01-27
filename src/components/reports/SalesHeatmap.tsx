import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useMemo } from 'react';

interface SalesHeatmapData {
  date: string; // YYYY-MM-DD format
  value: number;
}

interface SalesHeatmapProps {
  data: SalesHeatmapData[];
  title?: string;
}

export function SalesHeatmap({ data, title = "Sales Activity Heatmap" }: SalesHeatmapProps) {
  const { weeks, maxValue, monthLabels } = useMemo(() => {
    if (data.length === 0) {
      return { weeks: [], maxValue: 0, monthLabels: [] };
    }

    // Create a map of date -> value
    const valueMap = new Map(data.map(d => [d.date, d.value]));
    
    // Get date range
    const dates = data.map(d => new Date(d.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Align to week start (Monday)
    const startDate = new Date(minDate);
    startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));
    
    // Extend to end of week (Sunday)
    const endDate = new Date(maxDate);
    endDate.setDate(endDate.getDate() + (7 - endDate.getDay()) % 7);
    
    // Generate weeks
    const weeksData: { date: Date; value: number }[][] = [];
    const currentDate = new Date(startDate);
    let currentWeek: { date: Date; value: number }[] = [];
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      currentWeek.push({
        date: new Date(currentDate),
        value: valueMap.get(dateStr) || 0,
      });
      
      if (currentWeek.length === 7) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentWeek.length > 0) {
      weeksData.push(currentWeek);
    }
    
    // Calculate max value for color scaling
    const max = Math.max(...data.map(d => d.value), 1);
    
    // Generate month labels
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeksData.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0].date;
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        labels.push({
          label: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex,
        });
        lastMonth = month;
      }
    });
    
    return { weeks: weeksData, maxValue: max, monthLabels: labels };
  }, [data]);

  if (data.length === 0) return null;

  const getColorIntensity = (value: number): string => {
    if (value === 0) return 'hsl(0, 0%, 12%)';
    const intensity = Math.min(value / maxValue, 1);
    
    // Green color scale from light to dark
    if (intensity < 0.25) return 'hsl(142, 50%, 25%)';
    if (intensity < 0.5) return 'hsl(142, 60%, 35%)';
    if (intensity < 0.75) return 'hsl(142, 70%, 40%)';
    return 'hsl(142, 76%, 45%)';
  };

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <Card className="bg-card border-border/50 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mb-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(0, 0%, 12%)' }} />
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(142, 50%, 25%)' }} />
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(142, 60%, 35%)' }} />
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(142, 70%, 40%)' }} />
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(142, 76%, 45%)' }} />
          </div>
          <span>More</span>
        </div>

        <div className="overflow-x-auto">
          {/* Month labels */}
          <div className="flex mb-1 ml-6">
            {monthLabels.map((label, idx) => (
              <div
                key={idx}
                className="text-[10px] text-muted-foreground"
                style={{
                  position: 'relative',
                  left: `${label.weekIndex * 14}px`,
                  marginRight: idx < monthLabels.length - 1 
                    ? `${(monthLabels[idx + 1]?.weekIndex - label.weekIndex - 1) * 14}px`
                    : 0,
                }}
              >
                {label.label}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {dayLabels.map((day, idx) => (
                <div
                  key={idx}
                  className="w-4 h-3 text-[9px] text-muted-foreground flex items-center justify-end pr-0.5"
                >
                  {idx % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-0.5">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-0.5">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="w-3 h-3 rounded-sm transition-all duration-200 hover:ring-1 hover:ring-primary/50 cursor-pointer"
                      style={{ backgroundColor: getColorIntensity(day.value) }}
                      title={`${day.date.toLocaleDateString('en-GB')}: Rs ${day.value.toLocaleString()}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
