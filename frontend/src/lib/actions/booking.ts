'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateCookie } from '@/lib/utils/jwt';

const NewBookingSchema = z.object({
  eventName: z.string().nonempty(),
  organizationId: z.coerce.number().int().positive(),
  venueId: z.coerce.number().int().positive(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  addToCalendar: z.coerce.boolean(),
});

// TODO: Check for sufficient permissions before creating/editing/deleting
// TODO: Abstract token checking to separate function

type CreateBookingState = {
  success: boolean;
  message: string;
} | null;

export const createBooking = async (
  _prevState: CreateBookingState,
  formData: FormData,
): Promise<CreateBookingState> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth');
  if (!token) {
    return {
      success: false,
      message: 'Please log in!',
    };
  }
  try {
    validateCookie(token.value);
  } catch {
    // Invalid cookie, or expired
    cookieStore.delete('auth');
    return {
      success: false,
      message: 'Please log in!',
    };
  }

  let data;
  try {
    data = NewBookingSchema.parse(Object.fromEntries(formData));
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
    await prisma.booking.create({
      data: {
        eventName: data.eventName,
        start: data.startTime,
        end: data.endTime,
      },
    });
  } catch {
    return {
      success: false,
      message: 'Booking creation failed',
    };
  }

  revalidatePath('/bookings');

  return {
    success: true,
    message: 'Booking created!',
  };
};

const EditBookingSchema = NewBookingSchema.extend({
  id: z.coerce.number().int().positive(),
});

type EditBookingState = {
  success: boolean;
  message: string;
} | null;

export const editBooking = async (
  _prevState: EditBookingState,
  formData: FormData,
): Promise<EditBookingState> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth');
  if (!token) {
    return {
      success: false,
      message: 'Please log in!',
    };
  }
  try {
    validateCookie(token.value);
  } catch {
    // Invalid cookie, or expired
    cookieStore.delete('auth');
    return {
      success: false,
      message: 'Please log in!',
    };
  }

  revalidatePath('/bookings');

  return {
    success: true,
    message: 'Booking edited!',
  };
};

export const deleteBooking = async (id: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth');
  if (!token) {
    return {
      success: false,
      message: 'Please log in!',
    };
  }
  try {
    validateCookie(token.value);
  } catch {
    // Invalid cookie, or expired
    cookieStore.delete('auth');
    return {
      success: false,
      message: 'Please log in!',
    };
  }

  await prisma.booking.delete({
    where: { id },
  });

  revalidatePath('/bookings');
};
