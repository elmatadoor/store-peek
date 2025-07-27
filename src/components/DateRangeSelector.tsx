import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

export type DateRange = {
  from: Date;
  to: Date;
};

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presetRanges = [
    {
      label: 'Last 24 hours',
      value: 'last24h',
      getRange: () => ({
        from: subDays(new Date(), 1),
        to: new Date()
      })
    },
    {
      label: 'Last 7 days',
      value: 'last7d',
      getRange: () => ({
        from: subDays(new Date(), 7),
        to: new Date()
      })
    },
    {
      label: 'Last 30 days',
      value: 'last30d',
      getRange: () => ({
        from: subDays(new Date(), 30),
        to: new Date()
      })
    },
    {
      label: 'Last 4 months',
      value: 'last4m',
      getRange: () => ({
        from: subMonths(new Date(), 4),
        to: new Date()
      })
    }
  ];

  const handlePresetChange = (presetValue: string) => {
    const preset = presetRanges.find(p => p.value === presetValue);
    if (preset) {
      const range = preset.getRange();
      onChange({
        from: startOfDay(range.from),
        to: endOfDay(range.to)
      });
    }
  };

  const handleCustomDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (!value.from || (value.from && value.to)) {
        // Start new selection
        onChange({
          from: startOfDay(selectedDate),
          to: endOfDay(selectedDate)
        });
      } else if (value.from && !value.to) {
        // Complete the range
        if (selectedDate >= value.from) {
          onChange({
            from: value.from,
            to: endOfDay(selectedDate)
          });
          setIsOpen(false);
        } else {
          onChange({
            from: startOfDay(selectedDate),
            to: endOfDay(value.from)
          });
          setIsOpen(false);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {presetRanges.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a custom date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={value?.from}
            onSelect={handleCustomDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}