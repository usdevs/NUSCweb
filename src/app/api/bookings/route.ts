import { NextRequest, NextResponse } from 'next/server';
import { getBookings } from '@/lib/utils/server/booking';

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
        (booking: { bookedForOrg: { name: string; }; }) => booking.bookedForOrg?.name === bookingName
      );
    }

    if (start) {
      const startDate = new Date(start);
      bookings = bookings.filter(
        (booking: { start: string | number | Date; }) => new Date(booking.start) >= startDate
      );
    }

    if (end) {
      const endDate = new Date(end);
      bookings = bookings.filter(
        (booking: { end: string | number | Date; }) => new Date(booking.end) <= endDate
      );
    }

    if (venue) {
      bookings = bookings.filter(
        (booking: { venue: { name: string; }; }) => booking.venue?.name === venue
      );
    }

    if (organisation) {
      bookings = bookings.filter(
        (booking: { bookedForOrg: { name: string; }; }) => booking.bookedForOrg?.name === organisation
      );
    }

    bookings = bookings.map(({ id, bookedForOrg, venue, ...rest }: any) => ({
        ...rest,
        venue: venue?.name ?? null,
        bookedForOrg: bookedForOrg
            ? { name: bookedForOrg.name }
            : null,
    }));

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
