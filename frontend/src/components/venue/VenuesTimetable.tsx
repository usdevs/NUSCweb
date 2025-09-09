'use client';

import { isSameDay } from 'date-fns';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod/v4';

import BookingCard from '@/components/booking/BookingCard';
import CardPortal from '@/components/CardPortal';
import { TIMETABLE_TIMESLOTS } from '@/lib/formOptions';
import { NewBookingClientSchema } from '@/lib/schema/booking';
import { timeToIndex } from '@/lib/utils/client';
import { BookingView } from '@/lib/utils/server/booking';
import { VenueView } from '@/lib/utils/server/venue';

import VenueTimetable from './VenueTimetable';

export interface DragPosition {
  time: string;
  venue: VenueView;
}

interface VenuesTimetableProps {
  bookings: BookingView[];
  venues: VenueView[];
  date: Date;
  handleBookingClick: (booking: BookingView) => void;
  setSelectedTimeRange: Dispatch<
    SetStateAction<{
      venue: VenueView;
      startTime: Date;
      endTime: Date;
    } | null>
  >;
  form: UseFormReturn<z.input<typeof NewBookingClientSchema>>;
}

export default function VenuesTimetable({
  bookings,
  venues,
  date,
  handleBookingClick,
  setSelectedTimeRange,
  form,
}: VenuesTimetableProps) {
  const [dragStart, setDragStart] = useState<DragPosition | null>(null);
  const [dragEnd, setDragEnd] = useState<DragPosition | null>(null);
  const [hoveredBooking, setHoveredBooking] = useState<BookingView | null>(
    null,
  );

  const handleMouseUp = () => {
    if (dragStart && dragEnd) {
      // Calculate start and end times from drag
      const startIndex = Math.min(
        timeToIndex(dragStart.time),
        timeToIndex(dragEnd.time),
      );
      const endIndex =
        Math.max(timeToIndex(dragStart.time), timeToIndex(dragEnd.time)) + 1;

      const startTime = new Date(date);
      startTime.setHours(startIndex, 0);

      const endTime = new Date(date);
      endTime.setHours(endIndex, 0);

      setSelectedTimeRange({
        // Use the room from dragStart (column where user started dragging)
        venue: dragStart.venue,
        startTime,
        endTime,
      });
      form.setValue('venueId', dragStart.venue.id);
      form.setValue('startTime', startTime);
      form.setValue('endTime', endTime);

      // Reset drag state
      setDragStart(null);
      setDragEnd(null);
    }
  };

  return (
    <div className={`mt-10 flex-1 overflow-auto px-2 lg:ml-8 lg:px-0`}>
      {/* Timetable - Full width on mobile */}
      <div className='flex'>
        {/* Time labels column */}
        <div className={`flex w-10 flex-col text-right lg:w-14`}>
          <div className='h-8' />
          {TIMETABLE_TIMESLOTS.map((time) => (
            <div
              key={time}
              className={`relative flex h-12 items-center justify-end pr-2 text-xs text-white lg:text-sm`}
            >
              {time}
              {/* White connecting line */}
              <div className='absolute top-1/2 right-0 h-px w-2 bg-white'></div>
            </div>
          ))}
        </div>

        {/* Scrollable container for room timetables */}
        <div className='flex-1 overflow-x-auto'>
          <div className='flex gap-1' onMouseUp={handleMouseUp}>
            {venues.map((venue) => (
              <VenueTimetable
                key={venue.id}
                venue={venue}
                bookings={bookings.filter(
                  (booking) =>
                    booking.venue.id === venue.id &&
                    isSameDay(booking.start, date),
                )}
                dragStart={dragStart}
                dragEnd={dragEnd}
                setHoveredBooking={setHoveredBooking}
                setDragStart={setDragStart}
                setDragEnd={setDragEnd}
                handleBookingClick={handleBookingClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hover card portal */}
      {/* TODO: Use react-tooltip instead */}
      {hoveredBooking && (
        <CardPortal>
          <div className='transform-[translate(20px, -50%)] fixed top-(--mouse-y) left-(--mouse-x)'>
            <BookingCard booking={hoveredBooking} />
          </div>
        </CardPortal>
      )}
    </div>
  );
}
