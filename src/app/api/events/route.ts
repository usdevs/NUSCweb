import { getEvents } from '@/lib/utils/server/event';
import { NextRequest, NextResponse } from 'next/server';

type Event = Awaited<ReturnType<typeof getEvents>>[number];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const orgName = url.searchParams.get('orgName');
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    const venue = url.searchParams.get('venue');
    const organisation = url.searchParams.get('organisation');

    let events = await getEvents();

    if (orgName) {
      events = events.filter(
        (event: Event) => event.bookedForOrg?.name === orgName
      );
    }

    if (start) {
      const startDate = new Date(start);
      events = events.filter(
        (event: Event) => new Date(event.start) >= startDate
      );
    }

    if (end) {
      const endDate = new Date(end);
      events = events.filter(
        (event: Event) => new Date(event.end) <= endDate
      );
    }

    if (venue) {
      events = events.filter(
        (event: Event) => event.booking?.venue?.name === venue
      );
    }

    if (organisation) {
      events = events.filter(
        (event: Event) => event.bookedForOrg?.name === organisation
      );
    }

    const mapped = events.map(({ id, bookedForOrg, booking, ...rest }: Event) => ({
      ...rest,
      venue: booking?.venue?.name ?? null,
      bookedForOrg: bookedForOrg
        ? { name: bookedForOrg.name }
        : null,
    }));

    return NextResponse.json(mapped);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}