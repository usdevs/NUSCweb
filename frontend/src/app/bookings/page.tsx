import Bookings from '../../components/booking/component';
import { getBookings } from '@/lib/utils/bookings';
import { getVenues } from '@/lib/utils/venues';

export default async function BookingsPage() {
  const bookings = await getBookings();
  const venues = await getVenues();

  return <Bookings bookings={bookings} venues={venues} />;
}
