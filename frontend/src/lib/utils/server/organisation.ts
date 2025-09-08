import prisma from '@/lib/prisma';

export const getOrganisations = async () =>
  prisma.organisation.findMany({
    where: {
      isInvisible: false,
    },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      isInactive: true,
      userOrg: {
        select: {
          user: {
            select: {
              name: true,
              telegramUserName: true,
            },
          },
        },
      },
    },
  });

export type OrganisationView = Awaited<
  ReturnType<typeof getOrganisations>
>[number];
