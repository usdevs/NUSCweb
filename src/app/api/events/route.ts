import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/utils/server/event';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    let events = await getEvents({
      eventName: searchParams.get('eventName') ?? undefined,
      organisation: searchParams.get('organisation') ?? undefined,
      venue: searchParams.get('venue') ?? undefined,
      start: searchParams.get('start')
        ? new Date(searchParams.get('start')!)
        : undefined,
      end: searchParams.get('end')
        ? new Date(searchParams.get('end')!)
        : undefined,
    });

    events = events.map(({ id, bookedForOrg, venue, ...rest }: any) => ({
        ...rest,
        venue: venue?.name ?? null,
        bookedForOrg: bookedForOrg
            ? { name: bookedForOrg.name }
            : null,
    }));

    return NextResponse.json(events);


  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
