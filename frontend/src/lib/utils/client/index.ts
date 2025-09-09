import { parse } from 'date-fns';

export const timeToIndex = (time: string) =>
  parse(time, 'haaa', new Date()).getHours();
