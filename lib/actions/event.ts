'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import type { ServerActionState } from '@/lib/actions';
import { getAuthCookie, hasOrgPerms } from '@/lib/auth/server';
import prisma from '@/lib/prisma';
import {
  DeleteEventSchema,
  EditEventSchema,
  NewEventSchema,
} from '@/lib/schema/event';
import { formDataToObject } from '@/lib/utils';

export const createEvent = async (
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
    data = NewEventSchema.parse(formDataToObject(formData));
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
  if (!hasOrgPerms(token, data.organisationId)) {
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
        userOrgId: data.organisationId,
        bookedForOrgId: data.organisationId,
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

export const editEvent = async (
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
    data = EditEventSchema.parse(formDataToObject(formData));
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
    !hasOrgPerms(token, data.organisationId) ||
    !hasOrgPerms(token, origEvent.bookedForOrgId)
  ) {
    return {
      success: false,
      message: 'You do not belong to the organisation!',
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const { booking } = await tx.event.update({
        where: { id: data.id },
        data: {
          eventName: data.eventName,
          userId: token.userId,
          // TODO: userOrgId isn't technically correct right now
          // especially if an admin is booking for another IG
          userOrgId: data.organisationId,
          bookedForOrgId: data.organisationId,
          start: data.startTime,
          end: data.endTime,
        },
        include: { booking: true },
      });
      if (booking)
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            bookingName: data.eventName,
            userId: token.userId,
            // TODO: userOrgId isn't technically correct right now
            // especially if an admin is booking for another IG
            userOrgId: data.organisationId,
            bookedForOrgId: data.organisationId,
            start: data.startTime,
            end: data.endTime,
          },
        });
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

export const deleteEvent = async (
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
    data = DeleteEventSchema.parse(formDataToObject(formData));
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
    await prisma.$transaction(async (tx) => {
      const { booking } = await tx.event.delete({
        where: { id: data.id },
        select: { booking: { select: { id: true } } },
      });
      if (booking)
        await tx.booking.delete({
          where: { id: booking.id },
        });
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
