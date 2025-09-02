'use client';

import { useState } from 'react';
import BaseModal from '@/components/base-modal';
import FormField from '@/components/form-field';
import {
  BOOKING_VENUE_OPTIONS,
  BOOKING_ORGANIZATION_OPTIONS,
} from '@/lib/formOptions';
import type { BookingView } from '@/lib/utils/bookings';

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

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
  onDelete: (bookingId: number) => void;
  booking: BookingView | null;
  showClashWarning?: boolean;
}

export default function EditBookingModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  booking,
  showClashWarning = false,
}: EditBookingModalProps) {
  const [eventName, setEventName] = useState(booking?.eventName || '');
  const [organization, setOrganization] = useState(
    booking?.bookedBy.org.name || '',
  );
  const [venue, setVenue] = useState(booking?.venue.name || '');
  const [date, setDate] = useState(booking?.start.toISOString());
  const [startTime, setStartTime] = useState(booking?.start);
  const [endTime, setEndTime] = useState(booking?.end);
  const [addToCalendar, setAddToCalendar] = useState(false);

  const handleSubmit = () => {
    // If no clashes, submit the booking
    if (!showClashWarning) {
      const bookingData: BookingFormData = {
        id: booking?.id,
        eventName,
        organization,
        venue,
        date: new Date(date),
        startTime,
        endTime,
        addToCalendar,
      };

      onSubmit(bookingData);
    }
  };

  const handleDelete = () => {
    if (booking && booking.id) {
      onDelete(booking.id);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='EDIT BOOKING'
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      submitLabel='SUBMIT'
      cancelLabel='CANCEL'
      showDeleteButton={true}
    >
      <FormField
        label='EVENT NAME'
        type='text'
        value={eventName}
        onChange={(value) => setEventName(value as string)}
      />

      <FormField
        label='ORGANISATION'
        type='select'
        value={organization}
        onChange={(value) => setOrganization(value as string)}
        options={BOOKING_ORGANIZATION_OPTIONS}
      />

      <FormField
        label='VENUE'
        type='select'
        value={venue}
        onChange={(value) => setVenue(value as string)}
        options={BOOKING_VENUE_OPTIONS}
      />

      <FormField
        label='DATE'
        type='date'
        value={date}
        onChange={(value) => setDate(value as string)}
      />

      <FormField
        label='START TIME'
        type='time'
        value={startTime}
        onChange={(value) => setStartTime(value as string)}
      />

      <FormField
        label='END TIME'
        type='time'
        value={endTime}
        onChange={(value) => setEndTime(value as string)}
      />

      <FormField
        label='ADD TO EVENTS CALENDAR'
        type='checkbox'
        value={addToCalendar}
        onChange={(value) => setAddToCalendar(value as boolean)}
      />
    </BaseModal>
  );
}
