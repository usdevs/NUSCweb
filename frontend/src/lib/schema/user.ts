import { z } from 'zod/v4';

export const DeleteUserSchema = z.object({
  id: z.coerce.number<number>().int().positive(),
});

export const UpdateUserSchema = z.object({
  organisationIds: z.array(z.coerce.number<number>().int().positive()),
});

export const EditUserSchema = z.object({
  ...DeleteUserSchema.shape,
  ...UpdateUserSchema.shape,
});
