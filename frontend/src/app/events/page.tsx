'use client';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import CreateEventModal from '@/components/create-event-modal';
import EditEventModal from '@/components/edit-event-modal';
import MonthView from '@/components/event/MonthView';
import WeekView from '@/components/event/WeekView';
import EventDailyView from '@/components/event-daily-view';
import { Button } from '@/components/ui/button';
import { EVENT_CATEGORIES } from '@/lib/formOptions';

export interface Event {
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

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      eventName: 'Exam Welfare: EWP Distribution',
      organization: 'NUSCC Welfare',
      category: 'WELFARE',
      venue: 'CTPH',
      date: new Date(2025, 3, 10),
      startTime: '4:00PM',
      endTime: '6:30PM',
    },
    {
      id: 2,
      eventName: 'RA Acai Event',
      organization: 'Residential Team',
      category: 'WELFARE',
      venue: 'RC1 Student Lounge',
      date: new Date(2025, 3, 10),
      startTime: '7:30PM',
      endTime: '9:30PM',
    },
    {
      id: 3,
      eventName: 'Sentinel Matcha Event',
      organization: 'Sentinel House',
      category: 'SOCIO-CULTURAL',
      venue: 'RC2 Pantry',
      date: new Date(2025, 3, 10),
      startTime: '8:00PM',
      endTime: '9:00PM',
    },
  ]);

  const categories = EVENT_CATEGORIES;

  const getCategoryBgColor = (category: string) => {
    const categoryData = categories.find((cat) => cat.name === category);
    return categoryData ? categoryData.bgColor : 'bg-gray-200';
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const getFilteredEvents = (date: Date) => {
    let dayEvents = getEventsForDate(date);

    if (searchTerm) {
      dayEvents = dayEvents.filter(
        (event) =>
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organization.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategories.length > 0) {
      dayEvents = dayEvents.filter((event) =>
        selectedCategories.includes(event.category),
      );
    }

    return dayEvents;
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleCreateEvent = (eventData: EventFormData) => {
    const newEvent: Event = {
      id: Math.max(0, ...events.map((e) => e.id)) + 1,
      eventName: eventData.eventName,
      organization: eventData.organization,
      category: eventData.category,
      venue: eventData.venue,
      date: eventData.date || createEventDate || new Date(),
      startTime: eventData.startTime,
      endTime: eventData.endTime,
    };
    setEvents([...events, newEvent]);
    setIsCreateModalOpen(false);
    setCreateEventDate(null);
  };

  const handleEditEvent = (eventData: EventFormData) => {
    if (!eventData.id) return;

    setEvents(
      events.map((event) =>
        event.id === eventData.id
          ? {
              ...event,
              eventName: eventData.eventName,
              organization: eventData.organization,
              category: eventData.category,
              venue: eventData.venue,
              date: eventData.date || new Date(),
              startTime: eventData.startTime,
              endTime: eventData.endTime,
            }
          : event,
      ),
    );

    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((event) => event.id !== eventId));
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
      setCurrentDate((prev) => subMonths(prev, 1));
    } else {
      setCurrentDate(
        (prev) => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000),
      );
    }
  };

  const handleNext = () => {
    if (viewMode === 'MONTH') {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else {
      setCurrentDate(
        (prev) => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000),
      );
    }
  };

  const isDateInCurrentPeriod = (date: Date) => {
    if (viewMode === 'MONTH') {
      return (
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return isWithinInterval(date, { start: weekStart, end: weekEnd });
    }
  };

  return (
    <>
      <div className='flex bg-[#0C2C47]'>
        {/* Sidebar */}
        <div className='min-h-screen w-72 bg-white px-8 py-4'>
          {/* View Toggle */}
          <div
            className={`relative mb-6 h-10 overflow-visible rounded-[8px] bg-white`}
          >
            <div
              className={`absolute inset-0 rounded-[8px] border border-[#A1A1A1]`}
            />
            <div
              className={`absolute top-0 h-full bg-[#FCDED6] transition-transform duration-300 ease-in-out ${
                viewMode === 'MONTH'
                  ? 'w-1/2 translate-x-0 rounded-l-[7px]'
                  : 'w-1/2 translate-x-full rounded-r-[7px]'
              }`}
            />
            <div
              className={`absolute top-0 h-full border-2 border-[#FF7D4E] transition-transform duration-300 ease-in-out ${
                viewMode === 'MONTH'
                  ? '-left-px w-[calc(50%+2px)] translate-x-0 rounded-l-[7px]'
                  : `w-[calc(50%+2px)] translate-x-[calc(100%-4px)] rounded-r-[7px]`
              }`}
            />
            <div
              className={`absolute top-0 left-1/2 z-10 h-full w-px -translate-x-px transform bg-[#A1A1A1]`}
            />
            <div className='relative z-20 flex h-full'>
              <Button
                variant='ghost'
                onClick={() => setViewMode('MONTH')}
                className={`h-full flex-1 rounded-none text-sm font-semibold transition-colors duration-300 ${
                  viewMode === 'MONTH' ? 'text-[#FF7D4E]' : 'text-[#A1A1A1]'
                }`}
              >
                MONTH
              </Button>
              <Button
                variant='ghost'
                onClick={() => setViewMode('WEEK')}
                className={`h-full flex-1 rounded-none text-sm font-semibold transition-colors duration-300 ${
                  viewMode === 'WEEK' ? 'text-[#FF7D4E]' : 'text-[#A1A1A1]'
                }`}
              >
                WEEK
              </Button>
            </div>
          </div>

          {/* Calendar */}
          <div className='mb-6'>
            <div className='mb-3 flex items-center justify-between'>
              <h3 className='text-sm font-medium text-[#0C2C47]'>
                {format(currentDate, 'MMMM')}
              </h3>
              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='icon'
                  className={`h-6 w-6 text-[#0C2C47] hover:bg-gray-100`}
                  onClick={handlePrevious}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className={`h-6 w-6 text-[#0C2C47] hover:bg-gray-100`}
                  onClick={handleNext}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='text-xs'>
              <div className='mb-3 grid grid-cols-7 gap-1'>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayLetter, index) => (
                  <div
                    key={`${dayLetter}-${index}`}
                    className='py-1 text-center text-[#0C2C47]'
                  >
                    {dayLetter}
                  </div>
                ))}
              </div>

              {/* Highlighted background layer */}
              <div className='relative'>
                {(() => {
                  const monthStart = startOfMonth(currentDate);
                  const monthEnd = endOfMonth(currentDate);
                  const calendarStart = startOfWeek(monthStart);
                  const calendarEnd = endOfWeek(monthEnd);
                  const calendarDays = eachDayOfInterval({
                    start: calendarStart,
                    end: calendarEnd,
                  });

                  const cellHeight = 32;
                  const gapSize = 4;

                  if (viewMode === 'MONTH') {
                    // Only highlight rows that contain current month days
                    const rows = [];
                    for (let i = 0; i < calendarDays.length; i += 7) {
                      const week = calendarDays.slice(i, i + 7);
                      const currentMonthDays = week.filter(
                        (day) => day.getMonth() === currentDate.getMonth(),
                      );

                      if (currentMonthDays.length > 0) {
                        const rowIndex = i / 7;
                        // Find the range of current month days in this week
                        const firstCurrentMonthIndex = week.findIndex(
                          (day) => day.getMonth() === currentDate.getMonth(),
                        );
                        const lastCurrentMonthIndex = week.findLastIndex(
                          (day) => day.getMonth() === currentDate.getMonth(),
                        );

                        if (
                          firstCurrentMonthIndex !== -1 &&
                          lastCurrentMonthIndex !== -1
                        ) {
                          const startCol = Math.max(0, firstCurrentMonthIndex);
                          const endCol = Math.min(6, lastCurrentMonthIndex);
                          const colWidth = 100 / 7;

                          rows.push(
                            <div
                              key={i}
                              className='absolute rounded-md bg-[#FCDED6]'
                              style={{
                                top: `${rowIndex * (cellHeight + gapSize)}px`,
                                left: `${startCol * colWidth}%`,
                                width: `${(endCol - startCol + 1) * colWidth}%`,
                                height: `${cellHeight}px`,
                              }}
                            />,
                          );
                        }
                      }
                    }
                    return rows;
                  }

                  if (viewMode === 'WEEK') {
                    const weekStart = startOfWeek(currentDate, {
                      weekStartsOn: 1,
                    });

                    // Only highlight if week intersects current month
                    const weekStartIndex = calendarDays.findIndex((day) =>
                      isSameDay(day, weekStart),
                    );

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
                        const shouldHighlight =
                          day.getMonth() === currentDate.getMonth() ||
                          (day >= calendarStart && day <= calendarEnd);

                        if (shouldHighlight) {
                          if (currentSegmentStart === -1) {
                            currentSegmentStart = index;
                          }
                        } else {
                          if (currentSegmentStart !== -1) {
                            // End current segment
                            const startDayIndex =
                              weekStartIndex + currentSegmentStart;
                            const endDayIndex = weekStartIndex + index - 1;
                            const startRowIndex = Math.floor(startDayIndex / 7);
                            const endRowIndex = Math.floor(endDayIndex / 7);
                            const startColIndex = startDayIndex % 7;
                            const endColIndex = endDayIndex % 7;

                            segments.push({
                              startRowIndex,
                              endRowIndex,
                              startColIndex,
                              endColIndex,
                            });
                            currentSegmentStart = -1;
                          }
                        }
                      });

                      // Handle case where segment goes to the end
                      if (currentSegmentStart !== -1) {
                        const startDayIndex =
                          weekStartIndex + currentSegmentStart;
                        const endDayIndex =
                          weekStartIndex + weekDays.length - 1;
                        const startRowIndex = Math.floor(startDayIndex / 7);
                        const endRowIndex = Math.floor(endDayIndex / 7);
                        const startColIndex = startDayIndex % 7;
                        const endColIndex = endDayIndex % 7;

                        segments.push({
                          startRowIndex,
                          endRowIndex,
                          startColIndex,
                          endColIndex,
                        });
                      }

                      return segments.map((segment, segmentIndex) => {
                        const colWidth = 100 / 7;

                        if (segment.startRowIndex === segment.endRowIndex) {
                          // Single row segment
                          return (
                            <div
                              key={segmentIndex}
                              className='absolute rounded-md bg-[#FCDED6]'
                              style={{
                                top: `${segment.startRowIndex * (cellHeight + gapSize)}px`,
                                left: `${segment.startColIndex * colWidth}%`,
                                width: `${(segment.endColIndex - segment.startColIndex + 1) * colWidth}%`,
                                height: `${cellHeight}px`,
                              }}
                            />
                          );
                        } else {
                          // Multi-row segment
                          return (
                            <>
                              <div
                                className='absolute rounded-l-md bg-[#FCDED6]'
                                style={{
                                  top: `${segment.startRowIndex * (cellHeight + gapSize)}px`,
                                  left: `${segment.startColIndex * colWidth}%`,
                                  width: `${(6 - segment.startColIndex + 1) * colWidth}%`,
                                  height: `${cellHeight}px`,
                                }}
                              />
                              <div
                                className='absolute rounded-r-md bg-[#FCDED6]'
                                style={{
                                  top: `${segment.endRowIndex * (cellHeight + gapSize)}px`,
                                  left: '0%',
                                  width: `${(segment.endColIndex + 1) * colWidth}%`,
                                  height: `${cellHeight}px`,
                                }}
                              />
                            </>
                          );
                        }
                      });
                    }
                  }

                  return null;
                })()}

                {/* Calendar grid */}
                <div className='relative grid grid-cols-7 gap-1'>
                  {(() => {
                    const monthStart = startOfMonth(currentDate);
                    const monthEnd = endOfMonth(currentDate);
                    const calendarStart = startOfWeek(monthStart);
                    const calendarEnd = endOfWeek(monthEnd);
                    const calendarDays = eachDayOfInterval({
                      start: calendarStart,
                      end: calendarEnd,
                    });

                    return calendarDays.map((day) => {
                      const isCurrentMonth =
                        day.getMonth() === currentDate.getMonth();
                      const isInCurrentPeriod = isDateInCurrentPeriod(day);

                      return (
                        <button
                          key={day.toISOString()}
                          className={`relative z-10 h-8 px-1 py-1 text-center text-xs ${
                            !isCurrentMonth
                              ? 'text-gray-300'
                              : isInCurrentPeriod
                                ? 'font-medium text-[#0C2C47]'
                                : `rounded text-[#0C2C47] hover:bg-gray-100`
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
          <div className='mb-6'>
            <h3 className='mb-3 text-sm font-medium text-[#0C2C47]'>SEARCH</h3>
            <input
              type='text'
              className='w-full rounded border border-[#A1A1A1] p-2 text-xs'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className='mb-3 text-sm font-medium text-[#0C2C47]'>
              CATEGORIES
            </h3>
            <div className='space-y-3'>
              {categories.map((category) => (
                <label
                  key={category.name}
                  className='flex cursor-pointer items-center'
                >
                  <div className='relative'>
                    <input
                      type='checkbox'
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryToggle(category.name)}
                      className='sr-only'
                    />
                    <div
                      className={`mr-3 h-4 w-4 rounded border-2 border-[#A1A1A1] ${category.bgColor} flex items-center justify-center`}
                    >
                      {selectedCategories.includes(category.name) && (
                        <svg
                          className='h-3 w-3 text-gray-600'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className='text-sm text-[#0C2C47]'>
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-8'>
          {/* Header */}
          <div className='mb-8 flex items-center gap-6'>
            <div className='flex items-center gap-3'>
              <Button
                variant='ghost'
                size='icon'
                className={`h-[38px] w-[38px] rounded-full bg-[#FF7D4E] text-white hover:bg-[#FF7D4E]/90`}
                onClick={handlePrevious}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className={`h-[38px] w-[38px] rounded-full bg-[#FF7D4E] text-white hover:bg-[#FF7D4E]/90`}
                onClick={handleNext}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
            <h1 className='text-[40px] font-bold text-white'>
              Events in{' '}
              <span
                className='text-[#FF7D4E]'
                style={{
                  textDecoration: 'underline',
                  textDecorationStyle: 'dashed',
                  textDecorationColor: 'white',
                  textUnderlineOffset: '8px',
                  textDecorationThickness: '1px',
                }}
              >
                {format(currentDate, 'MMMM yyyy')}
              </span>
            </h1>
          </div>

          {/* Calendar View */}
          {viewMode === 'MONTH' ? (
            <MonthView
              currentDate={currentDate}
              getFilteredEvents={getFilteredEvents}
              handleEmptyDayClick={handleEmptyDayClick}
              getCategoryBgColor={getCategoryBgColor}
              handleEventClick={handleEventClick}
              handleShowMore={handleShowMore}
            />
          ) : (
            <WeekView
              currentDate={currentDate}
              getFilteredEvents={getFilteredEvents}
              handleEmptyDayClick={handleEmptyDayClick}
              handleEventClick={handleEventClick}
            />
          )}
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
    </>
  );
}
