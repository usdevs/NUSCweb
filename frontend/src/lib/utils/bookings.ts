import prisma from '../prisma';

export const getBookings = async () =>
  prisma.booking.findMany({
    select: {
      id: true,
      eventName: true,
      start: true,
      end: true,
      venue: { select: { id: true, name: true } },
      bookedBy: { select: { org: { select: { name: true } } } },
    },
  });

export type BookingView = Awaited<ReturnType<typeof getBookings>>[number];
