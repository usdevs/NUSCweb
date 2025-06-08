'use client'

import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/base-modal';
import FormField from '@/components/form-field';
import {
  EVENT_ORGANIZATION_OPTIONS,
  EVENT_CATEGORY_NAMES,
  EVENT_VENUE_OPTIONS
} from '@/lib/formOptions';

interface EventFormData {
  eventName: string;
  organization: string;
  category: string;
  venue: string;
  date?: Date;
  startTime: string;
  endTime: string;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: EventFormData) => void;
  initialDate?: Date | null;
}

export default function CreateEventModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialDate
}: CreateEventModalProps) {
  const [eventName, setEventName] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

// Reset form when modal opens and handle initial date
useEffect(() => {
  if (isOpen) {
    setEventName('');
    setOrganization('');
    setCategory('');
    setVenue('');
    setStartTime('');
    setEndTime('');
    
    // Use initialDate if provided, otherwise use current date
    if (initialDate) {
      // Format date for HTML date input (YYYY-MM-DD) using local timezone
      const year = initialDate.getFullYear();
      const month = String(initialDate.getMonth() + 1).padStart(2, '0');
      const day = String(initialDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate);
    } else {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate);
    }
  }
}, [isOpen, initialDate]);

  const handleSubmit = () => {
    const eventData: EventFormData = {
      eventName,
      organization,
      category,
      venue,
      date: new Date(date),
      startTime,
      endTime
    };
    
    onSubmit(eventData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="CREATE A NEW EVENT"
      onSubmit={handleSubmit}
      submitLabel="SUBMIT"
      cancelLabel="CANCEL"
    >
      <FormField
        label="EVENT NAME"
        type="text"
        value={eventName}
        onChange={(value) => setEventName(value as string)}
        placeholder="Enter event name"
      />

      <FormField
        label="ORGANISATION"
        type="select"
        value={organization}
        onChange={(value) => setOrganization(value as string)}
        options={EVENT_ORGANIZATION_OPTIONS}
      />

      <FormField
        label="CATEGORY"
        type="select"
        value={category}
        onChange={(value) => setCategory(value as string)}
        options={EVENT_CATEGORY_NAMES}
      />

      <FormField
        label="VENUE"
        type="select"
        value={venue}
        onChange={(value) => setVenue(value as string)}
        options={EVENT_VENUE_OPTIONS}
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
        placeholder="07:30 PM"
      />

      <FormField
        label="END TIME"
        type="time"
        value={endTime}
        onChange={(value) => setEndTime(value as string)}
        placeholder="09:30 PM"
      />
    </BaseModal>
  );
}
