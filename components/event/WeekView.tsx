import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { ClockIcon, MapPinIcon, UserIcon } from 'lucide-react';

import { getCategoryBgColor } from '@/lib/formOptions';
import type { EventView } from '@/lib/utils/server/event';

interface WeekViewProps {
  currentDate: Date;
  getFilteredEvents: (date: Date) => EventView[];
  handleEmptyDayClick: (date: Date) => void;
  handleEventClick: (event: EventView) => void;
}

const today = new Date();

export default function WeekView({
  currentDate,
  getFilteredEvents,
  handleEmptyDayClick,
  handleEventClick,
}: WeekViewProps) {
  const calendarStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return (
    <div className='overflow-hidden rounded-2xl bg-[#0C2C47]'>
      {/* Day headers */}
      <div className='grid grid-cols-7 gap-0.5 p-0.5 pt-0'>
        {calendarDays.map((day) => (
          <div
            key={`${day.toISOString()}-header`}
            className='rounded-t-2xl border-b border-[#0C2C47] bg-white p-4 text-center text-[#0C2C47]'
          >
            <div className='text-base font-bold'>
              {format(day, 'EEE').toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Week grid */}
      <div className='mx-0.5 mb-0.5 grid min-h-[600px] grid-cols-7 gap-0.5'>
        {calendarDays.map((day, index) => {
          const dayEvents = getFilteredEvents(day);
          const isFirstCol = index === 0;
          const isLastCol = index === 6;

          return (
            <div
              key={day.toISOString()}
              className={`cursor-pointer bg-white p-4 hover:bg-gray-50 ${
                isFirstCol
                  ? 'rounded-bl-2xl'
                  : isLastCol
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

                {/* Events */}
                <div className='pointer-events-auto space-y-2'>
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`cursor-pointer rounded ${getCategoryBgColor(event.bookedForOrg.category)} p-2 text-xs`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className='font-medium'>{event.eventName}</div>
                      <div className='flex items-center gap-1 text-gray-600'>
                        <UserIcon className='h-4 w-4 fill-[#0C2C47]' />
                        <span>{event.bookedForOrg.name}</span>
                      </div>
                      <div className='flex items-center gap-1 text-gray-600'>
                        <ClockIcon className='h-4 w-4' />
                        <span>
                          {format(event.start, 'p')} - {format(event.end, 'p')}
                        </span>
                      </div>
                      {event.booking && (
                        <div className='flex items-center gap-1 text-gray-600'>
                          <MapPinIcon className='h-4 w-4' />
                          <span>{event.booking.venue.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
