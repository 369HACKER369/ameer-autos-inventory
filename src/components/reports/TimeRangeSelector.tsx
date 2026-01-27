import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from '@/types';

interface TimeRangeSelectorProps {
  dateRanges: DateRange[];
  selectedRangeIndex: number;
  onRangeChange: (index: number) => void;
  customStartDate?: Date;
  customEndDate?: Date;
  onCustomStartChange?: (date: Date | undefined) => void;
  onCustomEndChange?: (date: Date | undefined) => void;
}

export function TimeRangeSelector({
  dateRanges,
  selectedRangeIndex,
  onRangeChange,
  customStartDate,
  customEndDate,
  onCustomStartChange,
  onCustomEndChange,
}: TimeRangeSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);
  const selectedRange = dateRanges[selectedRangeIndex];

  const handleRangeChange = (value: string) => {
    if (value === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onRangeChange(parseInt(value));
    }
  };

  return (
    <div className="space-y-3">
      <Select 
        value={showCustom ? 'custom' : selectedRangeIndex.toString()} 
        onValueChange={handleRangeChange}
      >
        <SelectTrigger className="bg-card border-border/50">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select period" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {dateRanges.map((range, index) => (
            <SelectItem key={index} value={index.toString()}>
              {range.label}
            </SelectItem>
          ))}
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {/* Custom Date Range Picker */}
      {showCustom && onCustomStartChange && onCustomEndChange && (
        <div className="flex flex-col sm:flex-row gap-2 p-3 bg-card/50 rounded-lg border border-border/50">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !customStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customStartDate ? format(customStartDate, "dd MMM yyyy") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <Calendar
                  mode="single"
                  selected={customStartDate}
                  onSelect={onCustomStartChange}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !customEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customEndDate ? format(customEndDate, "dd MMM yyyy") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <Calendar
                  mode="single"
                  selected={customEndDate}
                  onSelect={onCustomEndChange}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => 
                    date > new Date() || 
                    (customStartDate ? date < customStartDate : false)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Date Range Display */}
      <div className="text-xs text-muted-foreground text-center">
        {showCustom && customStartDate && customEndDate
          ? `${format(customStartDate, 'dd MMM yyyy')} - ${format(customEndDate, 'dd MMM yyyy')}`
          : `${format(selectedRange.startDate, 'dd MMM yyyy')} - ${format(selectedRange.endDate, 'dd MMM yyyy')}`
        }
      </div>
    </div>
  );
}
