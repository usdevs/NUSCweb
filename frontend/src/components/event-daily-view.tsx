'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, User, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: number;
  eventName: string;
  organization: string;
  category: string;
  venue: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface EventDailyViewProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: Event[];
  onEventClick: (event: Event) => void;
  getCategoryBgColor: (category: string) => string;
}

export default function EventDailyView({ 
  isOpen, 
  onClose, 
  date, 
  events, 
  onEventClick,
  getCategoryBgColor
}: EventDailyViewProps) {
  if (!isOpen || !date) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-sm bg-[#0C2C47] rounded-[20px] overflow-hidden shadow-lg p-6">
          {/* Header */}
          <div className="bg-[#0C2C47] text-white px-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              {format(date, 'd MMMM').toUpperCase()} EVENTS
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80 h-6 w-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Events list */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No events scheduled for this day
              </div>
            ) : (
              events.map(event => (
                <div
                  key={event.id}
                  className={`p-3 rounded-xl cursor-pointer ${getCategoryBgColor(event.category)}`}
                  onClick={() => {
                    onEventClick(event);
                    onClose(); 
                  }}
                >

                  <h3 className="font-semibold text-sm mb-2 text-[#0C2C47]">{event.eventName}</h3>
                  
                  <div className="space-y-1 text-xs text-[#0C2C47]">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 fill-current" style={{ fill: '#0C2C47' }} />
                      <span>{event.organization}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
