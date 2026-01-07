import { NextRequest, NextResponse } from 'next/server';

import { EventQuerySchema } from '@/lib/schema/event';
import { getEvents } from '@/lib/utils/server/event';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const result = EventQuerySchema.safeParse(
      Object.fromEntries(searchParams.entries()),
    );
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }
    const events = await getEvents(result.data);

    return NextResponse.json(
      events.map(({ id, bookedForOrg, booking, ...rest }) => ({
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
