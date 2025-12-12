'use client';

import { CalendarIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import z from 'zod/v4';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NewEventSchema } from '@/lib/schema/event';
import { dateTimeFormatter } from '@/lib/utils/client/time';
import type { EventView } from '@/lib/utils/server/event';

const formatTime = (d: Date) =>
  d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

interface EventModalProps {
  form: UseFormReturn<z.input<typeof NewEventSchema>>;
  selectedEvent: EventView | null;
  isOpen: boolean;
  userOrgs: {
    id: number;
    name: string;
  }[];
  handleDeleteEvent: (eventId: number) => void;
  handleSubmitEvent: (formData: z.input<typeof NewEventSchema>) => void;
  handleClose: () => void;
  isPending: boolean;
}

export default function EventModal({
  form,
  isOpen,
  selectedEvent,
  userOrgs,
  handleDeleteEvent,
  handleSubmitEvent,
  handleClose,
  isPending,
}: EventModalProps) {
  const [selectStartDayOpen, setSelectStartDayOpen] = useState(false);
  const [selectEndDayOpen, setSelectEndDayOpen] = useState(false);

  return (
    <Form {...form}>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent aria-describedby={undefined}>
          <form
            onSubmit={form.handleSubmit(handleSubmitEvent)}
            className={`flex flex-col gap-3 sm:max-w-md`}
          >
            <DialogHeader className='bg-[#0C2C47] text-white'>
              <DialogTitle>
                {selectedEvent === null ? 'CREATE A NEW EVENT' : 'EDIT EVENT'}
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
              name='organisationId'
              render={({ field }) => (
                <FormItem
                  className={`grid grid-cols-[1fr_2fr] items-center gap-3`}
                >
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
                      <SelectTrigger className='[margin-block-end:0]'>
                        <SelectValue placeholder='Select organisation' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-background'>
                      <SelectGroup>
                        {userOrgs.length === 0 ? (
                          <SelectLabel>No organisations found</SelectLabel>
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
              name='startTime'
              render={({ field }) => (
                <FormItem
                  className={`grid grid-cols-[1fr_2fr] items-center gap-3`}
                >
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
                      <PopoverContent className='w-60 p-0' align='start'>
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
                            setSelectStartDayOpen(false);
                          }}
                          className='w-full'
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
                      className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none`}
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
                <FormItem
                  className={`grid grid-cols-[1fr_2fr] items-center gap-3`}
                >
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
                      <PopoverContent className='w-60 p-0' align='start'>
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
                              setSelectEndDayOpen(false);
                            }
                          }}
                          className='w-full'
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
                      className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none`}
                      step={1800}
                    />
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter className='sm:justify-between'>
              {selectedEvent !== null && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='destructive'
                      size='icon'
                      className={`rounded-[5px] border-none bg-[#FF7D4E] px-6 text-white hover:bg-[#FF7D4E]/90`}
                      disabled={isPending}
                    >
                      <Trash2Icon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the event "{selectedEvent.eventName}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          handleDeleteEvent(selectedEvent.id);
                          e.preventDefault();
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <div className='ml-auto flex gap-2'>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button
                  type='submit'
                  className={`rounded-[5px] border-none bg-[#FF7D4E] px-4 text-white hover:bg-[#FF7D4E]/90`}
                  disabled={isPending}
                >
                  Submit
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
