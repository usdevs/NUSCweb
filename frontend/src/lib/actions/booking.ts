'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import { getAuthCookie, hasOrgPerms } from '@/lib/auth/server';
import prisma from '@/lib/prisma';
import {
  DeleteBookingSchema,
  EditBookingServerSchema,
  NewBookingServerSchema,
} from '@/lib/schema/booking';

type CreateBookingState = {
  success: boolean;
  message: string;
} | null;

// TODO: Check if organisations have exceeded their weekly limit in bookings
// TODO: Check if there are clashes in bookings

export const createBooking = async (
  _prevState: CreateBookingState,
  formData: FormData,
): Promise<CreateBookingState> => {
  const token = await getAuthCookie();
  if (!token) {
    return {
      success: false,
      message: 'Please login!',
    };
  }

  let data;
  try {
    data = NewBookingServerSchema.parse(Object.fromEntries(formData));
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
    await prisma.booking.create({
      data: {
        bookingName: data.bookingName,
        venueId: data.venueId,
        userId: token.userId,
        // TODO: userOrgId isn't technically correct right now
        // especially if an admin is booking for another IG
        userOrgId: data.organizationId,
        bookedForOrgId: data.organizationId,
        start: data.startTime,
        end: data.endTime,
        event: {
          create: {
            eventName: data.bookingName,
            userId: token.userId,
            // TODO: userOrgId isn't technically correct right now
            // especially if an admin is booking for another IG
            userOrgId: data.organizationId,
            bookedForOrgId: data.organizationId,
            start: data.startTime,
            end: data.endTime,
          },
        },
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

type EditBookingState = {
  success: boolean;
  message: string;
} | null;

export const editBooking = async (
  _prevState: EditBookingState,
  formData: FormData,
): Promise<EditBookingState> => {
  const token = await getAuthCookie();
  if (!token) {
    return {
      success: false,
      message: 'Please login!',
    };
  }

  let data;
  try {
    data = EditBookingServerSchema.parse(Object.fromEntries(formData));
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
    !hasOrgPerms(token, data.organizationId) ||
    !hasOrgPerms(token, origBooking.bookedForOrgId)
  ) {
    return {
      success: false,
      message: 'You do not belong to the organisation!',
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
        userOrgId: data.organizationId,
        bookedForOrgId: data.organizationId,
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
                  userOrgId: data.organizationId,
                  bookedForOrgId: data.organizationId,
                  start: data.startTime,
                  end: data.endTime,
                },
                update: {
                  eventName: data.bookingName,
                  userId: token.userId,
                  // TODO: userOrgId isn't technically correct right now
                  // especially if an admin is booking for another IG
                  userOrgId: data.organizationId,
                  bookedForOrgId: data.organizationId,
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

type DeleteBookingState = {
  success: boolean;
  message: string;
} | null;

export const deleteBooking = async (
  _prevState: DeleteBookingState,
  formData: FormData,
): Promise<DeleteBookingState> => {
  const token = await getAuthCookie();
  if (!token) {
    return {
      success: false,
      message: 'Please login!',
    };
  }

  let data;
  try {
    data = DeleteBookingSchema.parse(Object.fromEntries(formData));
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
