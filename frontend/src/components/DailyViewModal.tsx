'use client';

import { format } from 'date-fns';
import { Clock, MapPin, User } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCategoryBgColor } from '@/lib/formOptions';
import type { EventView } from '@/lib/utils/server/event';

interface DailyViewModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  date: Date;
  events: EventView[];
  onEventClick: (event: EventView) => void;
}

export default function DailyViewModal({
  isOpen,
  setIsOpen,
  date,
  events,
  onEventClick,
}: DailyViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {format(date, 'd MMMM').toUpperCase()} EVENTS
          </DialogTitle>
        </DialogHeader>
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
                className={`cursor-pointer rounded-xl p-3 ${getCategoryBgColor(event.bookedForOrg.category)}`}
                onClick={() => onEventClick(event)}
              >
                <h3 className='mb-2 text-sm font-semibold text-[#0C2C47]'>
                  {event.eventName}
                </h3>

                <div className='space-y-1 text-xs text-[#0C2C47]'>
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 fill-[#0C2C47]' />
                    <span>{event.bookedForOrg.name}</span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    <span>
                      {format(event.start, 'p')} - {format(event.end, 'p')}
                    </span>
                  </div>

                  {event.booking && (
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      <span>{event.booking.venue.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
