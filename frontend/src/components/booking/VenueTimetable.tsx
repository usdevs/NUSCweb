'use client';

import { TIMETABLE_TIMESLOTS } from '@/lib/formOptions';
import { timeToIndex } from '@/lib/utils';
import { dateTo12Hour } from '@/lib/utils/time';
import type { BookingView } from '@/lib/utils/bookings';
import type { VenueView } from '@/lib/utils/venues';
import { isSameDay } from 'date-fns';
import { Dispatch, Fragment, SetStateAction } from 'react';
import type { DragPosition } from './component';

interface VenueTimetableProps {
  venue: VenueView;
  bookings: BookingView[];

  // TODO: Check if this should be passed as props
  dragStart: DragPosition | null;
  setDragStart: Dispatch<SetStateAction<DragPosition | null>>;
  dragEnd: DragPosition | null;
  setDragEnd: Dispatch<SetStateAction<DragPosition | null>>;
  date: Date;
  handleBookingClick: (booking: BookingView) => void;
  setHoveredBooking: Dispatch<SetStateAction<BookingView | null>>;
}

export default function VenueTimetable({
  venue,
  bookings,
  // TODO: Check if the following should be passed as props
  dragStart,
  setDragStart,
  dragEnd,
  setDragEnd,
  date,
  handleBookingClick,
  setHoveredBooking,
}: VenueTimetableProps) {
  const getCellBooking = (time: string, venueId: number) => {
    const timeIndex = timeToIndex(time);

    // Find a booking that:
    // 1. Matches the room
    // 2. Is on the current selected date
    // 3. The time falls within the booking's start and end times
    return bookings.find(
      (booking) =>
        booking.venue.id === venueId &&
        isSameDay(booking.start, date || new Date()) &&
        timeIndex >= booking.start.getHours() &&
        timeIndex < booking.end.getHours(),
    );
  };

  const handleMouseDown = (time: string, venue: VenueView) => {
    if (!getCellBooking(time, venue.id)) {
      setDragStart({ time, venue });
      setDragEnd({ time, venue });
    }
  };

  const handleMouseMove = (time: string, venue: VenueView) => {
    if (dragStart && dragStart.venue.id === venue.id) {
      setDragEnd({ time, venue });
    }
  };

  return (
    <div className='min-w-[200px] flex-1 overflow-hidden rounded-lg'>
      {/* Room header */}
      <div className='flex h-14 items-center justify-center whitespace-normal rounded-tl-3xl rounded-tr-3xl border-b bg-white p-2 text-center text-sm font-medium text-[#0C2C47]'>
        {venue.name}
      </div>

      {/* Time cells */}
      <div className='divide-y bg-white'>
        {TIMETABLE_TIMESLOTS.map((time) => {
          // Find if there's a booking for this time and room
          const booking = bookings.find(
            (booking) =>
              booking.venue.id === venue.id &&
              isSameDay(booking.start, date || new Date()) &&
              timeToIndex(time) >= booking.start.getHours() &&
              timeToIndex(time) < booking.end.getHours(),
          );

          // Check if this is the first cell of a booking
          const isFirstCell = booking && dateTo12Hour(booking.start) === time;

          // Calculate span for booking
          // TODO: Test for events spanning from day 1, 11pm to day 2, 1am
          const getSpan = () => {
            if (!booking || !isFirstCell) return 1;
            const startIndex = booking.start.getHours();
            const endIndex = booking.end.getHours();
            return endIndex - startIndex;
          };

          const span = getSpan();

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

          return (
            <Fragment key={`${venue.id}-${time}`}>
              {booking && isFirstCell ? (
                <div
                  className='relative cursor-pointer rounded-xl p-2'
                  style={{
                    backgroundColor: '#FFD6CC',
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
                      {dateTo12Hour(booking.start)} -{' '}
                      {dateTo12Hour(booking.end)}
                    </div>
                  </div>
                </div>
              ) : !booking ? (
                <div
                  className={`relative h-12 cursor-cell p-2 ${isSelected ? 'bg-blue-200' : 'bg-white'}`}
                  onMouseDown={() => handleMouseDown(time, venue)}
                  onMouseMove={() => handleMouseMove(time, venue)}
                ></div>
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
