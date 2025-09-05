import prisma from '@/lib/prisma';
import Bookings from '../../components/booking/component';
import { getBookings } from '@/lib/utils/bookings';
import { getVenues } from '@/lib/utils/venues';

export default async function BookingsPage() {
  const bookings = await getBookings();
  const venues = await getVenues();
  // TODO: Update this based on cookies
  const userOrgs = await prisma.organisation.findMany({
    select: { id: true, name: true },
  });

  return <Bookings bookings={bookings} venues={venues} userOrgs={userOrgs} />;
}
