import { NextRequest, NextResponse } from 'next/server';

import { EventQuerySchema } from '@/lib/schema/event';
import { getEvents } from '@/lib/utils/server/event';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const parsed = EventQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    );
    const events = await getEvents(parsed);

    return NextResponse.json(
      events.map(({ id, bookedForOrg, ...rest }) => ({
        ...rest,
        bookedForOrg: bookedForOrg ? bookedForOrg.name : null,
      })),
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 },
    );
  }
}
