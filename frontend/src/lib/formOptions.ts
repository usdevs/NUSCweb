import { IGCategory } from '@prisma/client';

export const TIMETABLE_TIMESLOTS: string[] = Array.from(
  { length: 24 },
  (_, i) => {
    const hour = i;
    if (hour === 0) return '12AM';
    if (hour === 12) return '12PM';
    return `${hour % 12}${hour < 12 ? 'AM' : 'PM'}`;
  },
);

export const EVENT_CATEGORIES: Array<{ name: IGCategory; bgColor: string }> = [
  { name: IGCategory.Sports, bgColor: 'bg-blue-200' },
  { name: IGCategory.SocioCultural, bgColor: 'bg-yellow-200' },
  { name: IGCategory.Guips, bgColor: 'bg-green-200' },
  { name: IGCategory.Welfare, bgColor: 'bg-[#FCDED6]' },
  { name: IGCategory.Others, bgColor: 'bg-gray-200' },
];

export const getCategoryBgColor = (category: string) => {
  const categoryData = EVENT_CATEGORIES.find((cat) => cat.name === category);
  return categoryData ? categoryData.bgColor : 'bg-gray-200';
};
