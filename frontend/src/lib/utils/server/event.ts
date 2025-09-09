import prisma from '@/lib/prisma';

export const getEvents = async () =>
  prisma.event.findMany({
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
