import { NextRequest, NextResponse } from 'next/server';
import { getBookings } from '@/lib/utils/server/booking';
import { BookingQuerySchema } from '@/lib/schema/booking';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const rawParams = Object.fromEntries(searchParams.entries());
    const parsed = BookingQuerySchema.parse(rawParams);
    let bookings = await getBookings(parsed);


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
