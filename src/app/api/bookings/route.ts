import { NextRequest, NextResponse } from 'next/server';

import { BookingQuerySchema } from '@/lib/schema/booking';
import { getBookings } from '@/lib/utils/server/booking';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const parsed = BookingQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    );
    const bookings = await getBookings(parsed);

    return NextResponse.json(
      bookings.map(({ id, bookedForOrg, venue, ...rest }) => ({
        ...rest,
        venue: venue?.name ?? null,
        bookedForOrg: bookedForOrg ? bookedForOrg.name : null,
      })),
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 },
    );
  }
}
