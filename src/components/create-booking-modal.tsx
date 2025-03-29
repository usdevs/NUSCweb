'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
  // initialTime
  initialStartTime,
  initialEndTime,
  initialDate,
}: CreateBookingModalProps) {
  const [eventName, setEventName] = useState('');
  const [organization, setOrganization] = useState('');
  const [venue, setVenue] = useState('CTPH');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('03:00 PM');
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEventName('');
      setOrganization('');
      setVenue(initialVenue || 'CTPH');
      setSelectedDate(initialDate || new Date());
      setStartTime(initialStartTime || '10:00 AM');
      setEndTime(initialEndTime || '03:00 PM');
      setAddToCalendar(false);
    }
  }, [isOpen, initialVenue, initialStartTime, initialEndTime, initialDate]);

  const venueOptions = [
    'CTPH',
    'Chatterbox',
    'RC1 Student Lounge (Buttery Common Area)',
    'RC1 Pantry (Buttery Cooking Area)',
    'RC2 Student Lounge (Buttery Common Area)',
    'RC2 Pantry (Buttery Cooking Area)'
  ];

  const organizationOptions = [
    'NUSC Floorball',
    'Admin Team',
    'Student Council',
    'Interest Group',
    'Others'
  ];

  // Format date for display in the input field (DD Month YYYY)
  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleSubmit = () => {
    const bookingData: BookingFormData = {
      eventName,
      organization,
      venue,
      date: selectedDate,
      startTime,
      endTime,
      addToCalendar
    };
    
    onSubmit(bookingData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div role="dialog" aria-modal="true" className="relative w-full max-w-md bg-white rounded-[20px] overflow-hidden shadow-lg">

          <VisuallyHidden>
            <h2 id="dialog-title">Create a new booking</h2>
          </VisuallyHidden>
          
          {/* Header */}
          <div className="bg-[#0C2C47] text-white p-4 px-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold">CREATE A NEW BOOKING</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Form content */}
          <div className="p-5">
            <div className="space-y-6">
              {/* Event Name */}
              <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
                <label htmlFor="event-name" className="text-left text-[13px] font-normal">
                  EVENT NAME
                </label>
                <input
                  id="event-name"
                  type="text"
                  className="flex h-6 w-full rounded-[5px] border border-input border-stone-400 bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                />
              </div>

              {/* Organization */}
              <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
                <label htmlFor="organization" className="text-left text-[13px] font-normal">
                  ORGANISATION
                </label>
                <div className="relative">
                  <select
                    id="organization"
                    className="flex h-6 w-full appearance-none rounded-[5px] border border-input border-stone-400 bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-500"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  >
                    <option value="" disabled>Select organization</option>
                    {organizationOptions.map((org) => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
                <label htmlFor="venue" className="text-left text-[13px] font-normal">
                  VENUE
                </label>
                <div className="relative">
                  <select
                    id="venue"
                    className="flex h-6 w-full appearance-none rounded-[5px] border border-input border-stone-400 bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  >
                    {venueOptions.map((venue) => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
                <label htmlFor="date" className="text-left text-[13px] font-normal">
                  DATE
                </label>
                <div className="flex items-center">
                  <input
                    id="date"
                    type="text"
                    className="flex h-6 w-8/12 rounded-[5px] border border-input border-stone-400 bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-500"
                    value={formatDateForDisplay(selectedDate)}
                    readOnly
                    placeholder="09 January 2025"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  />
                  <button
                    type="button"
                    className="ml-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </button>
                  {isCalendarOpen && (
                    <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg top-48 left-1/4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Start Time */}
              <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
                <label htmlFor="start-time" className="text-left text-[13px] font-normal">
                  START TIME
                </label>
                <div className="flex items-center">
                  <input
                    id="start-time"
                    type="text"
                    className="flex h-6 w-6/12 rounded-[5px] border border-input border-stone-400 bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-500"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="10:00 AM"
                  />
                  <button
                    type="button"
                    className="ml-2 text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </button>
                </div>
              </div>

              {/* End Time */}
              <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
                <label htmlFor="end-time" className="text-left text-[13px] font-normal">
                  END TIME
                </label>
                <div className="flex items-center">
                  <input
                    id="end-time"
                    type="text"
                    className="flex h-6 w-6/12 rounded-[5px] border border-input border-stone-400 bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-500"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="03:00 PM"
                  />
                  <button
                    type="button"
                    className="ml-2 text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add to Events Calendar */}
              <div className="flex items-center">
                <input
                  id="add-to-calendar"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={addToCalendar}
                  onChange={(e) => setAddToCalendar(e.target.checked)}
                />
                <label htmlFor="add-to-calendar" className="ml-2 block text-xs text-gray-700">
                  ADD TO EVENTS CALENDAR
                </label>
              </div>
            </div>
            
            <div className="flex justify-between pt-6">
              <Button 
                variant="destructive" 
                size="icon" 
                className="bg-[#FF7D4E] hover:bg-[#FF7D4E]/90 border-none rounded-[5px] text-white px-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </Button>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="border-gray-300 text-gray-700 rounded-[5px] text-xs h-8 px-4"
                >
                  CANCEL
                </Button>
                <Button 
                  className="bg-[#FF7D4E] hover:bg-[#FF7D4E]/90 text-white border-none rounded-[5px] text-xs h-8 px-4" 
                  onClick={handleSubmit}
                >
                  SUBMIT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}