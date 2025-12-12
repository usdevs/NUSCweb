import prisma from '@/lib/prisma';

export const getBookings = async () =>
  prisma.booking.findMany({
    select: {
      id: true,
      bookingName: true,
      start: true,
      end: true,
      venue: { select: { id: true, name: true } },
      bookedForOrg: { select: { id: true, name: true } },
      event: true,
    },
    where: {
      deleted: false,
    },
  });

export type BookingView = Awaited<ReturnType<typeof getBookings>>[number];
