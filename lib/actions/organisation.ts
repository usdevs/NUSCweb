'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import type { ServerActionState } from '@/lib/actions';
import { getAuthCookie, hasOrgPerms } from '@/lib/auth/server';
import prisma from '@/lib/prisma';
import {
  DeleteOrganisationSchema,
  EditOrganisationServerSchema,
  NewOrganisationServerSchema,
} from '@/lib/schema/organisation';
import { formDataToObject } from '@/lib/utils';

export const createOrganisation = async (
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

  // Only overall admins are allowed to create organisations
  if (!token.isAdmin) {
    return {
      success: false,
      message: 'You are not allowed to create organisations!',
    };
  }

  let data;
  try {
    data = NewOrganisationServerSchema.parse(formDataToObject(formData));
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
    await prisma.organisation.create({ data });
  } catch (error) {
    console.error('Error creating organisation:', error);
    return {
      success: false,
      message: 'Error creating organisation!',
    };
  }

  revalidatePath('/admin/organisations');

  return {
    success: true,
    message: 'Successfully created organisation!',
  };
};

export const editOrganisation = async (
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

  let data;
  try {
    data = EditOrganisationServerSchema.parse(formDataToObject(formData));
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

  if (!hasOrgPerms(token, data.id)) {
    return {
      success: false,
      message: 'You do not belong to the organisation!',
    };
  }

  if (!token.isAdmin && data.isAdminOrg) {
    return {
      success: false,
      message: 'You cannot promote your organisation to an admin organisation!',
    };
  }

  try {
    await prisma.organisation.update({
      where: { id: data.id },
      data,
    });
  } catch (error) {
    console.error('Error editing organisation:', error);
    return {
      success: false,
      message: 'Error editing organisation!',
    };
  }

  revalidatePath('/admin/organisations');

  return {
    success: true,
    message: 'Successfully edited organisation!',
  };
};

export const deleteOrganisation = async (
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

  // Only overall admins are allowed to delete organisations
  if (!token.isAdmin) {
    return {
      success: false,
      message: 'You are not allowed to delete organisations!',
    };
  }

  let data;
  try {
    data = DeleteOrganisationSchema.parse(formDataToObject(formData));
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
    await prisma.organisation.delete({
      where: { id: data.id },
    });
  } catch (error) {
    console.error('Error deleting organisation:', error);
    return {
      success: false,
      message: 'Error deleting organisation!',
    };
  }

  revalidatePath('/admin/organisations');

  return {
    success: true,
    message: 'Successfully deleted organisation!',
  };
};
