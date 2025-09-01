import prisma from '@/lib/prisma';
import Bookings from './component';

const getBookings = async () =>
  prisma.booking.findMany({
    select: {
      id: true,
      eventName: true,
      start: true,
      end: true,
      venue: { select: { name: true } },
      bookedBy: { select: { org: { select: { name: true } } } },
    },
  });

export default async function BookingsPage() {
  const bookings = await getBookings();

  return <Bookings bookings={bookings} />;
}

export type BookingView = Awaited<ReturnType<typeof getBookings>>[number];
