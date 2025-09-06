export const dateTimeFormatter = Intl.DateTimeFormat('en-SG');

export const getNext30Minutes = () => {
  const ms = 1000 * 60 * 30;
  return new Date(Math.ceil(new Date().getTime() / ms) * ms);
};
