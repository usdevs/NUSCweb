'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import { getAuthCookie, hasOrgPerms } from '@/lib/auth/server';
import prisma from '@/lib/prisma';
import {
  DeleteEventSchema,
  EditEventSchema,
  NewEventSchema,
} from '@/lib/schema/event';

type CreateEventState = {
  success: boolean;
  message: string;
} | null;

export const createEvent = async (
  _prevState: CreateEventState,
  formData: FormData,
): Promise<CreateEventState> => {
  const token = await getAuthCookie();
  if (!token) {
    return {
      success: false,
      message: 'Please login!',
    };
  }

  let data;
  try {
    data = NewEventSchema.parse(Object.fromEntries(formData));
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

  // Ensure user has the permissions for the corresponding organisation
  if (!hasOrgPerms(token, data.organizationId)) {
    return {
      success: false,
      message: 'You do not belong to the organisation!',
    };
  }

  try {
    await prisma.event.create({
      data: {
        eventName: data.eventName,
        userId: token.userId,
        // TODO: userOrgId isn't technically correct right now
        // especially if an admin is booking for another IG
        userOrgId: data.organizationId,
        bookedForOrgId: data.organizationId,
        start: data.startTime,
        end: data.endTime,
      },
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      success: false,
      message: 'Error creating event!',
    };
  }

  revalidatePath('/events');

  return {
    success: true,
    message: 'Successfully created event!',
  };
};

type EditEventState = {
  success: boolean;
  message: string;
} | null;

export const editEvent = async (
  _prevState: EditEventState,
  formData: FormData,
): Promise<EditEventState> => {
  const token = await getAuthCookie();
  if (!token) {
    return {
      success: false,
      message: 'Please login!',
    };
  }

  let data;
  try {
    data = EditEventSchema.parse(Object.fromEntries(formData));
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

  const origEvent = await prisma.event.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!origEvent) {
    return {
      success: false,
      message: 'Invalid booking!',
    };
  }

  // Ensure user has the permissions for the corresponding organisations
  if (
    !hasOrgPerms(token, data.organizationId) ||
    !hasOrgPerms(token, origEvent.bookedForOrgId)
  ) {
    return {
      success: false,
      message: 'You do not belong to the organisation!',
    };
  }

  try {
    await prisma.event.update({
      where: { id: data.id },
      // TODO: Stopped here
      data: {
        eventName: data.eventName,
        userId: token.userId,
        // TODO: userOrgId isn't technically correct right now
        // especially if an admin is booking for another IG
        userOrgId: data.organizationId,
        bookedForOrgId: data.organizationId,
        start: data.startTime,
        end: data.endTime,
      },
    });
  } catch (error) {
    console.error('Error editing event:', error);
    return {
      success: false,
      message: 'Error editing event!',
    };
  }

  revalidatePath('/events');

  return {
    success: true,
    message: 'Successfully edited event!',
  };
};

type DeleteEventState = {
  success: boolean;
  message: string;
} | null;

export const deleteEvent = async (
  _prevState: DeleteEventState,
  formData: FormData,
): Promise<DeleteEventState> => {
  const token = await getAuthCookie();
  if (!token) {
    return {
      success: false,
      message: 'Please login!',
    };
  }

  let data;
  try {
    data = DeleteEventSchema.parse(Object.fromEntries(formData));
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

  const origEvent = await prisma.event.findUnique({
    where: { id: data.id },
  });

  if (!origEvent) {
    return {
      success: false,
      message: 'Invalid event!',
    };
  }

  // Ensure user has the permissions for the corresponding organisation
  if (!hasOrgPerms(token, origEvent.bookedForOrgId)) {
    return {
      success: false,
      message: 'You do not belong to the organisation!',
    };
  }

  // TODO: Change this to soft delete instead
  try {
    await prisma.event.delete({
      where: { id: data.id },
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      message: 'Error deleting event!',
    };
  }

  revalidatePath('/events');

  return {
    success: true,
    message: 'Successfully deleted event!',
  };
};
