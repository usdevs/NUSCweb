'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import prisma from '@/lib/prisma';

const NewBookingSchema = z.object({
  eventName: z.string().nonempty(),
  organization: z.string(),
  venue: z.string(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
});

type CreateBookingState = {
  success: boolean;
  message: string;
} | null;

export async function createBooking(
  _prevState: CreateBookingState,
  formData: FormData,
): Promise<CreateBookingState> {
  const createBookingFormData = Object.fromEntries(formData);

  let data;
  try {
    data = NewBookingSchema.parse(createBookingFormData);
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
}

export async function deleteBooking(id: number) {
  await prisma.booking.delete({
    where: { id },
  });

  revalidatePath('/bookings');
}
