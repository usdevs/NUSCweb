import prisma from '@/lib/prisma';
import Bookings from '../../components/booking/component';
import { getBookings } from '@/lib/utils/server/bookings';
import { getVenues } from '@/lib/utils/server/venues';
import { getAuthCookie } from '@/lib/auth/server';

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
