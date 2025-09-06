import prisma from '../../prisma';

export const getVenues = async () =>
  prisma.venue.findMany({
    select: {
      id: true,
      name: true,
    },
  });

export type VenueView = Awaited<ReturnType<typeof getVenues>>[number];
