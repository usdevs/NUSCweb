'use client';

import { format } from 'date-fns';
import { useState, useEffect, useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Calendar } from '@/components/ui/calendar';
import CreateBookingModal from '@/components/create-booking-modal';
import EditBookingModal from '@/components/edit-booking-modal';
import EventCard from '@/components/event-card';
import CardPortal from '@/components/card-portal';
import { timeToIndex } from '@/lib/utils';
import { TIMETABLE_TIMESLOTS } from '@/lib/formOptions';
import type { BookingView } from '@/lib/utils/bookings';
import {
  createBooking,
  deleteBooking,
  editBooking,
} from '@/lib/actions/booking';
import type { VenueView } from '@/lib/utils/venues';
import VenueTimetable from './VenueTimetable';

export interface BookingFormData {
  id?: number;
  eventName: string;
  organizationId: number;
  venueId: number;
  startTime: Date;
  endTime: Date;
  addToCalendar: boolean;
}

export interface DragPosition {
  time: string;
  venue: VenueView;
}

interface BookingsProp {
  bookings: BookingView[];
  venues: VenueView[];
}

const today = new Date();

export default function Bookings({ bookings, venues }: BookingsProp) {
  const searchParams = useSearchParams();

  let date = today;
  try {
    const searchParamsDate = searchParams.get('date');
    if (searchParamsDate && !isNaN(Date.parse(searchParamsDate))) {
      date = new Date(searchParamsDate);
    }
  } catch {}

  const [selectedBooking, setSelectedBooking] = useState<BookingView | null>(
    null,
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    venue: VenueView;
    startTime: Date;
    endTime: Date;
  } | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isEditModalOpen = selectedBooking !== null;

  const [showClashWarning, setShowClashWarning] = useState(false);

  const [dragStart, setDragStart] = useState<DragPosition | null>(null);
  const [dragEnd, setDragEnd] = useState<DragPosition | null>(null);

  const [hoveredBooking, setHoveredBooking] = useState<BookingView | null>(
    null,
  );

  const [createBookingState, createBookingAction, createBookingPending] =
    useActionState(createBooking, null);
  const [editBookingState, editBookingAction, editBookingPending] =
    useActionState(editBooking, null);

  // Check against existing bookings
  const hasClash = (formData: BookingFormData) =>
    bookings.some((booking) => {
      // Skip if not the same venue
      if (booking.venue.id !== formData.venueId) {
        return false;
      }

      // Skip if same booking
      if (formData.id === booking.id) {
        return false;
      }

      return (
        booking.start <= formData.endTime && formData.startTime <= booking.start
      );
    });

  const handleCreateSubmit = (formData: BookingFormData) => {
    if (hasClash(formData)) {
      setShowClashWarning(true);
      return;
    }

    const newBooking = new FormData();
    newBooking.set('eventName', formData.eventName);
    newBooking.set('organizationId', formData.organizationId.toString());
    newBooking.set('venueId', formData.venueId.toString());
    newBooking.set('startTime', formData.startTime.toISOString());
    newBooking.set('endTime', formData.endTime.toISOString());
    newBooking.set('addToCalendar', formData.addToCalendar.toString());
    // TODO: Handle if this fails
    createBookingAction(newBooking);

    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (formData: BookingFormData) => {
    if (!formData.id) return;

    if (hasClash(formData)) {
      setShowClashWarning(true);
      return;
    }

    const newBooking = new FormData();
    newBooking.set('id', formData.id.toString());
    newBooking.set('eventName', formData.eventName);
    newBooking.set('organizationId', formData.organizationId.toString());
    newBooking.set('venueId', formData.venueId.toString());
    newBooking.set('startTime', formData.startTime.toISOString());
    newBooking.set('endTime', formData.endTime.toISOString());
    newBooking.set('addToCalendar', formData.addToCalendar.toString());
    // TODO: Handle if this fails
    editBookingAction(newBooking);

    setSelectedBooking(null);
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

      const startTime = new Date(date);
      startTime.setHours(startIndex);

      const endTime = new Date(date);
      endTime.setHours(endIndex);

      setSelectedTimeRange({
        // Use the room from dragStart (column where user started dragging)
        venue: dragStart.venue,
        startTime,
        endTime,
      });

      // Open create modal with selected time range and room
      setIsCreateModalOpen(true);

      // Reset drag state
      setDragStart(null);
      setDragEnd(null);
    }
  };

  const handleDeleteBooking = (bookingId: number) => {
    // TODO: Handle if this errors
    deleteBooking(bookingId);
    setSelectedBooking(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setShowClashWarning(false);
  };

  const handleCloseEditModal = () => {
    setShowClashWarning(false);
    setSelectedBooking(null);
  };

  // Track mouse position for positioning the hover card
  useEffect(() => {
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
    <>
      {/* Warning */}
      {showClashWarning && (
        <div className='animate-fadeIn fixed inset-x-0 top-20 z-[9999] bg-[#FFE9E3] px-3 py-4 text-center text-sm font-medium text-[#FF7D4E] shadow-lg'>
          THERE IS A CLASH IN BOOKINGS. PLEASE SELECT A DIFFERENT VENUE OR
          TIMING & RESUBMIT.
        </div>
      )}

      <div className='flex flex-col bg-[#0C2C47] lg:flex-row'>
        {/* TODO: How do mobile people select dates? */}
        {/* Calendar - Hidden on mobile */}
        <div className='hidden w-72 rounded-lg bg-white p-4 lg:block'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={(newDate) => {
              const params = new URLSearchParams(searchParams.toString());
              // TODO: Remove newDate!.toString()
              params.set('date', newDate!.toDateString());
              window.history.pushState(null, '', `?${params.toString()}`);
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
              {TIMETABLE_TIMESLOTS.map((time) => (
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
                {/* TODO: Currently not really index */}
                {venues.map((venue) => (
                  <VenueTimetable
                    key={venue.id}
                    // TODO: Update below
                    venue={venue}
                    bookings={bookings}
                    dragStart={dragStart}
                    dragEnd={dragEnd}
                    date={date}
                    handleBookingClick={setSelectedBooking}
                    setHoveredBooking={setHoveredBooking}
                    setDragStart={setDragStart}
                    setDragEnd={setDragEnd}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      <CreateBookingModal
        venues={venues}
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateSubmit}
        initialTimeRange={selectedTimeRange}
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
              organization={hoveredBooking.bookedBy.org.name}
              date={format(hoveredBooking.start, 'd MMMM')}
              time={`${hoveredBooking.start} - ${hoveredBooking.end}`}
              venue={hoveredBooking.venue.name}
            />
          </div>
        </CardPortal>
      )}
    </>
  );
}
