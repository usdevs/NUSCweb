import { NextRequest, NextResponse } from 'next/server';
import { getBookings } from '@/lib/utils/server/booking';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const bookingName = searchParams.get('bookingName');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const venue = searchParams.get('venue');
    const organisation = searchParams.get('organisation');

    let bookings = await getBookings({
      bookingName: searchParams.get('bookingName') ?? undefined,
      organisation: searchParams.get('organisation') ?? undefined,
      venue: searchParams.get('venue') ?? undefined,
      start: searchParams.get('start')
        ? new Date(searchParams.get('start')!)
        : undefined,
      end: searchParams.get('end')
        ? new Date(searchParams.get('end')!)
        : undefined,
    });

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
