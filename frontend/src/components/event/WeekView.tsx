import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { Clock, MapPin, User } from 'lucide-react';
import type { Event } from '@/app/events/page';

interface WeekViewProps {
  currentDate: Date;
  getFilteredEvents: (date: Date) => Event[];
  handleEmptyDayClick: (date: Date) => void;
  handleEventClick: (event: Event) => void;
}

const today = new Date();

export default function WeekView({
  currentDate,
  getFilteredEvents,
  handleEmptyDayClick,
  handleEventClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className='overflow-hidden rounded-2xl bg-[#0C2C47]'>
      {/* Day headers */}
      <div className='grid grid-cols-7 gap-0.5 p-0.5 pt-0'>
        {weekDays.map((day) => (
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
        {weekDays.map((day, index) => {
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

                {/* Events */}
                <div className='pointer-events-auto space-y-2'>
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className='cursor-pointer rounded bg-[#FCDED6] p-2 text-xs'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className='font-medium'>{event.eventName}</div>
                      <div className='flex items-center gap-1 text-gray-600'>
                        <User
                          className='h-4 w-4 fill-current'
                          style={{ fill: '#0C2C47' }}
                        />
                        <span>{event.organization}</span>
                      </div>
                      <div className='flex items-center gap-1 text-gray-600'>
                        <Clock className='h-4 w-4' />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className='flex items-center gap-1 text-gray-600'>
                        <MapPin className='h-4 w-4' />
                        <span>{event.venue}</span>
                      </div>
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
