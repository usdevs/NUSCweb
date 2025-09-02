import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: Delete this
export const timeToIndex = (time: string): number => {
  if (!time) return 0;
  if (time === '12AM') return 0;
  if (time === '12PM') return 12;

  const match = time.match(/^(\d+)(AM|PM)$/);
  if (!match) return 0;

  const hour = parseInt(match[1]);
  const isPM = match[2] === 'PM';

  if (isPM && hour !== 12) {
    return hour + 12;
  } else if (!isPM && hour === 12) {
    return 0;
  } else {
    return hour;
  }
};

export const dateTo12Hour = (date: Date): string => {
  if (!date) return '';

  let hours = date.getHours(); // 0–23
  const suffix = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12; // handle midnight (0) and noon (12)

  return `${hours}${suffix}`;
};
