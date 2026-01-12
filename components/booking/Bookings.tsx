'use client';

import 'moment-timezone';
import './react-big-calendar.css';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { addHours } from 'date-fns';
import moment from 'moment';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useActionState, useState } from 'react';
import {
  Calendar as ReactCalendar,
  momentLocalizer,
  SlotInfo,
} from 'react-big-calendar';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import BookingModal from '@/components/booking/BookingModal';
import { Calendar } from '@/components/ui/calendar';
import { Spinner } from '@/components/ui/spinner';
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

moment.tz.setDefault('Asia/Singapore');
moment.locale('en-sg', {
  week: {
    dow: 1,
    doy: 1,
  },
});
const localizer = momentLocalizer(moment);

interface BookingsProp {
  bookings: BookingView[];
  venues: VenueView[];
  userOrgs: {
    id: number;
    name: string;
  }[];
}

const today = getNext30Minutes();

export default function Bookings({
  bookings: bookingsOld,
  venues,
  userOrgs,
}: BookingsProp) {
  const isAuthenticated = useAuth();
  const searchParams = useSearchParams();

  const date = useMemo(() => {
    let date = new Date();
    try {
      const searchParamsDate = searchParams.get('date');
      if (searchParamsDate && !isNaN(Date.parse(searchParamsDate))) {
        date = new Date(searchParamsDate);
      }
    } catch {}
    return date;
  }, [searchParams]);

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
      bookingName: '',
      organisationId: 0,
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
        booking.start < formData.endTime && formData.startTime < booking.end
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

    if (formData.startTime > formData.endTime) {
      toast.warning('Start time cannot be later then end time!');
      return;
    }

    const newBooking = new FormData();
    newBooking.set('bookingName', formData.bookingName);
    newBooking.set('organisationId', formData.organisationId.toString());
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
    editBooking.set('bookingName', formData.bookingName);
    editBooking.set('organisationId', formData.organisationId.toString());
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
      bookingName: '',
      organisationId: 0,
      venueId: 0,
      startTime: today,
      endTime: addHours(today, 2),
      addToCalendar: false,
    });
  };

  const bookings = bookingsOld.map((booking) => ({
    ...booking,
    resourceId: booking.venue.id,
  }));

  const handleSelectSlot = useCallback(
    ({ start, end, resourceId }: SlotInfo) => {
      setSelectedTimeRange({
        // Use the room from dragStart (column where user started dragging)
        venue: venues.find(({ id }) => id === resourceId)!,
        startTime: start,
        endTime: end,
      });
      form.setValue('venueId', resourceId as number);
      form.setValue('startTime', start);
      form.setValue('endTime', end);
    },
    [],
  );

  return (
    <div className='relative flex flex-col bg-[#0C2C47] lg:flex-row'>
      {(createBookingPending || editBookingPending || deleteBookingPending) && (
        <div className='bg-opacity-60 absolute inset-0 z-50 flex items-center justify-center bg-white'>
          <div className='h-24 w-24'>
            <Spinner />
          </div>
        </div>
      )}
      {/* Calendar - Hidden on mobile */}
      {/* TODO: How do mobile people select dates? */}
      <div className='hidden w-72 rounded-lg bg-white p-4 lg:block'>
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
          className='sticky top-19 w-full rounded-md'
          showOutsideDays={false}
          ISOWeek
        />
      </div>

      <div className='mt-10 flex-1 overflow-auto px-2 lg:ml-4 lg:px-0'>
        <ReactCalendar
          selectable
          showMultiDayTimes
          toolbar={false}
          formats={{
            eventTimeRangeStartFormat: ({ start, end }, culture, localizer) =>
              localizer!.format(start, 'hh:mm a', culture) +
              ' - ' +
              localizer!.format(end, 'hh:mm a', culture),
            eventTimeRangeEndFormat: ({ start, end }, culture, localizer) =>
              localizer!.format(start, 'hh:mm a', culture) +
              ' - ' +
              localizer!.format(end, 'hh:mm a', culture),
          }}
          date={date}
          defaultView='day'
          views={['day']}
          localizer={localizer}
          events={bookings}
          titleAccessor={(event) =>
            `${event.bookingName}\n${event.bookedForOrg.name}`
          }
          tooltipAccessor={(event) =>
            `${event.bookingName}\n${event.bookedForOrg.name}`
          }
          resources={venues}
          resourceIdAccessor='id'
          resourceTitleAccessor='name'
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(booking) => {
            setSelectedBooking(booking);
            form.setValue('bookingName', booking.bookingName);
            form.setValue('organisationId', booking.bookedForOrg.id);
            form.setValue('venueId', booking.venue.id);
            form.setValue('startTime', booking.start);
            form.setValue('endTime', booking.end);
            form.setValue('addToCalendar', booking.event !== null);
          }}
          step={30}
        />
      </div>

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
        isPending={
          createBookingPending || editBookingPending || deleteBookingPending
        }
      />
    </div>
  );
}
