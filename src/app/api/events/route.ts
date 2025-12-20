import { NextRequest, NextResponse } from 'next/server';

import { EventQuerySchema } from '@/lib/schema/event';
import { getEvents } from '@/lib/utils/server/event';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const rawParams = Object.fromEntries(searchParams.entries());
    const parsed = EventQuerySchema.parse(rawParams);
    let events = await getEvents(parsed);

    events = events.map(({ id, bookedForOrg, venue, ...rest }: any) => ({
      ...rest,
      venue: venue?.name ?? null,
      bookedForOrg: bookedForOrg ? { name: bookedForOrg.name } : null,
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 },
    );
  }
}
