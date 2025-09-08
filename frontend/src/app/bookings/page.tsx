import Bookings from '@/components/booking/Bookings';
import { getAuthCookie } from '@/lib/auth/server';
import prisma from '@/lib/prisma';
import { getBookings } from '@/lib/utils/server/booking';
import { getVenues } from '@/lib/utils/server/venue';

export default async function BookingsPage() {
  const [authCookie, bookings, venues] = await Promise.all([
    getAuthCookie(),
    getBookings(),
    getVenues(),
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

  return <Bookings bookings={bookings} venues={venues} userOrgs={userOrgs} />;
}
