import { z } from 'zod/v4';

export const DeleteUserSchema = z.object({
  id: z.coerce.number<number>().int().positive(),
});

export const UpdateUserSchema = z.object({
  organisationIds: z.array(z.coerce.number<number>().int().positive()),
});

export const EditUserClientSchema = z.object({
  ...DeleteUserSchema.shape,
  ...UpdateUserSchema.shape,
});

export const EditUserServerSchema = EditUserClientSchema.extend({
  organisationIds: z.preprocess((val) => {
    if (val === undefined) return [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (Array.isArray(val)) return val;
    return [val];
  }, z.array(z.coerce.number<number>().int().positive())),
});
