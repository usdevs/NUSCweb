'use client'

import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import CreateBookingModal from '@/components/create-booking-modal';
import EditBookingModal from '@/components/edit-booking-modal';
import Header from '@/components/header';
import EventCard from '@/components/event-card';
import { format } from 'date-fns';
import CardPortal from '@/components/card-portal';
import Footer from '@/components/footer';

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

interface DragPosition {
  time: string;
  room: string;
}

const timeToIndex = (time: string): number => {
  if (time === '12AM') return 0;
  if (time === '12PM') return 12;
  
  const match = time.match(/^(\d+)(AM|PM)$/);
  if (!match) return 0;
  
  const hour = parseInt(match[1]);
  const isPM = match[2] === 'PM';
  
  if (isPM && hour !== 12) {
    return hour + 12;
  } else if (!isPM && hour === 12) {
    return 0;
  } else {
    return hour;
  }
};

const formatDate = (date: Date): string => {
  return format(date, 'd MMMM');
};

export default function BookingsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showClashWarning, setShowClashWarning] = useState(false);
  const [dragStart, setDragStart] = useState<DragPosition | null>(null);
  const [dragEnd, setDragEnd] = useState<DragPosition | null>(null);
  const [hoveredBooking, setHoveredBooking] = useState<Booking | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    venue: string;
    startTime: string;
    endTime: string;
    date?: Date;
  } | null>(null);
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      eventName: 'AY 24/25 Sem 2 Mass Check-in',
      organization: 'Admin Team',
      venue: 'Chatterbox',
      date: new Date(2025, 2, 27),
      startTime: '12AM',
      endTime: '4PM',
      color: '#FFD6CC'
    },
    {
      id: 2,
      eventName: 'ICG Training',
      organization: 'NUSC Floorball',
      venue: 'CTPH',
      date: new Date(2025, 2, 27),
      startTime: '4PM',
      endTime: '6PM',
      color: '#FFD6CC'
    }
  ]);
  
  const rooms = [
    'CTPH',
    'Chatterbox',
    'RC1 Student Lounge (Buttery Common Area)',
    'RC1 Pantry (Buttery Cooking Area)',
    'RC2 Student Lounge (Buttery Common Area)',
    'RC2 Pantry (Buttery Cooking Area)'
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    if (hour === 0) return '12AM';
    if (hour === 12) return '12PM';
    return `${hour % 12}${hour < 12 ? 'AM' : 'PM'}`;
  });

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const checkForClash = (formData: BookingFormData): boolean => {
    const newStartIndex = timeToIndex(formData.startTime);
    const newEndIndex = timeToIndex(formData.endTime);
    const newDate = formData.date;
    const newVenue = formData.venue;
    
    // Check against existing bookings
    return bookings.some(booking => {
      // Skip if not the same venue or date
      if (booking.venue !== newVenue || !isSameDay(booking.date, newDate || new Date())) {
        return false;
      }
      
      if (formData.id && booking.id === formData.id) {
        return false;
      }
      
      // Check for time overlap
      const existingStartIndex = timeToIndex(booking.startTime);
      const existingEndIndex = timeToIndex(booking.endTime);
      
      // Two bookings clash if:
      // - New booking starts during existing booking
      // - New booking ends during existing booking
      // - New booking completely contains existing booking
      return (
        (newStartIndex >= existingStartIndex && newStartIndex < existingEndIndex) ||
        (newEndIndex > existingStartIndex && newEndIndex <= existingEndIndex) ||
        (newStartIndex <= existingStartIndex && newEndIndex >= existingEndIndex)
      );
    });
  };

  const handleCreateSubmit = (formData: BookingFormData) => {
    // Check for booking clashes
    const hasClash = checkForClash(formData);
    
    if (hasClash) {
      setShowClashWarning(true);
      return;
    }
    
    // Reset clash warning if no clash
    setShowClashWarning(false);
    
    // Create new booking
    const newBooking: Booking = {
      id: Math.max(0, ...bookings.map(b => b.id)) + 1,
      eventName: formData.eventName,
      organization: formData.organization,
      venue: formData.venue,
      date: formData.date || new Date(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      color: '#FFD6CC'
    };
    setBookings([...bookings, newBooking]);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (formData: BookingFormData) => {
    if (!formData.id) return;
  
    const hasClash = checkForClash(formData);
    
    if (hasClash) {
      setShowClashWarning(true);
      return;
    }
    
    // Reset clash warning if no clash
    setShowClashWarning(false);

    // Update the booking in the array
    setBookings(bookings.map(booking => 
      booking.id === formData.id 
        ? {
            ...booking,
            eventName: formData.eventName,
            organization: formData.organization,
            venue: formData.venue,
            date: formData.date || new Date(),
            startTime: formData.startTime,
            endTime: formData.endTime
          }
        : booking
    ));
    
    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };

  const getCellBooking = (time: string, room: string) => {
    const timeIndex = timeToIndex(time);
    
    // Find a booking that:
    // 1. Matches the room
    // 2. Is on the current selected date
    // 3. The time falls within the booking's start and end times
    return bookings.find(booking => 
      booking.venue === room && 
      isSameDay(booking.date, date || new Date()) &&
      timeIndex >= timeToIndex(booking.startTime) &&
      timeIndex < timeToIndex(booking.endTime)
    );
  };

  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };

  const handleMouseDown = (time: string, room: string) => {
    if (!getCellBooking(time, room)) {
      setDragStart({ time, room });
      setDragEnd({ time, room });
    }
  };

  const handleMouseMove = (time: string, room: string) => {
    if (dragStart && dragStart.room === room) {
      setDragEnd({ time, room });
    }
  };

  const handleMouseUp = () => {
    if (dragStart && dragEnd) {
      // Calculate start and end times from drag
      const startIndex = Math.min(timeToIndex(dragStart.time), timeToIndex(dragEnd.time));
      const endIndex = Math.max(timeToIndex(dragStart.time), timeToIndex(dragEnd.time)) + 1;
      
      const startTime = timeSlots[startIndex];
      const endTime = timeSlots[endIndex];

      // Use the room from dragStart (column where user started dragging)
      const selectedVenue = dragStart.room;
  
      // Open create modal with selected time range and room
      setIsCreateModalOpen(true);
      
      // Store the selected range for the modal
      setSelectedTimeRange({
        venue: selectedVenue,
        startTime,
        endTime,
        date: date
      });
      
      // Reset drag state
      setDragStart(null);
      setDragEnd(null);
    }
  };

  const handleDeleteBooking = (bookingId: number) => {
    // Filter out the booking with the matching ID
    setBookings(bookings.filter(booking => booking.id !== bookingId));
    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setShowClashWarning(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setShowClashWarning(false);
    setSelectedBooking(null);
  };
  
  const renderRoomTimetable = (room: string) => {
    return (
      <div key={room} className="flex-1 min-w-[200px] rounded-lg overflow-hidden">
        {/* Room header */}
        <div className="bg-white text-[#0C2C47] p-2 h-14 text-center whitespace-normal text-sm font-medium border-b flex items-center justify-center rounded-tl-3xl rounded-tr-3xl">
          {room}
        </div>
        
        {/* Time cells */}
        <div className="bg-white divide-y">
          {timeSlots.map((time) => {
            // Find if there's a booking for this time and room
            const booking = bookings.find(b => 
              b.venue === room && 
              isSameDay(b.date, date || new Date()) &&
              timeToIndex(time) >= timeToIndex(b.startTime) &&
              timeToIndex(time) < timeToIndex(b.endTime)
            );
            
            // Check if this is the first cell of a booking
            const isFirstCell = booking && booking.startTime === time;
            
            // Calculate span for booking
            const getSpan = () => {
              if (!booking || !isFirstCell) return 1;
              const startIndex = timeToIndex(booking.startTime);
              const endIndex = timeToIndex(booking.endTime);
              return endIndex - startIndex;
            };
            
            const span = getSpan();
            
            // Check if this cell is in drag selection
            const isSelected = dragStart && dragEnd && dragStart.room === room && 
              timeToIndex(time) >= Math.min(timeToIndex(dragStart.time), timeToIndex(dragEnd.time)) && 
              timeToIndex(time) <= Math.max(timeToIndex(dragStart.time), timeToIndex(dragEnd.time)) &&
              !booking;
            
            return (
              <React.Fragment key={`${room}-${time}`}>
                {booking && isFirstCell ? (
                  <div 
                    className="relative cursor-pointer p-2"
                    style={{ 
                      backgroundColor: booking.color,
                      height: `${span * 3}rem`,
                    }}
                    onClick={() => handleBookingClick(booking)}
                    onMouseEnter={() => setHoveredBooking(booking)}
                    onMouseLeave={() => setHoveredBooking(null)}
                  >
                    <div className="text-xs text-gray-800">
                      <div className="font-medium">{booking.eventName}</div>
                      <div>{booking.organization}</div>
                      <div className="mt-1 text-[10px]">{booking.startTime} - {booking.endTime}</div>
                    </div>
                  </div>
                ) : !booking ? (
                  <div 
                    className={`p-2 h-12 relative cursor-cell ${isSelected ? 'bg-blue-200' : 'bg-white'}`}
                    onMouseDown={() => handleMouseDown(time, room)}
                    onMouseMove={() => handleMouseMove(time, room)}
                  >
                  </div>
                ) : null }
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // Track mouse position for positioning the hover card
  React.useEffect(() => {
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
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Add an absolute positioned warning */}
      {showClashWarning && (
        <div className="fixed top-20 inset-x-0 bg-[#FFE9E3] text-[#FF7D4E] py-4 px-3 text-center text-sm font-medium z-[9999] shadow-lg animate-fadeIn">
          THERE IS A CLASH IN BOOKINGS. PLEASE SELECT A DIFFERENT VENUE OR TIMING & RESUBMIT.
        </div>
      )}

      <div className="flex flex-col lg:flex-row bg-[#0C2C47]">
        {/* Calendar - Hidden on mobile */}
        <div className="hidden lg:block w-72 bg-white p-4 rounded-lg">
          <div className="mb-2 font-medium">Calendar</div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full"
            showOutsideDays={false}
          />
        </div>

        {/* Timetable - Full width on mobile */}
        <div className="flex-1 lg:ml-8 mt-10 overflow-auto px-2 lg:px-0">  
          <div className="flex">
            {/* Time labels column */}
            <div className="flex flex-col w-10 lg:w-14 text-right">
              <div className="h-8"></div>
              {timeSlots.map((time) => (
                <div key={time} className="h-12 flex items-center justify-end pr-2 text-xs lg:text-sm text-white relative">
                  {time}
                  {/* White connecting line */}
                  <div className="absolute right-0 top-1/2 w-2 h-px bg-white"></div>
                </div>
              ))}
            </div>
            
            {/* Scrollable container for room timetables */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-[1]" onMouseUp={handleMouseUp}>
                {rooms.map(room => renderRoomTimetable(room))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      <CreateBookingModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateSubmit}
        initialVenue={selectedTimeRange?.venue}
        initialStartTime={selectedTimeRange?.startTime}
        initialEndTime={selectedTimeRange?.endTime}
        initialDate={selectedTimeRange?.date}
        showClashWarning={showClashWarning}
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
          <div style={{ 
            position: 'fixed',
            top: 'var(--mouse-y)',
            left: 'var(--mouse-x)',
            transform: 'translate(20px, -50%)'
          }}>
            <EventCard 
              eventName={hoveredBooking.eventName}
              organization={hoveredBooking.organization}
              date={formatDate(hoveredBooking.date)}
              time={`${hoveredBooking.startTime} - ${hoveredBooking.endTime}`}
              venue={hoveredBooking.venue}
            />
          </div>
        </CardPortal>
      )}

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}