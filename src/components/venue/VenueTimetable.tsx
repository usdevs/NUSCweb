'use client';

import { format } from 'date-fns';
import type { Dispatch, SetStateAction } from 'react';

import { TIMETABLE_TIMESLOTS } from '@/lib/formOptions';
import {
  dateToHalfHourIndex,
  getTimeSpanInHalfHours,
  timeToIndex,
} from '@/lib/utils/client';
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

    // Find a booking that overlaps with this 30-minute slot
    return bookings.find((booking) => {
      const startIndex = dateToHalfHourIndex(booking.start);
      let endIndex = dateToHalfHourIndex(booking.end);
      // Account for bookings ending at midnight
      if (endIndex === 0) endIndex = 48;
      return timeIndex >= startIndex && timeIndex < endIndex;
    });
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
          const booking = getCellBooking(time);

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
                className={`relative h-6 cursor-cell p-1 ${isSelected ? `bg-blue-200` : `bg-white`}`}
                onMouseDown={() => handleMouseDown(time.toUpperCase())}
                onMouseMove={() => handleMouseMove(time.toUpperCase())}
              />
            );

          const bookingStartTime = format(booking.start, 'p')
            .toLowerCase()
            .replace(/\s/g, '');
          const normalizedTime = time.toLowerCase().replace(/\s/g, '');
          const isFirstCell = bookingStartTime === normalizedTime;

          const getSpan = () => {
            if (!booking || !isFirstCell) return 1;
            return getTimeSpanInHalfHours(booking.start, booking.end);
          };

          const span = getSpan();

          if (isFirstCell)
            return (
              <div
                key={`${venue.id}-${time}`}
                className='relative cursor-pointer rounded-xl bg-[#FFD6CC] p-2'
                style={{
                  height: `${span * 1.5}rem`,
                }}
                onClick={() => handleBookingClick(booking)}
                onMouseEnter={() => setHoveredBooking(booking)}
                onMouseLeave={() => setHoveredBooking(null)}
              >
                <div className='text-xs text-gray-800'>
                  <div className='font-medium'>{booking.bookingName}</div>
                  <div>{booking.bookedForOrg.name}</div>
                  <div className='mt-1 text-[10px]'>
                    {`${format(booking.start, 'p')} - ${format(booking.end, 'h:mma')}`}
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
