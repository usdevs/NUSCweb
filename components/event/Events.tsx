'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import {
  addHours,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import DailyViewModal from '@/components/DailyViewModal';
import MonthView from '@/components/event/MonthView';
import WeekView from '@/components/event/WeekView';
import EventModal from '@/components/EventModal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { createEvent, deleteEvent, editEvent } from '@/lib/actions/event';
import { EVENT_CATEGORIES } from '@/lib/formOptions';
import { useAuth } from '@/lib/hooks/useAuth';
import { NewEventSchema } from '@/lib/schema/event';
import { cn } from '@/lib/utils';
import { getNext30Minutes } from '@/lib/utils/client/time';
import type { EventView } from '@/lib/utils/server/event';

import CalendarGrid from './CalendarGrid';
import CalendarHighlight from './CalendarHighlight';

interface EventsProps {
  events: EventView[];
  userOrgs: {
    id: number;
    name: string;
  }[];
}

const today = getNext30Minutes();

export default function Events({ events, userOrgs }: EventsProps) {
  const isAuthenticated = useAuth();

  const [createEventDate, setCreateEventDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventView | null>(null);

  const isModalOpen = selectedEvent !== null || createEventDate !== null;

  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK'>('MONTH');

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const [isDailyViewOpen, setIsDailyViewOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [createEventState, createEventAction, createEventPending] =
    useActionState(createEvent, null);
  const [editEventState, editEventAction, editEventPending] = useActionState(
    editEvent,
    null,
  );
  const [deleteEventState, deleteEventAction, deleteEventPending] =
    useActionState(deleteEvent, null);

  const form = useForm<z.input<typeof NewEventSchema>>({
    resolver: standardSchemaResolver(NewEventSchema),
    defaultValues: {
      eventName: '',
      organisationId: 0,
      startTime: today,
      endTime: addHours(today, 2),
    },
  });

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.start, date));
  };

  const getFilteredEvents = (date: Date) => {
    let dayEvents = getEventsForDate(date);

    if (searchTerm) {
      dayEvents = dayEvents.filter(
        (event) =>
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.bookedForOrg.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // TODO: Change selectedCategories to default all
    if (selectedCategories.length > 0) {
      dayEvents = dayEvents.filter((event) =>
        selectedCategories.includes(event.bookedForOrg.category),
      );
    }

    return dayEvents;
  };

  const handleCreateSubmit = (formData: z.input<typeof NewEventSchema>) => {
    if (formData.startTime > formData.endTime) {
      toast.warning('Start time cannot be later then end time!');
      return;
    }

    const newEvent = new FormData();
    newEvent.set('eventName', formData.eventName);
    newEvent.set('organisationId', formData.organisationId.toString());
    newEvent.set('startTime', formData.startTime.toISOString());
    newEvent.set('endTime', formData.endTime.toISOString());

    createEventAction(newEvent);

    setCreateEventDate(null);
  };

  const handleEditSubmit = (formData: z.input<typeof NewEventSchema>) => {
    if (!selectedEvent) return;

    const editEvent = new FormData();
    editEvent.set('id', selectedEvent.id.toString());
    editEvent.set('eventName', formData.eventName);
    editEvent.set('organisationId', formData.organisationId.toString());
    editEvent.set('startTime', formData.startTime.toISOString());
    editEvent.set('endTime', formData.endTime.toISOString());

    editEventAction(editEvent);

    setSelectedEvent(null);
  };

  const handleSubmit = (formData: z.input<typeof NewEventSchema>) => {
    if (!isAuthenticated) {
      toast.error(
        selectedEvent === null
          ? 'Please login to create an event!'
          : 'Please login to edit events!',
      );
      return;
    }
    const handle =
      selectedEvent === null ? handleCreateSubmit : handleEditSubmit;
    handle(formData);
  };

  const handleDeleteSubmit = (eventId: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to delete events!');
      return;
    }

    const deleteEvent = new FormData();
    deleteEvent.set('id', eventId.toString());
    deleteEventAction(deleteEvent);
    setSelectedEvent(null);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setCreateEventDate(null);

    form.reset({
      eventName: '',
      organisationId: 0,
      startTime: today,
      endTime: addHours(today, 2),
    });
  };

  const handleShowMore = (date: Date) => {
    setSelectedDate(date);
    setIsDailyViewOpen(true);
  };

  const handleEmptyDayClick = (date: Date) => {
    setCreateEventDate(date);
    form.setValue('startTime', date);
    form.setValue('endTime', addHours(date, 2));
  };

  const handlePrevious = () =>
    setCurrentDate((prev) =>
      viewMode === 'MONTH' ? subMonths(prev, 1) : subWeeks(prev, 1),
    );

  const handleNext = () =>
    setCurrentDate((prev) =>
      viewMode === 'MONTH' ? addMonths(prev, 1) : addWeeks(prev, 1),
    );

  const calendarStart = startOfWeek(startOfMonth(currentDate), {
    weekStartsOn: 1,
  });
  const calendarEnd = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const handleEventClick = (event: EventView) => {
    setSelectedEvent(event);
    form.setValue('eventName', event.eventName);
    form.setValue('organisationId', event.bookedForOrg.id);
    form.setValue('startTime', event.start);
    form.setValue('endTime', event.end);
  };

  return (
    <div className='relative flex bg-[#0C2C47]'>
      {(createEventPending || editEventPending || deleteEventPending) && (
        <div className='bg-opacity-60 absolute inset-0 z-50 flex items-center justify-center bg-white'>
          <div className='h-24 w-24'>
            <Spinner />
          </div>
        </div>
      )}
      {/* Sidebar */}
      {/* TODO: How do mobile people select dates? */}
      <div className='hidden min-h-screen w-72 bg-white px-8 py-4 lg:block'>
        {/* View Toggle */}
        <ToggleGroup
          type='single'
          value={viewMode}
          onValueChange={(val) => setViewMode(val as 'MONTH' | 'WEEK')}
          className='relative mb-6 h-10 overflow-hidden rounded-lg border border-[#A1A1A1] bg-white'
        >
          <ToggleGroupItem
            value='MONTH'
            className={cn(
              'flex-1 rounded-none text-sm font-semibold transition-colors duration-300',
              viewMode === 'MONTH'
                ? 'rounded-l-md border-2 border-[#FF7D4E] bg-[#FCDED6] text-[#FF7D4E]'
                : 'text-[#A1A1A1]',
            )}
          >
            MONTH
          </ToggleGroupItem>
          <ToggleGroupItem
            value='WEEK'
            className={cn(
              'flex-1 rounded-none text-sm font-semibold transition-colors duration-300',
              viewMode === 'WEEK'
                ? 'rounded-r-md border-2 border-[#FF7D4E] bg-[#FCDED6] text-[#FF7D4E]'
                : 'text-[#A1A1A1]',
            )}
          >
            WEEK
          </ToggleGroupItem>
        </ToggleGroup>

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
                className='h-6 w-6 text-[#0C2C47] hover:bg-gray-100'
                onClick={handlePrevious}
              >
                <ChevronLeftIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 text-[#0C2C47] hover:bg-gray-100'
                onClick={handleNext}
              >
                <ChevronRightIcon className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div className='text-xs'>
            <div className='mb-3 grid grid-cols-7 gap-1'>
              {/* TODO: Add a box to show current date, similar to the calendar on bookings page */}
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayLetter, index) => (
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
              <CalendarHighlight
                currentDate={currentDate}
                viewMode={viewMode}
                calendarStart={calendarStart}
                calendarEnd={calendarEnd}
                calendarDays={calendarDays}
              />

              {/* Calendar grid */}
              <div className='relative grid grid-cols-7 gap-1'>
                <CalendarGrid
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  viewMode={viewMode}
                  // TODO: This is problematic
                  calendarDays={calendarDays}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className='mb-6'>
          <h3 className='mb-3 text-sm font-medium text-[#0C2C47]'>SEARCH</h3>
          <Input
            type='text'
            value={searchTerm}
            // TODO: Add debounce
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div>
          <h3 className='mb-3 text-sm font-medium text-[#0C2C47]'>
            CATEGORIES
          </h3>
          <div className='space-y-3'>
            {EVENT_CATEGORIES.map((category) => (
              <div key={category.name} className='flex items-center gap-3'>
                <Checkbox
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={(checked) =>
                    setSelectedCategories((prev) =>
                      checked
                        ? [...prev, category.name]
                        : prev.filter((c) => c !== category.name),
                    )
                  }
                  id={`category-${category.name}`}
                  className={category.bgColor}
                />
                <Label
                  htmlFor={`category-${category.name}`}
                  className='text-[#0C2C47]'
                >
                  {category.name.toUpperCase()}
                </Label>
              </div>
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
              className='h-[38px] w-[38px] rounded-full bg-[#FF7D4E] text-white hover:bg-[#FF7D4E]/90'
              onClick={handlePrevious}
            >
              <ChevronLeftIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-[38px] w-[38px] rounded-full bg-[#FF7D4E] text-white hover:bg-[#FF7D4E]/90'
              onClick={handleNext}
            >
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
          </div>
          <h1 className='text-[40px] font-bold text-white'>
            Events in{' '}
            <span className='text-[#FF7D4E] underline decoration-white decoration-dashed decoration-1 underline-offset-8'>
              {format(currentDate, 'MMMM yyyy')}
            </span>
          </h1>
        </div>

        {/* Calendar View */}
        {viewMode === 'MONTH' ? (
          <MonthView
            currentDate={currentDate}
            calendarDays={calendarDays}
            getFilteredEvents={getFilteredEvents}
            handleEmptyDayClick={handleEmptyDayClick}
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

      <EventModal
        form={form}
        selectedEvent={selectedEvent}
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        userOrgs={userOrgs}
        handleDeleteEvent={handleDeleteSubmit}
        handleSubmitEvent={handleSubmit}
        isPending={createEventPending || editEventPending || deleteEventPending}
      />

      <DailyViewModal
        isOpen={isDailyViewOpen}
        setIsOpen={setIsDailyViewOpen}
        date={selectedDate}
        events={selectedDate ? getFilteredEvents(selectedDate) : []}
        onEventClick={handleEventClick}
      />
    </div>
  );
}
