'use client'

import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/base-modal';
import FormField from '@/components/form-field';
import {
  BOOKING_VENUE_OPTIONS,
  BOOKING_ORGANIZATION_OPTIONS
} from '@/lib/formOptions';

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

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
  onDelete: (bookingId: number) => void;
  booking: Booking | null;
  showClashWarning?: boolean;
}

export default function EditBookingModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete,
  booking,
  showClashWarning = false
}: EditBookingModalProps) {
  const [eventName, setEventName] = useState('');
  const [organization, setOrganization] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [addToCalendar, setAddToCalendar] = useState(false);

  // Update form when booking changes
  useEffect(() => {
    if (booking) {
      setEventName(booking.eventName);
      setOrganization(booking.organization);
      setVenue(booking.venue);
      setDate(booking.date.toISOString());
      setStartTime(booking.startTime);
      setEndTime(booking.endTime);
    }
  }, [booking]);

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
        addToCalendar
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
      title="EDIT BOOKING"
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      submitLabel="SUBMIT"
      cancelLabel="CANCEL"
      showDeleteButton={true}
    >
      <FormField
        label="EVENT NAME"
        type="text"
        value={eventName}
        onChange={(value) => setEventName(value as string)}
      />

      <FormField
        label="ORGANISATION"
        type="select"
        value={organization}
        onChange={(value) => setOrganization(value as string)}
        options={BOOKING_ORGANIZATION_OPTIONS}
      />

      <FormField
        label="VENUE"
        type="select"
        value={venue}
        onChange={(value) => setVenue(value as string)}
        options={BOOKING_VENUE_OPTIONS}
      />

      <FormField
        label="DATE"
        type="date"
        value={date}
        onChange={(value) => setDate(value as string)}
      />

      <FormField
        label="START TIME"
        type="time"
        value={startTime}
        onChange={(value) => setStartTime(value as string)}
      />

      <FormField
        label="END TIME"
        type="time"
        value={endTime}
        onChange={(value) => setEndTime(value as string)}
      />

      <FormField
        label="ADD TO EVENTS CALENDAR"
        type="checkbox"
        value={addToCalendar}
        onChange={(value) => setAddToCalendar(value as boolean)}
      />
    </BaseModal>
  );
}
