import prisma from '@/lib/prisma';

export type GetBookingsParams = {
  bookingName?: string;
  start?: Date;
  end?: Date;
  venue?: string;
  organisation?: string;
};

export const getBookings = async ({
  bookingName,
  start,
  end,
  venue,
  organisation,
}: GetBookingsParams = {}) =>
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
      bookingName: bookingName
        ? { contains: bookingName, mode: 'insensitive' }
        : undefined,
      start: start ? { gte: start } : undefined,
      end: end ? { lte: end } : undefined,
      venue: venue
        ? { name: { contains: venue, mode: 'insensitive' } }
        : undefined,
      bookedForOrg: organisation
        ? { name: { contains: organisation, mode: 'insensitive' } }
        : undefined,
    },
  });
export type BookingView = Awaited<ReturnType<typeof getBookings>>[number];
