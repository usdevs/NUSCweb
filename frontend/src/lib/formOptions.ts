export const BOOKING_VENUE_OPTIONS: string[] = [
  'CTPH',
  'Chatterbox',
  'RC1 Student Lounge (Buttery Common Area)',
  'RC1 Pantry (Buttery Cooking Area)',
  'RC2 Student Lounge (Buttery Common Area)',
  'RC2 Pantry (Buttery Cooking Area)',
];

export const BOOKING_ORGANIZATION_OPTIONS: string[] = [
  'NUSC Floorball',
  'Admin Team',
  'Student Council',
  'Interest Group',
  'Others',
];

export const TIMETABLE_TIMESLOTS: string[] = Array.from(
  { length: 24 },
  (_, i) => {
    const hour = i;
    if (hour === 0) return '12AM';
    if (hour === 12) return '12PM';
    return `${hour % 12}${hour < 12 ? 'AM' : 'PM'}`;
  },
);

export const EVENT_VENUE_OPTIONS: string[] = [
  'CTPH',
  'Chatterbox',
  'RC1 Student Lounge (Buttery Common Area)',
  'RC1 Pantry (Buttery Cooking Area)',
  'RC2 Student Lounge (Buttery Common Area)',
  'RC2 Pantry (Buttery Cooking Area)',
  'ONLINE',
];

export const EVENT_ORGANIZATION_OPTIONS: string[] = [
  'NUSCC Welfare',
  'Residential Team',
  'Sentinel House',
  'Admin Team',
  'Student Council',
  'Interest Group',
  'Others',
];

export const EVENT_CATEGORIES: Array<{ name: string; bgColor: string }> = [
  { name: 'SPORTS', bgColor: 'bg-blue-200' },
  { name: 'SOCIO-CULTURAL', bgColor: 'bg-yellow-200' },
  { name: 'GROUND-UP INITIATIVES & PROJECTS', bgColor: 'bg-green-200' },
  { name: 'WELFARE', bgColor: 'bg-[#FCDED6]' },
  { name: 'OTHERS', bgColor: 'bg-gray-200' },
];

export const EVENT_CATEGORY_NAMES: string[] = EVENT_CATEGORIES.map(
  (cat) => cat.name,
);
