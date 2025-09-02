'use client';

import { useState } from 'react';
import BaseModal from '@/components/base-modal';
import FormField from '@/components/form-field';
import {
  BOOKING_ORGANIZATION_OPTIONS,
  BOOKING_VENUE_OPTIONS,
} from '@/lib/formOptions';
import { BookingFormData } from './booking/component';
import type { VenueView } from '@/lib/utils/venues';

interface CreateBookingModalProps {
  venues: VenueView[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
  initialTimeRange: {
    venue: VenueView;
    startTime: Date;
    endTime: Date;
  } | null;
}

export default function CreateBookingModal({
  venues,
  isOpen,
  onClose,
  onSubmit,
  initialTimeRange,
}: CreateBookingModalProps) {
  const [eventName, setEventName] = useState('');
  const [organizationId, setOrganizationId] = useState(0);
  const [venue, setVenue] = useState(initialTimeRange?.venue || null);
  const [startTime, setStartTime] = useState(
    initialTimeRange?.startTime || new Date(),
  );
  const [endTime, setEndTime] = useState(() => {
    if (initialTimeRange) return initialTimeRange.endTime;
    const in2Hours = new Date();
    in2Hours.setHours(in2Hours.getHours() + 2);
    return in2Hours;
  });
  const [addToCalendar, setAddToCalendar] = useState(false);

  const handleSubmit = () => {
    if (!venue || !startTime || !endTime) {
      return;
    }

    const bookingData: BookingFormData = {
      eventName,
      organizationId,
      venueId: venue.id,
      startTime,
      endTime,
      addToCalendar,
    };

    onSubmit(bookingData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='CREATE A NEW BOOKING'
      onSubmit={handleSubmit}
      submitLabel='SUBMIT'
      cancelLabel='CANCEL'
      showDeleteButton={false}
      onDelete={() => {
        /* Handle delete if needed */
      }}
    >
      <FormField
        label='EVENT NAME'
        type='text'
        value={eventName}
        onChange={(value) => setEventName(value as string)}
        placeholder='Enter event name'
      />

      <FormField
        label='ORGANISATION'
        type='select'
        value={organizationId}
        onChange={(value) => setOrganizationId(value)}
        options={BOOKING_ORGANIZATION_OPTIONS}
      />

      <FormField
        label='VENUE'
        type='select'
        value={venue}
        onChange={(value) =>
          setVenue(venues.find(({ name }) => name === value)!)
        }
        options={BOOKING_VENUE_OPTIONS}
      />

      <FormField
        label='START DATE'
        type='time'
        value={startTime}
        onChange={(value) => setDate(value as string)}
      />

      <FormField
        label='START TIME'
        type='time'
        value={startTime}
        onChange={(value) => setStartTime(value as string)}
        placeholder='10:00 AM'
      />

      <FormField
        label='END DATE'
        type='date'
        value={new Date()}
        onChange={(value) => setDate(value as string)}
      />

      <FormField
        label='END TIME'
        type='time'
        value={endTime}
        onChange={(value) => setEndTime(value as string)}
        placeholder='03:00 PM'
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
