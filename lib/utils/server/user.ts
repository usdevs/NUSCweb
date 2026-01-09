import prisma from '@/lib/prisma';

export const getUsers = async () =>
  prisma.user.findMany({
    select: {
      id: true,
      name: true,
      telegramId: true,
      telegramUserName: true,
      userOrgs: {
        select: {
          org: true,
        },
      },
    },
  });

export type UserView = Awaited<ReturnType<typeof getUsers>>[number];
