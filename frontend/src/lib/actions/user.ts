'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import type { ServerActionState } from '@/lib/actions';
import { getAuthCookie } from '@/lib/auth/server';
import prisma from '@/lib/prisma';
import { DeleteUserSchema, EditUserSchema } from '@/lib/schema/user';
import { formDataToObject } from '@/lib/utils';

export const editUser = async (
  _prevState: ServerActionState,
  formData: FormData,
): Promise<ServerActionState> => {
  const token = await getAuthCookie();
  if (!token) {
    return {
      success: false,
      message: 'Please login!',
    };
  }

  // Only overall admins are allowed to edit users
  if (!token.isAdmin) {
    return {
      success: false,
      message: 'You are not allowed to edit users!',
    };
  }

  let data: z.output<typeof EditUserSchema>;
  try {
    data = EditUserSchema.parse(formDataToObject(formData));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: z.prettifyError(error),
      };
    }
    return {
      success: false,
      message: 'Unknown error occurred. Please contact admin.',
    };
  }

  try {
    await prisma.userOnOrg.createMany({
      data: data.organisationIds.map((orgId) => ({ userId: data.id, orgId })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error('Error editing user:', error);
    return {
      success: false,
      message: 'Error editing user!',
    };
  }

  revalidatePath('/admin/users');

  return {
    success: true,
    message: 'Successfully edited user!',
  };
};

export const deleteUser = async (
  _prevState: ServerActionState,
  formData: FormData,
): Promise<ServerActionState> => {
  const token = await getAuthCookie();
  if (!token) {
    return {
      success: false,
      message: 'Please login!',
    };
  }

  // Only overall admins are allowed to delete users
  if (!token.isAdmin) {
    return {
      success: false,
      message: 'You are not allowed to delete users!',
    };
  }

  let data;
  try {
    data = DeleteUserSchema.parse(formDataToObject(formData));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: z.prettifyError(error),
      };
    }
    return {
      success: false,
      message: 'Unknown error occurred. Please contact admin.',
    };
  }

  try {
    await prisma.user.delete({
      where: { id: data.id },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'Error deleting user!',
    };
  }

  revalidatePath('/admin/users');

  return {
    success: true,
    message: 'Successfully deleted user!',
  };
};
