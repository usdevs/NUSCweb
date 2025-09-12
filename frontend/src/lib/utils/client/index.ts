export function timeToIndex(time: string): number {
  // Parse time string like "8:00am", "2:30pm", etc.
  const match = time.match(/^(\d{1,2}):(\d{2}) (am|pm)$/i);
  if (!match) return 0;

  const [, hourStr, minuteStr, period] = match;
  let hour = Number.parseInt(hourStr, 10);
  const minute = Number.parseInt(minuteStr, 10);

  // Convert to 24-hour format
  if (period.toLowerCase() === 'pm' && hour !== 12) {
    hour += 12;
  } else if (period.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }

  return hour * 2 + (minute >= 30 ? 1 : 0);
}

export function dateToHalfHourIndex(date: Date): number {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return hour * 2 + (minute >= 30 ? 1 : 0);
}

export function getTimeSpanInHalfHours(startDate: Date, endDate: Date): number {
  const startIndex = dateToHalfHourIndex(startDate);
  const endIndex = dateToHalfHourIndex(endDate);
  return Math.max(1, endIndex - startIndex);
}
