'use client';

import { format } from 'date-fns';
import { Dispatch, SetStateAction } from 'react';

import { TIMETABLE_TIMESLOTS } from '@/lib/formOptions';
import { timeToIndex } from '@/lib/utils/client';
import type { BookingView } from '@/lib/utils/server/booking';
import type { VenueView } from '@/lib/utils/server/venue';

import type { DragPosition } from './VenuesTimetable';

interface VenueTimetableProps {
  venue: VenueView;
  bookings: BookingView[];
  dragStart: DragPosition | null;
  setDragStart: Dispatch<SetStateAction<DragPosition | null>>;
  dragEnd: DragPosition | null;
  setDragEnd: Dispatch<SetStateAction<DragPosition | null>>;
  handleBookingClick: (booking: BookingView) => void;
  setHoveredBooking: Dispatch<SetStateAction<BookingView | null>>;
}

export default function VenueTimetable({
  venue,
  bookings,
  dragStart,
  setDragStart,
  dragEnd,
  setDragEnd,
  handleBookingClick,
  setHoveredBooking,
}: VenueTimetableProps) {
  const getCellBooking = (time: string) => {
    const timeIndex = timeToIndex(time);

    // Find a booking that:
    // 1. Matches the room
    // 2. Is on the current selected date
    // 3. The time falls within the booking's start and end times
    return bookings.find(
      (booking) =>
        timeIndex >= booking.start.getHours() &&
        timeIndex < booking.end.getHours(),
    );
  };

  const handleMouseDown = (time: string) => {
    if (!getCellBooking(time)) {
      setDragStart({ time, venue });
      setDragEnd({ time, venue });
    }
  };

  const handleMouseMove = (time: string) => {
    if (dragStart) {
      setDragEnd({ time, venue });
    }
  };

  return (
    <div className='min-w-[200px] flex-1 overflow-hidden rounded-lg'>
      {/* Room header */}
      <div
        className={`flex h-14 items-center justify-center rounded-tl-3xl rounded-tr-3xl border-b bg-white p-2 text-center text-sm font-medium whitespace-normal text-[#0C2C47]`}
      >
        {venue.name}
      </div>

      {/* Time cells */}
      <div className='divide-y bg-white'>
        {TIMETABLE_TIMESLOTS.map((time) => {
          // Find if there's a booking for this time and room
          const booking = bookings.find(
            (booking) =>
              timeToIndex(time) >= booking.start.getHours() &&
              timeToIndex(time) < booking.end.getHours(),
          );

          // Check if this cell is in drag selection
          const isSelected =
            dragStart &&
            dragEnd &&
            dragStart.venue.id === venue.id &&
            timeToIndex(time) >=
              Math.min(
                timeToIndex(dragStart.time),
                timeToIndex(dragEnd.time),
              ) &&
            timeToIndex(time) <=
              Math.max(
                timeToIndex(dragStart.time),
                timeToIndex(dragEnd.time),
              ) &&
            !booking;

          if (!booking)
            return (
              <div
                key={`${venue.id}-${time}`}
                className={`relative h-12 cursor-cell p-2 ${isSelected ? `bg-blue-200` : `bg-white`}`}
                onMouseDown={() => handleMouseDown(time)}
                onMouseMove={() => handleMouseMove(time)}
              />
            );

          // Check if this is the first cell of a booking
          const isFirstCell = booking && format(booking.start, 'Ka') === time;

          // Calculate span for booking
          // TODO: Test for events spanning from day 1, 11pm to day 2, 1am
          const getSpan = () => {
            if (!booking || !isFirstCell) return 1;
            const startIndex = booking.start.getHours();
            const endIndex = booking.end.getHours();
            return endIndex - startIndex;
          };

          const span = getSpan();

          if (isFirstCell)
            return (
              <div
                key={`${venue.id}-${time}`}
                className='relative cursor-pointer rounded-xl bg-[#FFD6CC] p-2'
                style={{
                  height: `${span * 3}rem`,
                }}
                onClick={() => handleBookingClick(booking)}
                onMouseEnter={() => setHoveredBooking(booking)}
                onMouseLeave={() => setHoveredBooking(null)}
              >
                <div className='text-xs text-gray-800'>
                  <div className='font-medium'>{booking.eventName}</div>
                  <div>{booking.bookedBy.org.name}</div>
                  <div className='mt-1 text-[10px]'>
                    {`${format(booking.start, 'Ka')} - ${format(booking.end, 'Ka')}`}
                  </div>
                </div>
              </div>
            );

          return null;
        })}
      </div>
    </div>
  );
}
