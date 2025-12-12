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
