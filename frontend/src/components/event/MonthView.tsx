import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import type { Event } from '@/app/events/page';

const today = new Date();

interface MonthViewProps {
  currentDate: Date;
  getFilteredEvents: (date: Date) => Event[];
  handleEmptyDayClick: (date: Date) => void;
  getCategoryBgColor: (category: string) => string;
  handleEventClick: (event: Event) => void;
  handleShowMore: (date: Date) => void;
}

export default function MonthView({
  currentDate,
  // TODO: Decide if the following need to be passed as props
  getFilteredEvents,
  handleEmptyDayClick,
  getCategoryBgColor,
  handleEventClick,
  handleShowMore,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className='overflow-hidden rounded-2xl bg-[#0C2C47]'>
      {/* Day headers */}
      <div className='grid grid-cols-7 gap-0.5 p-0.5 pt-0'>
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
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
                <div className='day-content pointer-events-none'>
                  {(() => {
                    const isToday = isSameDay(day, today);
                    return (
                      <div
                        className={`mb-2 text-base font-bold ${
                          isToday
                            ? 'flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7D4E] text-white'
                            : 'text-[#0C2C47]'
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    );
                  })()}
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
                          className={`h-2 w-2 rounded-full ${getCategoryBgColor(event.category)} shrink-0`}
                        ></div>
                        <span className='truncate font-medium text-[#0C2C47]'>
                          {event.eventName}
                        </span>
                      </div>
                    ))}
                    {hasMoreEvents && (
                      <button
                        className='w-full rounded bg-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-400'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowMore(day);
                        }}
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
