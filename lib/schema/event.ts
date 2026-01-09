import { z } from 'zod/v4';

export const NewEventSchema = z.object({
  eventName: z.string().nonempty(),
  organisationId: z.coerce.number<number>().int().positive(),
  startTime: z.coerce.date<Date>(),
  endTime: z.coerce.date<Date>(),
});

export const DeleteEventSchema = z.object({
  id: z.coerce.number<number>().int().positive(),
});

export const EditEventSchema = z.object({
  ...NewEventSchema.shape,
  ...DeleteEventSchema.shape,
});

export const EventQuerySchema = z
  .object({
    eventName: z.string().min(1).optional(),
    organisation: z.string().min(1).optional(),
    venue: z.string().min(1).optional(),
    start: z.coerce.date().optional(),
    end: z.coerce.date().optional(),
  })
  .refine((d) => !d.start || !d.end || d.start <= d.end, {
    message: 'start must be before end',
    path: ['start'],
  });
