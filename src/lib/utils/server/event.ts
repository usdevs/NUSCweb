import prisma from '@/lib/prisma';

export type GetEventsParams = {
  eventName?: string;
  organisation?: string;
  start?: Date;
  end?: Date;
  venue?: string;
};

export const getEvents = async (params: GetEventsParams = {}) => {
  const { eventName, organisation, start, end, venue } = params;

  const where: any = {
    deleted: false,
  };

  if (eventName) {
    where.eventName = { contains: eventName, mode: 'insensitive' };
  }

  if (organisation) {
    where.bookedForOrg = { name: { contains: organisation, mode: 'insensitive' } };
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

  return prisma.event.findMany({
    where,
    select: {
      id: true,
      eventName: true,
      bookedForOrg: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
      booking: {
        select: {
          venue: {
            select: {
              name: true,
            },
          },
        },
      },
      start: true,
      end: true,
    },
  })};

export type EventView = Awaited<ReturnType<typeof getEvents>>[number];
