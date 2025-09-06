'use client';

import { addHours, format } from 'date-fns';
import { useState, useEffect, useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Calendar } from '@/components/ui/calendar';
import EventCard from '@/components/event-card';
import CardPortal from '@/components/card-portal';
import { timeToIndex } from '@/lib/utils';
import { dateTimeFormatter, getNext30Minutes } from '@/lib/utils/time';
import { TIMETABLE_TIMESLOTS } from '@/lib/formOptions';
import type { BookingView } from '@/lib/utils/bookings';
import {
  createBooking,
  deleteBooking,
  editBooking,
} from '@/lib/actions/booking';
import type { VenueView } from '@/lib/utils/venues';
import VenueTimetable from './VenueTimetable';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { NewBookingSchema } from '@/lib/schema/booking';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Trash2Icon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAuth } from '@/lib/hooks/useAuth';
import { toast } from 'sonner';

export interface DragPosition {
  time: string;
  venue: VenueView;
}

interface BookingsProp {
  bookings: BookingView[];
  venues: VenueView[];
  userOrgs: {
    id: number;
    name: string;
  }[];
}

const today = getNext30Minutes();

export default function Bookings({ bookings, venues, userOrgs }: BookingsProp) {
  const searchParams = useSearchParams();
  const isAuthenticated = useAuth();

  let date = today;
  try {
    const searchParamsDate = searchParams.get('date');
    if (searchParamsDate && !isNaN(Date.parse(searchParamsDate))) {
      date = new Date(searchParamsDate);
    }
  } catch {}

  const [selectedBooking, setSelectedBooking] = useState<BookingView | null>(
    null,
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    venue: VenueView;
    startTime: Date;
    endTime: Date;
  } | null>(null);

  const isModalOpen = selectedBooking !== null || selectedTimeRange !== null;

  const [showClashWarning, setShowClashWarning] = useState(false);

  const [dragStart, setDragStart] = useState<DragPosition | null>(null);
  const [dragEnd, setDragEnd] = useState<DragPosition | null>(null);

  const [hoveredBooking, setHoveredBooking] = useState<BookingView | null>(
    null,
  );

  const [createBookingState, createBookingAction, createBookingPending] =
    useActionState(createBooking, null);
  const [editBookingState, editBookingAction, editBookingPending] =
    useActionState(editBooking, null);
  const [deleteBookingState, deleteBookingAction, deleteBookingPending] =
    useActionState(deleteBooking, null);

  // Check against existing bookings
  const hasClash = (
    formData: z.input<typeof NewBookingSchema> & { id?: number },
  ) =>
    bookings.some((booking) => {
      // Skip if not the same venue
      if (booking.venue.id !== formData.venueId) {
        return false;
      }

      // Skip if same booking
      if (formData.id === booking.id) {
        return false;
      }

      return (
        booking.start <= formData.endTime && formData.startTime <= booking.start
      );
    });

  const handleCreateSubmit = (formData: z.input<typeof NewBookingSchema>) => {
    if (hasClash(formData)) {
      setShowClashWarning(true);
      return;
    }

    const newBooking = new FormData();
    newBooking.set('eventName', formData.eventName);
    newBooking.set('organizationId', formData.organizationId.toString());
    newBooking.set('venueId', formData.venueId.toString());
    newBooking.set('startTime', formData.startTime.toISOString());
    newBooking.set('endTime', formData.endTime.toISOString());
    newBooking.set('addToCalendar', formData.addToCalendar.toString());

    createBookingAction(newBooking);
    setSelectedTimeRange(null);
  };

  const handleEditSubmit = (formData: z.input<typeof NewBookingSchema>) => {
    if (!selectedBooking) return;

    if (hasClash({ ...formData, id: selectedBooking.id })) {
      setShowClashWarning(true);
      return;
    }

    const editBooking = new FormData();
    editBooking.set('id', selectedBooking.id.toString());
    editBooking.set('eventName', formData.eventName);
    editBooking.set('organizationId', formData.organizationId.toString());
    editBooking.set('venueId', formData.venueId.toString());
    editBooking.set('startTime', formData.startTime.toISOString());
    editBooking.set('endTime', formData.endTime.toISOString());
    editBooking.set('addToCalendar', formData.addToCalendar.toString());

    editBookingAction(editBooking);

    setSelectedBooking(null);
  };

  const handleSubmit = (formData: z.input<typeof NewBookingSchema>) => {
    if (!isAuthenticated) {
      toast.error(
        selectedBooking === null
          ? 'Please login to make a booking!'
          : 'Please login to edit bookings!',
      );
      return;
    }
    const handle =
      selectedBooking === null ? handleCreateSubmit : handleEditSubmit;
    handle(formData);
  };

  const handleDeleteBooking = (bookingId: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to delete bookings!');
      return;
    }

    const deleteBooking = new FormData();
    deleteBooking.set('id', bookingId.toString());
    deleteBookingAction(deleteBooking);
    setSelectedBooking(null);
  };

  const handleMouseUp = () => {
    if (dragStart && dragEnd) {
      // Calculate start and end times from drag
      const startIndex = Math.min(
        timeToIndex(dragStart.time),
        timeToIndex(dragEnd.time),
      );
      const endIndex =
        Math.max(timeToIndex(dragStart.time), timeToIndex(dragEnd.time)) + 1;

      const startTime = new Date(date);
      startTime.setHours(startIndex);

      const endTime = new Date(date);
      endTime.setHours(endIndex);

      setSelectedTimeRange({
        // Use the room from dragStart (column where user started dragging)
        venue: dragStart.venue,
        startTime,
        endTime,
      });
      form.setValue('venueId', dragStart.venue.id);
      form.setValue('startTime', startTime);
      form.setValue('endTime', endTime);

      // Reset drag state
      setDragStart(null);
      setDragEnd(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setSelectedTimeRange(null);
    setShowClashWarning(false);
    form.reset({
      eventName: '',
      organizationId: 0,
      venueId: 0,
      startTime: today,
      endTime: addHours(today, 2),
      addToCalendar: false,
    });
  };

  // Track mouse position for positioning the hover card
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const form = useForm<z.input<typeof NewBookingSchema>>({
    resolver: standardSchemaResolver(NewBookingSchema),
    defaultValues: {
      eventName: '',
      organizationId: 0,
      venueId: 0,
      startTime: today,
      endTime: addHours(today, 2),
      addToCalendar: false,
    },
  });

  const [selectStartDayOpen, setSelectStartDayOpen] = useState(false);
  const [selectEndDayOpen, setSelectEndDayOpen] = useState(false);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Warning */}
      {showClashWarning && (
        <div className='animate-fadeIn fixed inset-x-0 top-20 z-[9999] bg-[#FFE9E3] px-3 py-4 text-center text-sm font-medium text-[#FF7D4E] shadow-lg'>
          THERE IS A CLASH IN BOOKINGS. PLEASE SELECT A DIFFERENT VENUE OR
          TIMING & RESUBMIT.
        </div>
      )}

      <div className='flex flex-col bg-[#0C2C47] lg:flex-row'>
        {/* TODO: How do mobile people select dates? */}
        {/* Calendar - Hidden on mobile */}
        <div className='hidden w-72 rounded-lg bg-white p-4 lg:block'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={(newDate) => {
              const params = new URLSearchParams(searchParams.toString());
              // TODO: Remove newDate!.toString()
              params.set('date', newDate!.toDateString());
              window.history.pushState(null, '', `?${params.toString()}`);
            }}
            className='w-full rounded-md'
            showOutsideDays={false}
          />
        </div>

        {/* Timetable - Full width on mobile */}
        <div className='mt-10 flex-1 overflow-auto px-2 lg:ml-8 lg:px-0'>
          <div className='flex'>
            {/* Time labels column */}
            <div className='flex w-10 flex-col text-right lg:w-14'>
              <div className='h-8'></div>
              {TIMETABLE_TIMESLOTS.map((time) => (
                <div
                  key={time}
                  className='relative flex h-12 items-center justify-end pr-2 text-xs text-white lg:text-sm'
                >
                  {time}
                  {/* White connecting line */}
                  <div className='absolute right-0 top-1/2 h-px w-2 bg-white'></div>
                </div>
              ))}
            </div>

            {/* Scrollable container for room timetables */}
            <div className='flex-1 overflow-x-auto'>
              <div className='flex gap-1' onMouseUp={handleMouseUp}>
                {/* TODO: Currently not really index */}
                {venues.map((venue) => (
                  <VenueTimetable
                    key={venue.id}
                    // TODO: Update below
                    venue={venue}
                    bookings={bookings}
                    dragStart={dragStart}
                    dragEnd={dragEnd}
                    date={date}
                    handleBookingClick={(booking) => {
                      setSelectedBooking(booking);
                      form.setValue('eventName', booking.eventName);
                      form.setValue('organizationId', booking.bookedBy.org.id);
                      form.setValue('venueId', booking.venue.id);
                      form.setValue('startTime', booking.start);
                      form.setValue('endTime', booking.end);
                      form.setValue('addToCalendar', booking.isEvent);
                    }}
                    setHoveredBooking={setHoveredBooking}
                    setDragStart={setDragStart}
                    setDragEnd={setDragEnd}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      <Form {...form}>
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseModal();
          }}
        >
          <DialogContent aria-describedby={undefined}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='flex flex-col gap-2 sm:max-w-md'
            >
              <DialogHeader className='bg-[#0C2C47] text-white'>
                <DialogTitle>
                  {selectedBooking === null
                    ? 'CREATE A NEW BOOKING'
                    : 'EDIT BOOKING'}
                </DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name='eventName'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-[1fr_2fr] items-center gap-3'>
                      <FormLabel>EVENT NAME</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          id='event-name'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Enter event name'
                          className='placeholder:text-gray-500'
                          required
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='organizationId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-[1fr_2fr] items-center gap-3'>
                    <FormLabel>ORGANISATION</FormLabel>
                    <Select
                      value={
                        field.value === 0 ? undefined : field.value.toString()
                      }
                      defaultValue={''}
                      onValueChange={(value) =>
                        field.onChange(Number.parseInt(value))
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select organisation' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-background'>
                        <SelectGroup>
                          {userOrgs.length === 0 ? (
                            <SelectLabel>No venues found</SelectLabel>
                          ) : (
                            userOrgs.map(({ id, name }) => (
                              <SelectItem key={id} value={id.toString()}>
                                {name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='venueId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-[1fr_2fr] items-center gap-3'>
                    <FormLabel>VENUE</FormLabel>
                    <Select
                      value={
                        field.value === 0 ? undefined : field.value.toString()
                      }
                      defaultValue={''}
                      onValueChange={(value) =>
                        field.onChange(Number.parseInt(value))
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select venue' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-background'>
                        <SelectGroup>
                          {venues.length === 0 ? (
                            <SelectLabel>No venues found</SelectLabel>
                          ) : (
                            venues.map(({ id, name }) => (
                              <SelectItem key={id} value={id.toString()}>
                                {name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='startTime'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-[1fr_2fr] items-center gap-3'>
                    <FormLabel>START TIME</FormLabel>
                    <div className='grid grid-cols-2 gap-2'>
                      <Popover
                        open={selectStartDayOpen}
                        onOpenChange={setSelectStartDayOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant='outline' id='date'>
                              {field.value
                                ? dateTimeFormatter.format(field.value)
                                : 'Select date'}
                              <CalendarIcon />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            captionLayout='dropdown'
                            selected={field.value}
                            onSelect={(selectedDate) => {
                              if (selectedDate) {
                                field.value.setFullYear(
                                  selectedDate.getFullYear(),
                                  selectedDate.getMonth(),
                                  selectedDate.getDate(),
                                );
                                field.onChange(field.value);
                              }
                            }}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type='time'
                        value={formatTime(field.value)}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value
                            .split(':')
                            .map(Number);
                          field.value.setHours(hours, minutes);
                          field.onChange(field.value);
                        }}
                        className='appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                        step={1800}
                      />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endTime'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-[1fr_2fr] items-center gap-3'>
                    <FormLabel>END TIME</FormLabel>
                    <div className='grid grid-cols-2 gap-2'>
                      <Popover
                        open={selectEndDayOpen}
                        onOpenChange={setSelectEndDayOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant='outline' id='date'>
                              {field.value
                                ? dateTimeFormatter.format(field.value)
                                : 'Select date'}
                              <CalendarIcon />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            captionLayout='dropdown'
                            selected={field.value}
                            onSelect={(selectedDate) => {
                              if (selectedDate) {
                                field.value.setFullYear(
                                  selectedDate.getFullYear(),
                                  selectedDate.getMonth(),
                                  selectedDate.getDate(),
                                );
                                field.onChange(field.value);
                              }
                            }}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type='time'
                        value={formatTime(field.value)}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value
                            .split(':')
                            .map(Number);
                          field.value.setHours(hours, minutes);
                          field.onChange(field.value);
                        }}
                        className='appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                        step={1800}
                      />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='addToCalendar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center gap-3'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>
                      <FormLabel>ADD TO EVENTS CALENDAR</FormLabel>
                    </div>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className='sm:justify-between'>
                {selectedBooking !== null && (
                  <Button
                    variant='destructive'
                    size='icon'
                    className='rounded-[5px] border-none bg-[#FF7D4E] px-6 text-white hover:bg-[#FF7D4E]/90'
                    onClick={(e) => {
                      handleDeleteBooking(selectedBooking.id);
                      e.preventDefault();
                    }}
                  >
                    <Trash2Icon />
                  </Button>
                )}

                <div className='ml-auto flex gap-2'>
                  <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                  </DialogClose>
                  <Button
                    type='submit'
                    className='rounded-[5px] border-none bg-[#FF7D4E] px-4 text-white hover:bg-[#FF7D4E]/90'
                  >
                    Submit
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Form>

      {/* Hover card portal */}
      {hoveredBooking && (
        <CardPortal>
          <div
            style={{
              position: 'fixed',
              top: 'var(--mouse-y)',
              left: 'var(--mouse-x)',
              transform: 'translate(20px, -50%)',
            }}
          >
            <EventCard
              eventName={hoveredBooking.eventName}
              organization={hoveredBooking.bookedBy.org.name}
              date={format(hoveredBooking.start, 'd MMMM')}
              time={`${hoveredBooking.start} - ${hoveredBooking.end}`}
              venue={hoveredBooking.venue.name}
            />
          </div>
        </CardPortal>
      )}
    </>
  );
}
