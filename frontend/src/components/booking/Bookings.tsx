'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { addHours } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import { Calendar } from '@/components/ui/calendar';
import VenuesTimetable from '@/components/venue/VenuesTimetable';
import {
  createBooking,
  deleteBooking,
  editBooking,
} from '@/lib/actions/booking';
import { useAuth } from '@/lib/hooks/useAuth';
import { NewBookingClientSchema } from '@/lib/schema/booking';
import { getNext30Minutes } from '@/lib/utils/client/time';
import type { BookingView } from '@/lib/utils/server/booking';
import type { VenueView } from '@/lib/utils/server/venue';

import BookingModal from './BookingModal';

interface BookingsProp {
  bookings: BookingView[];
  venues: VenueView[];
  userOrgs: {
    id: number;
    name: string;
  }[];
}

const today = getNext30Minutes();

export default function Bookings({ bookings, venues, userOrgs }: BookingsProp) {
  const isAuthenticated = useAuth();
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

  const isModalOpen = selectedBooking !== null || selectedTimeRange !== null;

  const [createBookingState, createBookingAction, createBookingPending] =
    useActionState(createBooking, null);
  const [editBookingState, editBookingAction, editBookingPending] =
    useActionState(editBooking, null);
  const [deleteBookingState, deleteBookingAction, deleteBookingPending] =
    useActionState(deleteBooking, null);

  const form = useForm<z.input<typeof NewBookingClientSchema>>({
    resolver: standardSchemaResolver(NewBookingClientSchema),
    defaultValues: {
      eventName: '',
      organizationId: 0,
      venueId: 0,
      startTime: today,
      endTime: addHours(today, 2),
      addToCalendar: false,
    },
  });

  // Check against existing bookings
  const hasClash = (
    formData: z.input<typeof NewBookingClientSchema> & { id?: number },
  ) =>
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
        booking.start <= formData.endTime && formData.startTime <= booking.end
      );
    });

  const handleCreateSubmit = (
    formData: z.input<typeof NewBookingClientSchema>,
  ) => {
    if (hasClash(formData)) {
      toast.warning(
        'There is a clash in bookings. Please select a different venu or timing, and resubmit.',
      );
      return;
    }

    const newBooking = new FormData();
    newBooking.set('eventName', formData.eventName);
    newBooking.set('organizationId', formData.organizationId.toString());
    newBooking.set('venueId', formData.venueId.toString());
    newBooking.set('startTime', formData.startTime.toISOString());
    newBooking.set('endTime', formData.endTime.toISOString());
    newBooking.set('addToCalendar', formData.addToCalendar.toString());

    createBookingAction(newBooking);
    setSelectedTimeRange(null);
  };

  const handleEditSubmit = (
    formData: z.input<typeof NewBookingClientSchema>,
  ) => {
    if (!selectedBooking) return;

    if (hasClash({ ...formData, id: selectedBooking.id })) {
      toast.warning(
        'There is a clash in bookings. Please select a different venu or timing, and resubmit.',
      );
      return;
    }

    const editBooking = new FormData();
    editBooking.set('id', selectedBooking.id.toString());
    editBooking.set('eventName', formData.eventName);
    editBooking.set('organizationId', formData.organizationId.toString());
    editBooking.set('venueId', formData.venueId.toString());
    editBooking.set('startTime', formData.startTime.toISOString());
    editBooking.set('endTime', formData.endTime.toISOString());
    editBooking.set('addToCalendar', formData.addToCalendar.toString());

    editBookingAction(editBooking);

    setSelectedBooking(null);
  };

  const handleSubmit = (formData: z.input<typeof NewBookingClientSchema>) => {
    if (!isAuthenticated) {
      toast.error(
        selectedBooking === null
          ? 'Please login to make a booking!'
          : 'Please login to edit bookings!',
      );
      return;
    }
    const handle =
      selectedBooking === null ? handleCreateSubmit : handleEditSubmit;
    handle(formData);
  };

  const handleDeleteBooking = (bookingId: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to delete bookings!');
      return;
    }

    const deleteBooking = new FormData();
    deleteBooking.set('id', bookingId.toString());
    deleteBookingAction(deleteBooking);
    setSelectedBooking(null);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setSelectedTimeRange(null);

    form.reset({
      eventName: '',
      organizationId: 0,
      venueId: 0,
      startTime: today,
      endTime: addHours(today, 2),
      addToCalendar: false,
    });
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
    <div className={`flex flex-col bg-[#0C2C47] lg:flex-row`}>
      {/* Calendar - Hidden on mobile */}
      {/* TODO: How do mobile people select dates? */}
      <div className={`hidden w-72 rounded-lg bg-white p-4 lg:block`}>
        <Calendar
          mode='single'
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              const params = new URLSearchParams(searchParams.toString());
              params.set('date', newDate.toDateString());
              window.history.pushState(null, '', `?${params.toString()}`);
            }
          }}
          className='w-full rounded-md'
          showOutsideDays={false}
        />
      </div>

      <VenuesTimetable
        bookings={bookings}
        venues={venues}
        date={date}
        handleBookingClick={(booking) => {
          setSelectedBooking(booking);
          form.setValue('eventName', booking.eventName);
          form.setValue('organizationId', booking.bookedForOrg.id);
          form.setValue('venueId', booking.venue.id);
          form.setValue('startTime', booking.start);
          form.setValue('endTime', booking.end);
          form.setValue('addToCalendar', booking.event !== null);
        }}
        setSelectedTimeRange={setSelectedTimeRange}
        form={form}
      />

      {/* Create Booking Modal */}
      <BookingModal
        venues={venues}
        userOrgs={userOrgs}
        handleDeleteBooking={handleDeleteBooking}
        handleSubmitBooking={handleSubmit}
        isOpen={isModalOpen}
        form={form}
        selectedBooking={selectedBooking}
        handleClose={handleCloseModal}
      />
    </div>
  );
}
