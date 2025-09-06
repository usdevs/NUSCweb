export const dateTo12Hour = (date: Date): string => {
  if (!date) return '';

  let hours = date.getHours(); // 0–23
  const suffix = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12; // handle midnight (0) and noon (12)

  return `${hours}${suffix}`;
};

export const dateTimeFormatter = Intl.DateTimeFormat('en-SG');

export const getNext30Minutes = () => {
  const ms = 1000 * 60 * 30;
  return new Date(Math.ceil(new Date().getTime() / ms) * ms);
};
