import { TZDate } from '@date-fns/tz';
import { roundToNearestMinutes } from 'date-fns';

export const SGT = 'Asia/Singapore';

/** Convert any Date to a timezone-aware SGT TZDate. */
export const toSGT = (date: Date) => new TZDate(date, SGT);

export const dateTimeFormatter = Intl.DateTimeFormat('en-SG', {
  timeZone: SGT,
});

export const timeFormatter = Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: SGT,
});

export const formatTime = (d: Date) => timeFormatter.format(d);

export const getNext30Minutes = () => {
  return roundToNearestMinutes(new TZDate(new Date(), SGT), {
    nearestTo: 30,
    roundingMethod: 'ceil',
  });
};
