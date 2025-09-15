import { IGCategory } from '@prisma/client';
import { z } from 'zod/v4';

export const NewOrganisationClientSchema = z.object({
  name: z.string().nonempty(),
  description: z.optional(z.string()),
  isAdminOrg: z.coerce.boolean<boolean>(),
  telegramUrl: z.optional(z.string()),
  category: z.enum(IGCategory),
});

export const NewOrganisationServerSchema = NewOrganisationClientSchema.extend({
  isAdminOrg: z.stringbool(),
});

export const DeleteOrganisationSchema = z.object({
  id: z.coerce.number<number>().int().positive(),
});

export const EditOrganisationClientSchema = z.object({
  ...NewOrganisationClientSchema.shape,
  ...DeleteOrganisationSchema.shape,
});

export const EditOrganisationServerSchema = EditOrganisationClientSchema.extend(
  { isAdminOrg: z.stringbool() },
);
