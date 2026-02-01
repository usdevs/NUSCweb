import { isSameMonth, isSameWeek } from 'date-fns';
import type { Dispatch } from 'react';

interface CalendarGridProps {
  currentDate: Date;
  setCurrentDate: Dispatch<Date>;
  viewMode: 'MONTH' | 'WEEK';
  calendarDays: Date[];
}

export default function CalendarGrid({
  currentDate,
  setCurrentDate,
  viewMode,
  calendarDays,
}: CalendarGridProps) {
  const isDateInCurrentPeriod = (date: Date) =>
    viewMode === 'MONTH'
      ? isSameMonth(date, currentDate)
      : isSameWeek(date, currentDate, { weekStartsOn: 1 });

  return calendarDays.map((day) => {
    const isCurrentMonth = isSameMonth(day, currentDate);

    const isInCurrentPeriod = isDateInCurrentPeriod(day);

    return (
      <button
        key={day.toISOString()}
        className={`relative z-10 h-8 px-1 py-1 text-center text-xs ${
          !isCurrentMonth
            ? 'text-gray-300'
            : isInCurrentPeriod
              ? 'font-medium text-[#0C2C47]'
              : `rounded text-[#0C2C47] hover:bg-gray-100`
        }`}
        onClick={() => setCurrentDate(day)}
      >
        {day.getDate()}
      </button>
    );
  });
}
