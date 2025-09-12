import Events from '@/components/event/Events';
import { getAuthCookie } from '@/lib/auth/server';
import prisma from '@/lib/prisma';
import { getEvents } from '@/lib/utils/server/event';

export default async function EventsPage() {
  const [authCookie, events] = await Promise.all([
    getAuthCookie(),
    getEvents(),
  ]);

  const userOrgs = authCookie
    ? (
        await prisma.userOnOrg.findMany({
          where: { userId: authCookie.userId },
          select: {
            org: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })
      ).map((userOrg) => userOrg.org)
    : [];

  return <Events events={events} userOrgs={userOrgs} />;
}
