import type { BookingView } from '@/lib/utils/server/bookings';
import { format } from 'date-fns';
import { Calendar, User, Clock, MapPin } from 'lucide-react';

interface BookingCardProps {
  booking: BookingView;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <div className='max-w-[260px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl'>
      {/* Card Header */}
      <div className='flex items-start gap-3 bg-[#0C2C47] p-3 text-white'>
        <Calendar className='mt-1 h-5 w-5 shrink-0' />
        <h3 className='line-clamp-2 text-base font-semibold'>
          {booking.eventName}
        </h3>
      </div>

      {/* Card Content */}
      <div className='space-y-2 p-3'>
        <div className='flex items-center gap-2'>
          <User className='h-4 w-4 shrink-0 text-gray-700' />
          <span className='truncate text-sm'>{booking.bookedBy.org.name}</span>
        </div>

        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 shrink-0 text-gray-700' />
          <div>
            <div className='text-sm'>
              Start: {format(booking.start, 'd MMMM p')}
            </div>
            <div className='text-sm'>
              End: {format(booking.end, 'd MMMM p')}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <MapPin className='h-4 w-4 shrink-0 text-gray-700' />
          <span className='truncate text-sm'>{booking.venue.name}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
