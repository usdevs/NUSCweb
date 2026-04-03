import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { ClockIcon, MapPinIcon, UserIcon } from 'lucide-react';

import { getCategoryBgColor } from '@/lib/formOptions';
import { toSGT } from '@/lib/utils/client/time';
import type { EventView } from '@/lib/utils/server/event';

interface WeekViewProps {
  currentDate: Date;
  getFilteredEvents: (date: Date) => EventView[];
  handleEmptyDayClick: (date: Date) => void;
  handleEventClick: (event: EventView) => void;
}

const today = toSGT(new Date());

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
      {/* Week grid */}
      <div className='mx-0.5 mb-0.5 grid min-h-35 grid-cols-1 gap-0.5 sm:grid-cols-7'>
        {calendarDays.map((day, index) => {
          const dayEvents = getFilteredEvents(day);
          const isFirstCol = index === 0;
          const isLastCol = index === 6;

          return (
            <div
              className='flex h-full flex-col'
              key={`${day.toISOString()}-header`}
            >
              <div className='rounded-t-2xl border-b border-[#0C2C47] bg-white p-4 text-center text-[#0C2C47]'>
                <div className='hidden text-base font-bold sm:block'>
                  {format(day, 'EEE').toUpperCase()}
                </div>
                <div className='flex justify-center text-base font-bold sm:hidden'>
                  {format(day, 'EEE').charAt(0)}
                </div>
              </div>
              <div
                key={day.toISOString()}
                className={`flex-1 cursor-pointer rounded-b-2xl bg-white p-4 hover:bg-gray-50 ${isFirstCol ? 'sm:rounded-bl-2xl' : 'sm:rounded-bl-none'} ${isLastCol ? 'sm:rounded-br-2xl' : 'sm:rounded-br-none'} `}
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
                    className={`mb-2 inline-flex justify-center text-base font-bold ${
                      isSameDay(day, today)
                        ? `h-8 w-8 items-center rounded-full bg-[#FF7D4E] text-white`
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
                        <div className='mb-2 font-medium'>
                          {event.eventName}
                        </div>
                        <div className='flex items-center gap-1 text-gray-600'>
                          <UserIcon className='h-4 w-4 fill-[#0C2C47]' />
                          <span>{event.bookedForOrg.name}</span>
                        </div>
                        <div className='flex items-center gap-1 text-gray-600'>
                          <ClockIcon className='h-4 w-4' />
                          <span>
                            {format(toSGT(event.start), 'p')} -{' '}
                            {format(toSGT(event.end), 'p')}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
