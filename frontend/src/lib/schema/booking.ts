import { z } from 'zod/v4';

export const NewBookingSchema = z.object({
  eventName: z.string().nonempty(),
  organizationId: z.coerce.number<number>().int().positive(),
  venueId: z.coerce.number<number>().int().positive(),
  startTime: z.coerce.date<Date>(),
  endTime: z.coerce.date<Date>(),
  addToCalendar: z.coerce.boolean<boolean>(),
});

export const DeleteBookingSchema = z.object({
  id: z.coerce.number<number>().int().positive(),
});

export const EditBookingSchema = z.object({
  ...NewBookingSchema.shape,
  ...DeleteBookingSchema.shape,
});
