import { roundToNearestMinutes } from 'date-fns';

export const dateTimeFormatter = Intl.DateTimeFormat('en-SG');

export const getNext30Minutes = () => {
  return roundToNearestMinutes(new Date(), {
    nearestTo: 30,
    roundingMethod: 'ceil',
  });
};
