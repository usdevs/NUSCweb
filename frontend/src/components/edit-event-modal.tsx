'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/base-modal';
import FormField from '@/components/form-field';
import {
  EVENT_ORGANIZATION_OPTIONS,
  EVENT_CATEGORY_NAMES,
  EVENT_VENUE_OPTIONS,
} from '@/lib/formOptions';

interface Event {
  id: number;
  eventName: string;
  organization: string;
  category: string;
  venue: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface EventFormData {
  id?: number;
  eventName: string;
  organization: string;
  category: string;
  venue: string;
  date?: Date;
  startTime: string;
  endTime: string;
}

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: EventFormData) => void;
  onDelete: (eventId: number) => void;
  event: Event | null;
}

export default function EditEventModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  event,
}: EditEventModalProps) {
  const [eventName, setEventName] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Update form when event changes
  useEffect(() => {
    if (event) {
      setEventName(event.eventName);
      setOrganization(event.organization);
      setCategory(event.category);
      setVenue(event.venue);
      setDate(event.date.toISOString());
      setStartTime(event.startTime);
      setEndTime(event.endTime);
    }
  }, [event]);

  const handleSubmit = () => {
    const eventData: EventFormData = {
      id: event?.id,
      eventName,
      organization,
      category,
      venue,
      date: new Date(date),
      startTime,
      endTime,
    };

    onSubmit(eventData);
  };

  const handleDelete = () => {
    if (event && event.id) {
      onDelete(event.id);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='EDIT EVENT'
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
        options={EVENT_ORGANIZATION_OPTIONS}
      />

      <FormField
        label='CATEGORY'
        type='select'
        value={category}
        onChange={(value) => setCategory(value as string)}
        options={EVENT_CATEGORY_NAMES}
      />

      <FormField
        label='VENUE'
        type='select'
        value={venue}
        onChange={(value) => setVenue(value as string)}
        options={EVENT_VENUE_OPTIONS}
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
    </BaseModal>
  );
}
