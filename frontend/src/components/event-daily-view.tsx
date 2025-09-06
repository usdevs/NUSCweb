'use client';

import { format } from 'date-fns';
import { Clock, MapPin, User, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Event {
  id: number;
  eventName: string;
  organization: string;
  category: string;
  venue: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface EventDailyViewProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: Event[];
  onEventClick: (event: Event) => void;
  getCategoryBgColor: (category: string) => string;
}

export default function EventDailyView({
  isOpen,
  onClose,
  date,
  events,
  onEventClick,
  getCategoryBgColor,
}: EventDailyViewProps) {
  if (!isOpen || !date) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop overlay */}
      <div
        className='bg-opacity-50 fixed inset-0 bg-black'
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div
        className={`relative flex min-h-screen items-center justify-center p-4`}
      >
        <div
          className={`relative w-full max-w-sm overflow-hidden rounded-[20px] bg-[#0C2C47] p-6 shadow-lg`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between bg-[#0C2C47] px-4 text-white`}
          >
            <h2 className='text-sm font-semibold'>
              {format(date, 'd MMMM').toUpperCase()} EVENTS
            </h2>
            <Button
              variant='ghost'
              size='icon'
              className={`h-6 w-6 text-white hover:text-white/80`}
              onClick={onClose}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>

          {/* Events list */}
          <div className='max-h-96 space-y-3 overflow-y-auto p-4'>
            {events.length === 0 ? (
              <div className='py-8 text-center text-gray-500'>
                No events scheduled for this day
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className={`cursor-pointer rounded-xl p-3 ${getCategoryBgColor(event.category)}`}
                  onClick={() => {
                    onEventClick(event);
                    onClose();
                  }}
                >
                  <h3 className='mb-2 text-sm font-semibold text-[#0C2C47]'>
                    {event.eventName}
                  </h3>

                  <div className='space-y-1 text-xs text-[#0C2C47]'>
                    <div className='flex items-center gap-2'>
                      <User
                        className='h-4 w-4 fill-current'
                        style={{ fill: '#0C2C47' }}
                      />
                      <span>{event.organization}</span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      <span>
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
