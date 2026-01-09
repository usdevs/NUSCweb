import { isSameDay, isSameMonth, startOfWeek } from 'date-fns';
import { Fragment } from 'react';

interface CalendarHighlightProps {
  currentDate: Date;
  viewMode: 'MONTH' | 'WEEK';
  calendarStart: Date;
  calendarEnd: Date;
  calendarDays: Date[];
}

export default function CalendarHighlight({
  currentDate,
  viewMode,
  calendarStart,
  calendarEnd,
  calendarDays,
}: CalendarHighlightProps) {
  const cellHeight = 32;
  const gapSize = 4;

  if (viewMode === 'MONTH') {
    // Only highlight rows that contain current month days
    const rows = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      const week = calendarDays.slice(i, i + 7);
      const currentMonthDays = week.filter(
        (day) => day.getMonth() === currentDate.getMonth(),
      );

      if (currentMonthDays.length > 0) {
        const rowIndex = i / 7;
        // Find the range of current month days in this week
        const firstCurrentMonthIndex = week.findIndex((day) =>
          isSameMonth(day, currentDate),
        );
        const lastCurrentMonthIndex = week.findLastIndex((day) =>
          isSameMonth(day, currentDate),
        );

        if (firstCurrentMonthIndex !== -1 && lastCurrentMonthIndex !== -1) {
          const startCol = Math.max(0, firstCurrentMonthIndex);
          const endCol = Math.min(6, lastCurrentMonthIndex);
          const colWidth = 100 / 7;

          rows.push(
            <div
              key={i}
              className='absolute rounded-md bg-[#FCDED6]'
              style={{
                top: `${rowIndex * (cellHeight + gapSize)}px`,
                left: `${startCol * colWidth}%`,
                width: `${(endCol - startCol + 1) * colWidth}%`,
                height: `${cellHeight}px`,
              }}
            />,
          );
        }
      }
    }
    return rows;
  }

  if (viewMode === 'WEEK') {
    const weekStart = startOfWeek(currentDate, {
      weekStartsOn: 1,
    });

    // Only highlight if week intersects current month
    const weekStartIndex = calendarDays.findIndex((day) =>
      isSameDay(day, weekStart),
    );

    if (weekStartIndex >= 0) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const dayIndex = weekStartIndex + i;
        if (dayIndex < calendarDays.length) {
          weekDays.push(calendarDays[dayIndex]);
        }
      }

      // Only highlight days in current month or visible in calendar
      const segments = [];
      let currentSegmentStart = -1;

      weekDays.forEach((day, index) => {
        // Include if current month or visible in calendar view
        const shouldHighlight =
          day.getMonth() === currentDate.getMonth() ||
          (day >= calendarStart && day <= calendarEnd);

        if (shouldHighlight) {
          if (currentSegmentStart === -1) {
            currentSegmentStart = index;
          }
        } else {
          if (currentSegmentStart !== -1) {
            // End current segment
            const startDayIndex = weekStartIndex + currentSegmentStart;
            const endDayIndex = weekStartIndex + index - 1;
            const startRowIndex = Math.floor(startDayIndex / 7);
            const endRowIndex = Math.floor(endDayIndex / 7);
            const startColIndex = startDayIndex % 7;
            const endColIndex = endDayIndex % 7;

            segments.push({
              startRowIndex,
              endRowIndex,
              startColIndex,
              endColIndex,
            });
            currentSegmentStart = -1;
          }
        }
      });

      // Handle case where segment goes to the end
      if (currentSegmentStart !== -1) {
        const startDayIndex = weekStartIndex + currentSegmentStart;
        const endDayIndex = weekStartIndex + weekDays.length - 1;
        const startRowIndex = Math.floor(startDayIndex / 7);
        const endRowIndex = Math.floor(endDayIndex / 7);
        const startColIndex = startDayIndex % 7;
        const endColIndex = endDayIndex % 7;

        segments.push({
          startRowIndex,
          endRowIndex,
          startColIndex,
          endColIndex,
        });
      }

      return segments.map((segment, segmentIndex) => {
        const colWidth = 100 / 7;

        if (segment.startRowIndex === segment.endRowIndex) {
          // Single row segment
          return (
            <div
              key={segmentIndex}
              className='absolute rounded-md bg-[#FCDED6]'
              style={{
                top: `${segment.startRowIndex * (cellHeight + gapSize)}px`,
                left: `${segment.startColIndex * colWidth}%`,
                width: `${(segment.endColIndex - segment.startColIndex + 1) * colWidth}%`,
                height: `${cellHeight}px`,
              }}
            />
          );
        } else {
          // Multi-row segment
          return (
            <Fragment key={segmentIndex}>
              <div
                className='absolute rounded-l-md bg-[#FCDED6]'
                style={{
                  top: `${segment.startRowIndex * (cellHeight + gapSize)}px`,
                  left: `${segment.startColIndex * colWidth}%`,
                  width: `${(6 - segment.startColIndex + 1) * colWidth}%`,
                  height: `${cellHeight}px`,
                }}
              />
              <div
                className='absolute rounded-r-md bg-[#FCDED6]'
                style={{
                  top: `${segment.endRowIndex * (cellHeight + gapSize)}px`,
                  left: '0%',
                  width: `${(segment.endColIndex + 1) * colWidth}%`,
                  height: `${cellHeight}px`,
                }}
              />
            </Fragment>
          );
        }
      });
    }
  }

  return null;
}
