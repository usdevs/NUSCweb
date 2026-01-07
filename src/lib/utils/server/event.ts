import prisma from '@/lib/prisma';

export type GetEventsParams = {
  eventName?: string;
  organisation?: string;
  start?: Date;
  end?: Date;
  venue?: string;
};

export const getEvents = async ({
  eventName,
  organisation,
  start,
  end,
  venue,
}: GetEventsParams = {}) =>
  prisma.event.findMany({
    where: {
      deleted: false,
      eventName: eventName
        ? { contains: eventName, mode: 'insensitive' }
        : undefined,
      bookedForOrg: organisation
        ? {
            name: { contains: organisation, mode: 'insensitive' },
          }
        : undefined,
      start: start ? { gte: start } : undefined,
      end: end ? { lte: end } : undefined,
      booking: venue ? { venue: { name: venue } } : undefined,
    },
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
  });

export type EventView = Awaited<ReturnType<typeof getEvents>>[number];
