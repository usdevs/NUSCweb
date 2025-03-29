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
  venue
}) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-xl max-w-[260px] bg-white border border-gray-200">
      {/* Card Header */}
      <div className="bg-[#0C2C47] text-white p-3 flex items-start gap-3">
        <Calendar className="h-5 w-5 mt-1 flex-shrink-0" />
        <h3 className="text-base font-semibold line-clamp-2">{eventName}</h3>
      </div>

      {/* Card Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-700 flex-shrink-0" />
          <span className="text-sm truncate">{organization}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-700 flex-shrink-0" />
          <span className="text-sm">{date}, {time}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-700 flex-shrink-0" />
          <span className="text-sm truncate">{venue}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;