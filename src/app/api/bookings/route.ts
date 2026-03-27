import { getBookings } from '@/lib/utils/server/booking';
import { NextRequest, NextResponse } from 'next/server';

type Booking = Awaited<ReturnType<typeof getBookings>>[number];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const bookingName = url.searchParams.get('bookingName');
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    const venue = url.searchParams.get('venue');
    const organisation = url.searchParams.get('organisation');

    let bookings = await getBookings();

    if (bookingName) {
      bookings = bookings.filter(
        (booking: Booking) => booking.bookedForOrg?.name === bookingName
      );
    }

    if (start) {
      const startDate = new Date(start);
      bookings = bookings.filter(
        (booking: Booking) => new Date(booking.start) >= startDate
      );
    }

    if (end) {
      const endDate = new Date(end);
      bookings = bookings.filter(
        (booking: Booking) => new Date(booking.end) <= endDate
      );
    }

    if (venue) {
      bookings = bookings.filter(
        (booking: Booking) => booking.venue?.name === venue
      );
    }

    if (organisation) {
      bookings = bookings.filter(
        (booking: Booking) => booking.bookedForOrg?.name === organisation
      );
    }

    const mapped = bookings.map(({ id, bookedForOrg, venue, ...rest }: Booking) => ({
      ...rest,
      venue: venue?.name ?? null,
      bookedForOrg: bookedForOrg
        ? { name: bookedForOrg.name }
        : null,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}