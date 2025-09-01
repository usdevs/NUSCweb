import React from 'react';
import { Calendar, User, Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  eventName: string;
  organization: string;
  date: string;
  time: string;
  venue: string;
}

const EventCard: React.FC<EventCardProps> = ({
  eventName,
  organization,
  date,
  time,
  venue,
}) => {
  return (
    <div className='max-w-[260px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl'>
      {/* Card Header */}
      <div className='flex items-start gap-3 bg-[#0C2C47] p-3 text-white'>
        <Calendar className='mt-1 h-5 w-5 flex-shrink-0' />
        <h3 className='line-clamp-2 text-base font-semibold'>{eventName}</h3>
      </div>

      {/* Card Content */}
      <div className='space-y-2 p-3'>
        <div className='flex items-center gap-2'>
          <User className='h-4 w-4 flex-shrink-0 text-gray-700' />
          <span className='truncate text-sm'>{organization}</span>
        </div>

        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 flex-shrink-0 text-gray-700' />
          <span className='text-sm'>
            {date}, {time}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <MapPin className='h-4 w-4 flex-shrink-0 text-gray-700' />
          <span className='truncate text-sm'>{venue}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
