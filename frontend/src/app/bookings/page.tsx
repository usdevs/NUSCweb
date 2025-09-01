'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import CreateBookingModal from '@/components/create-booking-modal';
import EditBookingModal from '@/components/edit-booking-modal';
import Header from '@/components/header';
import EventCard from '@/components/event-card';
import { format, isSameDay } from 'date-fns';
import CardPortal from '@/components/card-portal';
import Footer from '@/components/footer';
import { timeToIndex } from '@/lib/utils';
import { BOOKING_VENUE_OPTIONS, TIMETABLE_TIMESLOTS } from '@/lib/formOptions';

interface Booking {
  id: number;
  eventName: string;
  organization: string;
  venue: string;
  date: Date;
  startTime: string;
  endTime: string;
  color: string;
}

interface BookingFormData {
  id?: number;
  eventName: string;
  organization: string;
  venue: string;
  date?: Date;
  startTime: string;
  endTime: string;
  addToCalendar: boolean;
}

interface DragPosition {
  time: string;
  room: string;
}

const formatDate = (date: Date): string => {
  return format(date, 'd MMMM');
};

export default function BookingsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showClashWarning, setShowClashWarning] = useState(false);
  const [dragStart, setDragStart] = useState<DragPosition | null>(null);
  const [dragEnd, setDragEnd] = useState<DragPosition | null>(null);
  const [hoveredBooking, setHoveredBooking] = useState<Booking | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    venue: string;
    startTime: string;
    endTime: string;
    date?: Date;
  } | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      eventName: 'AY 24/25 Sem 2 Mass Check-in',
      organization: 'Admin Team',
      venue: 'Chatterbox',
      date: new Date(2025, 2, 27),
      startTime: '12AM',
      endTime: '4PM',
      color: '#FFD6CC',
    },
    {
      id: 2,
      eventName: 'ICG Training',
      organization: 'NUSC Floorball',
      venue: 'CTPH',
      date: new Date(2025, 2, 27),
      startTime: '4PM',
      endTime: '6PM',
      color: '#FFD6CC',
    },
  ]);

  const rooms = BOOKING_VENUE_OPTIONS;

  const timeSlots = TIMETABLE_TIMESLOTS;

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const checkForClash = (formData: BookingFormData): boolean => {
    const newStartIndex = timeToIndex(formData.startTime);
    const newEndIndex = timeToIndex(formData.endTime);
    const newDate = formData.date;
    const newVenue = formData.venue;

    // Check against existing bookings
    return bookings.some((booking) => {
      // Skip if not the same venue or date
      if (
        booking.venue !== newVenue ||
        !isSameDay(booking.date, newDate || new Date())
      ) {
        return false;
      }

      if (formData.id && booking.id === formData.id) {
        return false;
      }

      // Check for time overlap
      const existingStartIndex = timeToIndex(booking.startTime);
      const existingEndIndex = timeToIndex(booking.endTime);

      // Two bookings clash if:
      // - New booking starts during existing booking
      // - New booking ends during existing booking
      // - New booking completely contains existing booking
      return (
        (newStartIndex >= existingStartIndex &&
          newStartIndex < existingEndIndex) ||
        (newEndIndex > existingStartIndex && newEndIndex <= existingEndIndex) ||
        (newStartIndex <= existingStartIndex && newEndIndex >= existingEndIndex)
      );
    });
  };

  const handleCreateSubmit = (formData: BookingFormData) => {
    // Check for booking clashes
    const hasClash = checkForClash(formData);

    if (hasClash) {
      setShowClashWarning(true);
      return;
    }

    // Reset clash warning if no clash
    setShowClashWarning(false);

    // Create new booking
    const newBooking: Booking = {
      id: Math.max(0, ...bookings.map((b) => b.id)) + 1,
      eventName: formData.eventName,
      organization: formData.organization,
      venue: formData.venue,
      date: formData.date || new Date(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      color: '#FFD6CC',
    };
    setBookings([...bookings, newBooking]);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (formData: BookingFormData) => {
    if (!formData.id) return;

    const hasClash = checkForClash(formData);

    if (hasClash) {
      setShowClashWarning(true);
      return;
    }

    // Reset clash warning if no clash
    setShowClashWarning(false);

    // Update the booking in the array
    setBookings(
      bookings.map((booking) =>
        booking.id === formData.id
          ? {
              ...booking,
              eventName: formData.eventName,
              organization: formData.organization,
              venue: formData.venue,
              date: formData.date || new Date(),
              startTime: formData.startTime,
              endTime: formData.endTime,
            }
          : booking,
      ),
    );

    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };

  const getCellBooking = (time: string, room: string) => {
    const timeIndex = timeToIndex(time);
    console.log('ASDF', 'running this');

    // Find a booking that:
    // 1. Matches the room
    // 2. Is on the current selected date
    // 3. The time falls within the booking's start and end times
    return bookings.find((booking) => {
      const a =
        booking.venue === room &&
        isSameDay(booking.date, date || new Date()) &&
        timeIndex >= timeToIndex(booking.startTime) &&
        timeIndex < timeToIndex(booking.endTime);
      console.log('asdf', booking, a);
      return a;
    });
  };

  const handleMouseDown = (time: string, room: string) => {
    if (!getCellBooking(time, room)) {
      setDragStart({ time, room });
      setDragEnd({ time, room });
    }
  };

  const handleMouseMove = (time: string, room: string) => {
    if (dragStart && dragStart.room === room) {
      setDragEnd({ time, room });
    }
  };

  const handleMouseUp = () => {
    if (dragStart && dragEnd) {
      // Calculate start and end times from drag
      const startIndex = Math.min(
        timeToIndex(dragStart.time),
        timeToIndex(dragEnd.time),
      );
      const endIndex =
        Math.max(timeToIndex(dragStart.time), timeToIndex(dragEnd.time)) + 1;

      const startTime = timeSlots[startIndex];
      const endTime = timeSlots[endIndex];

      // Use the room from dragStart (column where user started dragging)
      const selectedVenue = dragStart.room;

      // Open create modal with selected time range and room
      setIsCreateModalOpen(true);

      // Store the selected range for the modal
      setSelectedTimeRange({
        venue: selectedVenue,
        startTime,
        endTime,
        date: date,
      });

      // Reset drag state
      setDragStart(null);
      setDragEnd(null);
    }
  };

  const handleDeleteBooking = (bookingId: number) => {
    // Filter out the booking with the matching ID
    setBookings(bookings.filter((booking) => booking.id !== bookingId));
    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setShowClashWarning(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setShowClashWarning(false);
    setSelectedBooking(null);
  };

  const renderRoomTimetable = (room: string) => {
    return (
      <div
        key={room}
        className='min-w-[200px] flex-1 overflow-hidden rounded-lg'
      >
        {/* Room header */}
        <div className='flex h-14 items-center justify-center whitespace-normal rounded-tl-3xl rounded-tr-3xl border-b bg-white p-2 text-center text-sm font-medium text-[#0C2C47]'>
          {room}
        </div>

        {/* Time cells */}
        <div className='divide-y bg-white'>
          {timeSlots.map((time) => {
            // Find if there's a booking for this time and room
            const booking = bookings.find(
              (b) =>
                b.venue === room &&
                isSameDay(b.date, date || new Date()) &&
                timeToIndex(time) >= timeToIndex(b.startTime) &&
                timeToIndex(time) < timeToIndex(b.endTime),
            );

            // Check if this is the first cell of a booking
            const isFirstCell = booking && booking.startTime === time;

            // Calculate span for booking
            const getSpan = () => {
              if (!booking || !isFirstCell) return 1;
              const startIndex = timeToIndex(booking.startTime);
              const endIndex = timeToIndex(booking.endTime);
              return endIndex - startIndex;
            };

            const span = getSpan();

            // Check if this cell is in drag selection
            const isSelected =
              dragStart &&
              dragEnd &&
              dragStart.room === room &&
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
              <React.Fragment key={`${room}-${time}`}>
                {booking && isFirstCell ? (
                  <div
                    className='relative cursor-pointer rounded-xl p-2'
                    style={{
                      backgroundColor: booking.color,
                      height: `${span * 3}rem`,
                    }}
                    onClick={() => handleBookingClick(booking)}
                    onMouseEnter={() => setHoveredBooking(booking)}
                    onMouseLeave={() => setHoveredBooking(null)}
                  >
                    <div className='text-xs text-gray-800'>
                      <div className='font-medium'>{booking.eventName}</div>
                      <div>{booking.organization}</div>
                      <div className='mt-1 text-[10px]'>
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                  </div>
                ) : !booking ? (
                  <div
                    className={`relative h-12 cursor-cell p-2 ${isSelected ? 'bg-blue-200' : 'bg-white'}`}
                    onMouseDown={() => handleMouseDown(time, room)}
                    onMouseMove={() => handleMouseMove(time, room)}
                  ></div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // Track mouse position for positioning the hover card
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <Header />

      {/* Warning */}
      {showClashWarning && (
        <div className='animate-fadeIn fixed inset-x-0 top-20 z-[9999] bg-[#FFE9E3] px-3 py-4 text-center text-sm font-medium text-[#FF7D4E] shadow-lg'>
          THERE IS A CLASH IN BOOKINGS. PLEASE SELECT A DIFFERENT VENUE OR
          TIMING & RESUBMIT.
        </div>
      )}

      <div className='flex flex-col bg-[#0C2C47] lg:flex-row'>
        {/* Calendar - Hidden on mobile */}
        <div className='hidden w-72 rounded-lg bg-white p-4 lg:block'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={(a) => {
              console.log(a);
              setDate(a);
            }}
            className='w-full rounded-md'
            showOutsideDays={false}
          />
        </div>

        {/* Timetable - Full width on mobile */}
        <div className='mt-10 flex-1 overflow-auto px-2 lg:ml-8 lg:px-0'>
          <div className='flex'>
            {/* Time labels column */}
            <div className='flex w-10 flex-col text-right lg:w-14'>
              <div className='h-8'></div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className='relative flex h-12 items-center justify-end pr-2 text-xs text-white lg:text-sm'
                >
                  {time}
                  {/* White connecting line */}
                  <div className='absolute right-0 top-1/2 h-px w-2 bg-white'></div>
                </div>
              ))}
            </div>

            {/* Scrollable container for room timetables */}
            <div className='flex-1 overflow-x-auto'>
              <div className='flex gap-[1]' onMouseUp={handleMouseUp}>
                {rooms.map((room) => renderRoomTimetable(room))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateSubmit}
        initialVenue={selectedTimeRange?.venue}
        initialStartTime={selectedTimeRange?.startTime}
        initialEndTime={selectedTimeRange?.endTime}
        initialDate={selectedTimeRange?.date}
        showClashWarning={showClashWarning}
      />

      {/* Edit Booking Modal */}
      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        onDelete={handleDeleteBooking}
        booking={selectedBooking}
        showClashWarning={showClashWarning}
      />

      {/* Hover card portal */}
      {hoveredBooking && (
        <CardPortal>
          <div
            style={{
              position: 'fixed',
              top: 'var(--mouse-y)',
              left: 'var(--mouse-x)',
              transform: 'translate(20px, -50%)',
            }}
          >
            <EventCard
              eventName={hoveredBooking.eventName}
              organization={hoveredBooking.organization}
              date={formatDate(hoveredBooking.date)}
              time={`${hoveredBooking.startTime} - ${hoveredBooking.endTime}`}
              venue={hoveredBooking.venue}
            />
          </div>
        </CardPortal>
      )}

      <div className='mt-auto'>
        <Footer />
      </div>
    </div>
  );
}
