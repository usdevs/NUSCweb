import { z } from 'zod/v4';

export const NewBookingClientSchema = z.object({
  bookingName: z.string().nonempty(),
  organisationId: z.coerce.number<number>().int().positive(),
  venueId: z.coerce.number<number>().int().positive(),
  startTime: z.coerce.date<Date>(),
  endTime: z.coerce.date<Date>(),
  addToCalendar: z.coerce.boolean<boolean>(),
});

export const NewBookingServerSchema = NewBookingClientSchema.extend({
  addToCalendar: z.stringbool(),
});

export const DeleteBookingSchema = z.object({
  id: z.coerce.number<number>().int().positive(),
});

export const EditBookingClientSchema = z.object({
  ...NewBookingClientSchema.shape,
  ...DeleteBookingSchema.shape,
});

export const EditBookingServerSchema = EditBookingClientSchema.extend({
  addToCalendar: z.stringbool(),
});

export const BookingQuerySchema = z
  .object({
    bookingName: z.string().min(1).optional(),
    organisation: z.string().min(1).optional(),
    venue: z.string().min(1).optional(),

    start: z.coerce.date().optional(),
    end: z.coerce.date().optional(),
  })
  .refine((data) => !data.start || !data.end || data.start <= data.end, {
    message: 'start must be before end',
    path: ['start'],
  });
