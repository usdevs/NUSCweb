import prisma from '@/lib/prisma';

export type GetBookingsParams = {
  bookingName?: string;
  start?: Date;
  end?: Date;
  venue?: string;
  organisation?: string;
};

export const getBookings = async (params: GetBookingsParams = {}) => {
  const { bookingName, start, end, venue, organisation } = params;

  const where: any = {
    deleted: false,
  };

  if (bookingName) {
    where.bookingName = { contains: bookingName, mode: 'insensitive' };
  }

  if (start) {
    where.start = { gte: start };
  }

  if (end) {
    where.end = { lte: end };
  }

  if (venue) {
    where.venue = { name: { contains: venue, mode: 'insensitive' } };
  }

  if (organisation) {
    where.bookedForOrg = {
      name: { contains: organisation, mode: 'insensitive' },
    };
  }

  return prisma.booking.findMany({
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
};

export type BookingView = Awaited<ReturnType<typeof getBookings>>[number];
