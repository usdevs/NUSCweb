import { isSameDay } from 'date-fns';

import { getCategoryBgColor } from '@/lib/formOptions';
import type { EventView } from '@/lib/utils/server/event';

const DAY_OF_WEEKS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const today = new Date();

interface MonthViewProps {
  currentDate: Date;
  calendarDays: Date[];
  getFilteredEvents: (date: Date) => EventView[];
  handleEmptyDayClick: (date: Date) => void;
  handleEventClick: (event: EventView) => void;
  handleShowMore: (date: Date) => void;
}

export default function MonthView({
  currentDate,
  calendarDays,
  getFilteredEvents,
  handleEmptyDayClick,
  handleEventClick,
  handleShowMore,
}: MonthViewProps) {
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className='overflow-hidden rounded-2xl bg-[#0C2C47]'>
      {/* Day headers */}
      <div className='grid grid-cols-7 gap-0.5 p-0.5 pt-0'>
        {DAY_OF_WEEKS.map((day) => (
          <div
            key={day}
            className='rounded-t-2xl border-b border-[#0C2C47] bg-white p-4 text-center text-base font-bold text-[#0C2C47]'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className='mx-0.5 mb-0.5 grid grid-cols-7 gap-0.5'>
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const dayEvents = getFilteredEvents(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isLastRow = weekIndex === weeks.length - 1;
            const isFirstCol = dayIndex === 0;
            const isLastCol = dayIndex === 6;
            const maxEventsToShow = 2;
            const hasMoreEvents = dayEvents.length > maxEventsToShow;

            if (!isCurrentMonth) {
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`h-[140px] bg-white ${
                    isLastRow && isFirstCol
                      ? 'rounded-bl-2xl'
                      : isLastRow && isLastCol
                        ? 'rounded-br-2xl'
                        : ''
                  }`}
                />
              );
            }

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`h-[140px] cursor-pointer bg-white p-4 hover:bg-gray-50 ${
                  isLastRow && isFirstCol
                    ? 'rounded-bl-2xl'
                    : isLastRow && isLastCol
                      ? 'rounded-br-2xl'
                      : ''
                }`}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (
                    e.target === e.currentTarget ||
                    target.classList?.contains('day-content')
                  ) {
                    handleEmptyDayClick(day);
                  }
                }}
              >
                <div className='pointer-events-none'>
                  <div
                    className={`mb-2 text-base font-bold ${
                      isSameDay(day, today)
                        ? `flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7D4E] text-white`
                        : 'text-[#0C2C47]'
                    }`}
                  >
                    {day.getDate()}
                  </div>
                  <div className='pointer-events-auto space-y-1'>
                    {dayEvents.slice(0, maxEventsToShow).map((event) => (
                      <div
                        key={event.id}
                        className='flex cursor-pointer items-center gap-2 text-xs'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${getCategoryBgColor(event.bookedForOrg.category)} shrink-0`}
                        />
                        <span className='truncate font-medium text-[#0C2C47]'>
                          {event.eventName}
                        </span>
                      </div>
                    ))}
                    {hasMoreEvents && (
                      <button
                        className='w-full rounded bg-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-400'
                        onClick={() => handleShowMore(day)}
                      >
                        SHOW MORE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
