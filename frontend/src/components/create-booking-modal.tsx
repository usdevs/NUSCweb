'use client';

import { useState, useEffect } from 'react';
import BaseModal from '@/components/base-modal';
import FormField from '@/components/form-field';
import {
  BOOKING_VENUE_OPTIONS,
  BOOKING_ORGANIZATION_OPTIONS,
} from '@/lib/formOptions';

interface BookingFormData {
  eventName: string;
  organization: string;
  venue: string;
  date?: Date;
  startTime: string;
  endTime: string;
  addToCalendar: boolean;
}

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
  initialVenue?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  initialDate?: Date;
  showClashWarning?: boolean;
}

export default function CreateBookingModal({
  isOpen,
  onClose,
  onSubmit,
  initialVenue,
  initialStartTime,
  initialEndTime,
  initialDate,
}: CreateBookingModalProps) {
  const [eventName, setEventName] = useState('');
  const [organization, setOrganization] = useState('');
  const [venue, setVenue] = useState(BOOKING_VENUE_OPTIONS[0] || 'CTPH');
  const [date, setDate] = useState(new Date().toISOString());
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('03:00 PM');
  const [addToCalendar, setAddToCalendar] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEventName('');
      setOrganization('');
      setVenue(initialVenue || BOOKING_VENUE_OPTIONS[0] || 'CTPH');
      setDate(initialDate?.toISOString() || new Date().toISOString());
      setStartTime(initialStartTime || '10:00 AM');
      setEndTime(initialEndTime || '03:00 PM');
      setAddToCalendar(false);
    }
  }, [isOpen, initialVenue, initialStartTime, initialEndTime, initialDate]);

  const handleSubmit = () => {
    const bookingData: BookingFormData = {
      eventName,
      organization,
      venue,
      date: new Date(date),
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
        placeholder='10:00 AM'
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
