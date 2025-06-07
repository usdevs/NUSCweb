'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CreateEventModal from '@/components/create-event-modal';
import EditEventModal from '@/components/edit-event-modal';
import EventDailyView from '@/components/event-daily-view';
import { ChevronLeft, ChevronRight, User, Clock, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { EVENT_CATEGORIES } from '@/lib/formOptions';

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

export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK'>('MONTH');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDailyViewOpen, setIsDailyViewOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [createEventDate, setCreateEventDate] = useState<Date | null>(null);

  const today = new Date();

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      eventName: 'Exam Welfare: EWP Distribution',
      organization: 'NUSCC Welfare',
      category: 'WELFARE',
      venue: 'CTPH',
      date: new Date(2025, 3, 10),
      startTime: '4:00PM',
      endTime: '6:30PM'
    },
    {
      id: 2,
      eventName: 'RA Acai Event',
      organization: 'Residential Team',
      category: 'WELFARE',
      venue: 'RC1 Student Lounge',
      date: new Date(2025, 3, 10),
      startTime: '7:30PM',
      endTime: '9:30PM'
    },
    {
      id: 3,
      eventName: 'Sentinel Matcha Event',
      organization: 'Sentinel House',
      category: 'SOCIO-CULTURAL',
      venue: 'RC2 Pantry',
      date: new Date(2025, 3, 10),
      startTime: '8:00PM',
      endTime: '9:00PM'
    }
  ]);

  const categories = EVENT_CATEGORIES;

  const getCategoryBgColor = (category: string) => {
    const categoryData = categories.find(cat => cat.name === category);
    return categoryData ? categoryData.bgColor : 'bg-gray-200';
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getFilteredEvents = (date: Date) => {
    let dayEvents = getEventsForDate(date);
    
    if (searchTerm) {
      dayEvents = dayEvents.filter(event => 
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategories.length > 0) {
      dayEvents = dayEvents.filter(event => 
        selectedCategories.includes(event.category)
      );
    }
    
    return dayEvents;
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleCreateEvent = (eventData: EventFormData) => {
    const newEvent: Event = {
      id: Math.max(0, ...events.map(e => e.id)) + 1,
      eventName: eventData.eventName,
      organization: eventData.organization,
      category: eventData.category,
      venue: eventData.venue,
      date: eventData.date || createEventDate || new Date(),
      startTime: eventData.startTime,
      endTime: eventData.endTime
    };
    setEvents([...events, newEvent]);
    setIsCreateModalOpen(false);
    setCreateEventDate(null);
  };

  const handleEditEvent = (eventData: EventFormData) => {
    if (!eventData.id) return;
    
    setEvents(events.map(event => 
      event.id === eventData.id 
        ? {
            ...event,
            eventName: eventData.eventName,
            organization: eventData.organization,
            category: eventData.category,
            venue: eventData.venue,
            date: eventData.date || new Date(),
            startTime: eventData.startTime,
            endTime: eventData.endTime
          }
        : event
    ));
    
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleShowMore = (date: Date) => {
    setSelectedDate(date);
    setIsDailyViewOpen(true);
  };

  const handleEmptyDayClick = (date: Date) => {
    setCreateEventDate(date);
    setIsCreateModalOpen(true);
  };

  const handlePrevious = () => {
    if (viewMode === 'MONTH') {
      setCurrentDate(prev => subMonths(prev, 1));
    } else {
      setCurrentDate(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (viewMode === 'MONTH') {
      setCurrentDate(prev => addMonths(prev, 1));
    } else {
      setCurrentDate(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const isDateInCurrentPeriod = (date: Date) => {
    if (viewMode === 'MONTH') {
      return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return isWithinInterval(date, { start: weekStart, end: weekEnd });
    }
  };

  const renderMonthView = () => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="bg-[#0C2C47] rounded-2xl overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 p-0.5 pt-0">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <div 
            key={day} 
            className="p-4 text-center text-[#0C2C47] font-bold text-base bg-white rounded-t-2xl border-b border-[#0C2C47]"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 mx-0.5 mb-0.5">
        {weeks.map((week, weekIndex) => 
          week.map((day, dayIndex) => {
            const dayEvents = getFilteredEvents(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isLastRow = weekIndex === weeks.length - 1;
            const isFirstCol = dayIndex === 0;
            const isLastCol = dayIndex === 6;
            const maxEventsToShow = 2;
            const hasMoreEvents = dayEvents.length > maxEventsToShow;
            
            if (!isCurrentMonth) {
              return (
                <div 
                  key={`${weekIndex}-${dayIndex}`}
                  className={`h-[140px] bg-white ${
                    isLastRow && isFirstCol ? 'rounded-bl-2xl' : 
                    isLastRow && isLastCol ? 'rounded-br-2xl' : ''
                  }`}
                />
              );
            }
            
            return (
              <div 
                key={`${weekIndex}-${dayIndex}`}
                className={`h-[140px] p-4 cursor-pointer bg-white hover:bg-gray-50 ${
                  isLastRow && isFirstCol ? 'rounded-bl-2xl' : 
                  isLastRow && isLastCol ? 'rounded-br-2xl' : ''
                }`}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (e.target === e.currentTarget || target.classList?.contains('day-content')) {
                    handleEmptyDayClick(day);
                  }
                }}
              >
                <div className="day-content pointer-events-none">
                  {(() => {
                    const isToday = isSameDay(day, today);
                    return (
                      <div
                        className={`font-bold text-base mb-2 ${
                          isToday
                            ? 'bg-[#FF7D4E] text-white rounded-full w-8 h-8 flex items-center justify-center'
                            : 'text-[#0C2C47]'
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    );
                  })()}
                  <div className="space-y-1 pointer-events-auto">
                    {dayEvents.slice(0, maxEventsToShow).map(event => (
                      <div 
                        key={event.id}
                        className="flex items-center gap-2 cursor-pointer text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full ${getCategoryBgColor(event.category)} flex-shrink-0`}></div>
                        <span className="truncate font-medium text-[#0C2C47]">{event.eventName}</span>
                      </div>
                    ))}
                    {hasMoreEvents && (
                      <button 
                        className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded w-full hover:bg-gray-400 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowMore(day);
                        }}
                      >
                        SHOW MORE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const renderWeekView = () => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="bg-[#0C2C47] rounded-2xl overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 p-0.5 pt-0">
        {weekDays.map((day) => (
          <div 
            key={`${day.toISOString()}-header`} 
            className="text-center text-[#0C2C47] bg-white rounded-t-2xl border-b border-[#0C2C47] p-4"
          >
            <div className="font-bold text-base">
              {format(day, 'EEE').toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      
      {/* Week grid */}
      <div className="grid grid-cols-7 gap-0.5 min-h-[600px] mx-0.5 mb-0.5">
        {weekDays.map((day, index) => {
          const dayEvents = getFilteredEvents(day);
          const isFirstCol = index === 0;
          const isLastCol = index === 6;
          
          return (
            <div 
              key={day.toISOString()}
              className={`p-4 bg-white cursor-pointer hover:bg-gray-50 ${
                isFirstCol ? 'rounded-bl-2xl' : isLastCol ? 'rounded-br-2xl' : ''
              }`}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (e.target === e.currentTarget || target.classList?.contains('day-content')) {
                  handleEmptyDayClick(day);
                }
              }}
            >
              <div className="day-content pointer-events-none">
                {(() => {
                  const isToday = isSameDay(day, today);
                  return (
                    <div
                      className={`font-bold text-base mb-2 ${
                        isToday
                          ? 'bg-[#FF7D4E] text-white rounded-full w-8 h-8 flex items-center justify-center'
                          : 'text-[#0C2C47]'
                      }`}
                    >
                      {day.getDate()}
                    </div>
                  );
                })()}
                
                {/* Events */}
                <div className="space-y-2 pointer-events-auto">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className="text-xs p-2 rounded cursor-pointer bg-[#FCDED6]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className="font-medium">{event.eventName}</div>
                      <div className="text-gray-600 flex items-center gap-1">
                        <User className="h-4 w-4 fill-current" style={{ fill: '#0C2C47' }} />
                        <span>{event.organization}</span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


  return (
    <div className="min-h-screen bg-[#0C2C47]">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-white px-8 py-4 min-h-screen">

          {/* View Toggle */}
          <div className="relative mb-6 rounded-[8px] h-10 bg-white overflow-visible">
          <div className="absolute inset-0 border border-[#A1A1A1] rounded-[8px]" />          
          <div 
              className={`absolute top-0 h-full bg-[#FCDED6] transition-transform duration-300 ease-in-out ${
              viewMode === 'MONTH' ? 'w-1/2 translate-x-0 rounded-l-[7px]' : 'w-1/2 translate-x-full rounded-r-[7px]'
              }`}
          />          
          <div 
              className={`absolute top-0 h-full border-2 border-[#FF7D4E] transition-transform duration-300 ease-in-out ${
              viewMode === 'MONTH' 
                  ? 'w-[calc(50%+2px)] translate-x-0 rounded-l-[7px] -left-px' 
                  : 'w-[calc(50%+2px)] translate-x-[calc(100%-4px)] rounded-r-[7px]'
              }`}
          />          
          <div className="absolute top-0 left-1/2 h-full w-px bg-[#A1A1A1] transform -translate-x-px z-10" />
            <div className="relative flex h-full z-20">
                <Button
                variant="ghost"
                onClick={() => setViewMode('MONTH')}
                className={`flex-1 h-full text-sm font-semibold transition-colors duration-300 rounded-none ${
                    viewMode === 'MONTH' ? 'text-[#FF7D4E]' : 'text-[#A1A1A1]'
                }`}
                >
                MONTH
                </Button>
                <Button
                variant="ghost"
                onClick={() => setViewMode('WEEK')}
                className={`flex-1 h-full text-sm font-semibold transition-colors duration-300 rounded-none ${
                    viewMode === 'WEEK' ? 'text-[#FF7D4E]' : 'text-[#A1A1A1]'
                }`}
                >
                WEEK
                </Button>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-[#0C2C47] text-sm">{format(currentDate, 'MMMM')}</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-[#0C2C47] hover:bg-gray-100"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-[#0C2C47] hover:bg-gray-100"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-xs">
              <div className="grid grid-cols-7 gap-1 mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayLetter, index) => (
                  <div key={`${dayLetter}-${index}`} className="text-center text-[#0C2C47] py-1">{dayLetter}</div>
                ))}
              </div>
              
              {/* Highlighted background layer */}
              <div className="relative">
                {(() => {
                  const monthStart = startOfMonth(currentDate);
                  const monthEnd = endOfMonth(currentDate);
                  const calendarStart = startOfWeek(monthStart);
                  const calendarEnd = endOfWeek(monthEnd);
                  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
                  
                  const cellHeight = 32;
                  const gapSize = 4;
                  
                  if (viewMode === 'MONTH') {
                    // Only highlight rows that contain current month days
                    const rows = [];
                    for (let i = 0; i < calendarDays.length; i += 7) {
                      const week = calendarDays.slice(i, i + 7);
                      const currentMonthDays = week.filter(day => day.getMonth() === currentDate.getMonth());
                      
                      if (currentMonthDays.length > 0) {
                        const rowIndex = i / 7;
                        // Find the range of current month days in this week
                        const firstCurrentMonthIndex = week.findIndex(day => day.getMonth() === currentDate.getMonth());
                        const lastCurrentMonthIndex = week.findLastIndex(day => day.getMonth() === currentDate.getMonth());
                        
                        if (firstCurrentMonthIndex !== -1 && lastCurrentMonthIndex !== -1) {
                          const startCol = Math.max(0, firstCurrentMonthIndex);
                          const endCol = Math.min(6, lastCurrentMonthIndex);
                          const colWidth = 100 / 7;
                          
                          rows.push(
                            <div 
                              key={i}
                              className="absolute bg-[#FCDED6] rounded-md"
                              style={{
                                top: `${rowIndex * (cellHeight + gapSize)}px`,
                                left: `${startCol * colWidth}%`,
                                width: `${(endCol - startCol + 1) * colWidth}%`,
                                height: `${cellHeight}px`
                              }}
                            />
                          );
                        }
                      }
                    }
                    return rows;
                  }
                  
                  if (viewMode === 'WEEK') {
                    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
                    
                    // Only highlight if week intersects current month
                    const weekStartIndex = calendarDays.findIndex(day => isSameDay(day, weekStart));
                    
                    if (weekStartIndex >= 0) {
                      const weekDays = [];
                      for (let i = 0; i < 7; i++) {
                        const dayIndex = weekStartIndex + i;
                        if (dayIndex < calendarDays.length) {
                          weekDays.push(calendarDays[dayIndex]);
                        }
                      }
                      
                      // Only highlight days in current month or visible in calendar
                      const segments = [];
                      let currentSegmentStart = -1;
                      
                      weekDays.forEach((day, index) => {
                        // Include if current month or visible in calendar view
                        const shouldHighlight = day.getMonth() === currentDate.getMonth() || 
                                              (day >= calendarStart && day <= calendarEnd);
                        
                        if (shouldHighlight) {
                          if (currentSegmentStart === -1) {
                            currentSegmentStart = index;
                          }
                        } else {
                          if (currentSegmentStart !== -1) {
                            // End current segment
                            const startDayIndex = weekStartIndex + currentSegmentStart;
                            const endDayIndex = weekStartIndex + index - 1;
                            const startRowIndex = Math.floor(startDayIndex / 7);
                            const endRowIndex = Math.floor(endDayIndex / 7);
                            const startColIndex = startDayIndex % 7;
                            const endColIndex = endDayIndex % 7;
                            
                            segments.push({ startRowIndex, endRowIndex, startColIndex, endColIndex });
                            currentSegmentStart = -1;
                          }
                        }
                      });
                      
                      // Handle case where segment goes to the end
                      if (currentSegmentStart !== -1) {
                        const startDayIndex = weekStartIndex + currentSegmentStart;
                        const endDayIndex = weekStartIndex + weekDays.length - 1;
                        const startRowIndex = Math.floor(startDayIndex / 7);
                        const endRowIndex = Math.floor(endDayIndex / 7);
                        const startColIndex = startDayIndex % 7;
                        const endColIndex = endDayIndex % 7;
                        
                        segments.push({ startRowIndex, endRowIndex, startColIndex, endColIndex });
                      }
                      
                      return segments.map((segment, segmentIndex) => {
                        const colWidth = 100 / 7;
                        
                        if (segment.startRowIndex === segment.endRowIndex) {
                          // Single row segment
                          return (
                            <div 
                              key={segmentIndex}
                              className="absolute bg-[#FCDED6] rounded-md"
                              style={{
                                top: `${segment.startRowIndex * (cellHeight + gapSize)}px`,
                                left: `${segment.startColIndex * colWidth}%`,
                                width: `${(segment.endColIndex - segment.startColIndex + 1) * colWidth}%`,
                                height: `${cellHeight}px`
                              }}
                            />
                          );
                        } else {
                          // Multi-row segment
                          return (
                            <React.Fragment key={segmentIndex}>
                              <div 
                                className="absolute bg-[#FCDED6] rounded-l-md"
                                style={{
                                  top: `${segment.startRowIndex * (cellHeight + gapSize)}px`,
                                  left: `${segment.startColIndex * colWidth}%`,
                                  width: `${(6 - segment.startColIndex + 1) * colWidth}%`,
                                  height: `${cellHeight}px`
                                }}
                              />
                              <div 
                                className="absolute bg-[#FCDED6] rounded-r-md"
                                style={{
                                  top: `${segment.endRowIndex * (cellHeight + gapSize)}px`,
                                  left: '0%',
                                  width: `${(segment.endColIndex + 1) * colWidth}%`,
                                  height: `${cellHeight}px`
                                }}
                              />
                            </React.Fragment>
                          );
                        }
                      });
                    }
                  }
                  
                  return null;
                })()}
                
                {/* Calendar grid */}
                <div className="relative grid grid-cols-7 gap-1">
                  {(() => {
                    const monthStart = startOfMonth(currentDate);
                    const monthEnd = endOfMonth(currentDate);
                    const calendarStart = startOfWeek(monthStart);
                    const calendarEnd = endOfWeek(monthEnd);
                    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
                    
                    return calendarDays.map((day) => {
                      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                      const isInCurrentPeriod = isDateInCurrentPeriod(day);
                      
                      return (
                        <button
                          key={day.toISOString()}
                          className={`text-center py-1 px-1 text-xs relative z-10 h-8 ${
                            !isCurrentMonth 
                              ? 'text-gray-300' 
                              : isInCurrentPeriod 
                                ? 'text-[#0C2C47] font-medium' 
                                : 'text-[#0C2C47] hover:bg-gray-100 rounded'
                          }`}
                          onClick={() => setCurrentDate(day)}
                        >
                          {day.getDate()}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-[#0C2C47] text-sm">SEARCH</h3>
            <input
              type="text"
              className="w-full p-2 border border-[#A1A1A1] rounded text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3 text-[#0C2C47] text-sm">CATEGORIES</h3>
            <div className="space-y-3">
              {categories.map(category => (
                <label key={category.name} className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryToggle(category.name)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 border-[#A1A1A1] mr-3 ${category.bgColor} flex items-center justify-center`}>
                      {selectedCategories.includes(category.name) && (
                        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-[#0C2C47]">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="w-[38px] h-[38px] rounded-full bg-[#FF7D4E] text-white hover:bg-[#FF7D4E]/90"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-[38px] h-[38px] rounded-full bg-[#FF7D4E] text-white hover:bg-[#FF7D4E]/90"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h1 className="text-[40px] font-bold text-white">
              Events in <span className="text-[#FF7D4E]" style={{ textDecoration: 'underline', textDecorationStyle: 'dashed', textDecorationColor: 'white', textUnderlineOffset: '8px', textDecorationThickness: '1px' }}>
                {format(currentDate, 'MMMM yyyy')}
              </span>
            </h1>
          </div>

          {/* Calendar View */}
          {viewMode === 'MONTH' ? renderMonthView() : renderWeekView()}
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
      isOpen={isCreateModalOpen}
      onClose={() => {
          setIsCreateModalOpen(false);
          setCreateEventDate(null);
      }}
      onSubmit={handleCreateEvent}
      initialDate={createEventDate}
      />

      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
      />

      <EventDailyView
        isOpen={isDailyViewOpen}
        onClose={() => setIsDailyViewOpen(false)}
        date={selectedDate}
        events={selectedDate ? getFilteredEvents(selectedDate) : []}
        onEventClick={handleEventClick}
        getCategoryBgColor={getCategoryBgColor}
      />

      <Footer />
    </div>
  );
}
