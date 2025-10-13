'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import type { ServerActionState } from '@/lib/actions';
import { getAuthCookie, hasOrgPerms } from '@/lib/auth/server';
import prisma from '@/lib/prisma';
import {
  DeleteBookingSchema,
  EditBookingServerSchema,
  NewBookingServerSchema,
} from '@/lib/schema/booking';
import { formDataToObject } from '@/lib/utils';

// TODO: Check if organisations have exceeded their weekly limit in bookings

export const createBooking = async (
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
    data = NewBookingServerSchema.parse(formDataToObject(formData));
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

  const overlapping = await prisma.booking.findFirst({
    where: {
      venueId: data.venueId,
      start: { lt: data.endTime },
      end: { gt: data.startTime },
      deleted: false,
    },
  });
  if (overlapping) {
    return {
      success: false,
      message: 'There is an overlapping booking!',
    };
  }

  try {
    await prisma.booking.create({
      data: {
        bookingName: data.bookingName,
        venueId: data.venueId,
        userId: token.userId,
        // TODO: userOrgId isn't technically correct right now
        // especially if an admin is booking for another IG
        userOrgId: data.organisationId,
        bookedForOrgId: data.organisationId,
        start: data.startTime,
        end: data.endTime,
        event: data.addToCalendar
          ? {
              create: {
                eventName: data.bookingName,
                userId: token.userId,
                // TODO: userOrgId isn't technically correct right now
                // especially if an admin is booking for another IG
                userOrgId: data.organisationId,
                bookedForOrgId: data.organisationId,
                start: data.startTime,
                end: data.endTime,
              },
            }
          : undefined,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      message: 'Error creating booking!',
    };
  }

  revalidatePath('/bookings');

  return {
    success: true,
    message: 'Successfully created booking!',
  };
};

export const editBooking = async (
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
    data = EditBookingServerSchema.parse(formDataToObject(formData));
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

  const origBooking = await prisma.booking.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!origBooking) {
    return {
      success: false,
      message: 'Invalid booking!',
    };
  }

  // Ensure user has the permissions for the corresponding organisation
  if (
    !hasOrgPerms(token, data.organisationId) ||
    !hasOrgPerms(token, origBooking.bookedForOrgId)
  ) {
    return {
      success: false,
      message: 'You do not belong to the organisation!',
    };
  }

  const overlapping = await prisma.booking.findFirst({
    where: {
      venueId: data.venueId,
      start: { lt: data.endTime },
      end: { gt: data.startTime },
      deleted: false,
    },
  });
  if (overlapping) {
    return {
      success: false,
      message: 'There is an overlapping booking!',
    };
  }

  try {
    await prisma.booking.update({
      where: { id: data.id },
      data: {
        bookingName: data.bookingName,
        venueId: data.venueId,
        userId: token.userId,
        // TODO: userOrgId isn't technically correct right now
        // especially if an admin is booking for another IG
        userOrgId: data.organisationId,
        bookedForOrgId: data.organisationId,
        start: data.startTime,
        end: data.endTime,
        event: data.addToCalendar
          ? {
              upsert: {
                create: {
                  eventName: data.bookingName,
                  userId: token.userId,
                  // TODO: userOrgId isn't technically correct right now
                  // especially if an admin is booking for another IG
                  userOrgId: data.organisationId,
                  bookedForOrgId: data.organisationId,
                  start: data.startTime,
                  end: data.endTime,
                },
                update: {
                  eventName: data.bookingName,
                  userId: token.userId,
                  // TODO: userOrgId isn't technically correct right now
                  // especially if an admin is booking for another IG
                  userOrgId: data.organisationId,
                  bookedForOrgId: data.organisationId,
                  start: data.startTime,
                  end: data.endTime,
                },
              },
            }
          : {
              delete: true,
            },
      },
    });
  } catch (error) {
    console.error('Error editing booking:', error);
    return {
      success: false,
      message: 'Error editing booking!',
    };
  }

  revalidatePath('/bookings');

  return {
    success: true,
    message: 'Successfully edited booking!',
  };
};

export const deleteBooking = async (
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
    data = DeleteBookingSchema.parse(formDataToObject(formData));
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

  const origBooking = await prisma.booking.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!origBooking) {
    return {
      success: false,
      message: 'Invalid booking!',
    };
  }

  // Ensure user has the permissions for the corresponding organisation
  if (!hasOrgPerms(token, origBooking.bookedForOrgId)) {
    return {
      success: false,
      message: 'You do not belong to the organisation!',
    };
  }

  // TODO: Change this to soft delete instead
  try {
    await prisma.booking.delete({
      where: { id: data.id },
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return {
      success: false,
      message: 'Error deleting booking!',
    };
  }

  revalidatePath('/bookings');

  return {
    success: true,
    message: 'Successfully deleted booking!',
  };
};
