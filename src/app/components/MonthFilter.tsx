/**
 * MonthFilter Component
 * Allows users to filter transactions by month
 */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { CalendarDays } from 'lucide-react';

interface MonthFilterProps {
  availableMonths: Array<{ year: number; month: number; label: string }>;
  selectedMonth: { year: number; month: number } | null;
  onMonthChange: (month: { year: number; month: number } | null) => void;
}

export function MonthFilter({ availableMonths, selectedMonth, onMonthChange }: MonthFilterProps) {
  const handleValueChange = (value: string) => {
    if (value === 'all') {
      onMonthChange(null);
    } else {
      const [year, month] = value.split('-').map(Number);
      onMonthChange({ year, month });
    }
  };

  const currentValue = selectedMonth ? `${selectedMonth.year}-${selectedMonth.month}` : 'all';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filter by Month</label>
            <Select value={currentValue} onValueChange={handleValueChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {availableMonths.map((m) => (
                  <SelectItem key={`${m.year}-${m.month}`} value={`${m.year}-${m.month}`}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
