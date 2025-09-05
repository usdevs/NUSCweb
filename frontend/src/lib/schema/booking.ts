import { z } from 'zod/v4';

export const NewBookingSchema = z.object({
  eventName: z.string().nonempty(),
  organizationId: z.number().int().positive(),
  venueId: z.number().int().positive(),
  startTime: z.date(),
  endTime: z.date(),
  addToCalendar: z.boolean(),
});

export const EditBookingSchema = NewBookingSchema.extend({
  id: z.number().int().positive(),
});
