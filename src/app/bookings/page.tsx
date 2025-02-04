'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export default function BookingsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  const rooms = [
    'CTPH',
    'Chatterbox',
    'RC1 Student Lounge (Buttery Common Area)',
    'RC1 Pantry (Buttery Cooking Area)',
    'RC2 Student Lounge (Buttery Common Area)',
    'RC2 Pantry (Buttery Cooking Area)'
  ];

  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const hour = i + 1;
    return `${hour}${hour < 12 ? 'AM' : 'PM'}`;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <span className="text-orange-500">NUS COLLEGE CLUB</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  STUDENT LIFE
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button variant="ghost" asChild>
          <Link href="/">LOGIN</Link>
        </Button>
      </div>

      <div className="flex p-4">
        {/* Calendar */}
        <div className="w-64 mr-8">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <div className="mt-4 space-y-2">
            <Button variant="outline" className="w-full text-orange-500 border-orange-500">
              CREATE BOOKING
            </Button>
            <Button variant="outline" className="w-full text-orange-500 border-orange-500">
              EDIT BOOKING
            </Button>
          </div>
        </div>

        {/* Timetable */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-full border rounded-lg">
            <div className="grid grid-cols-[auto_repeat(6,1fr)] bg-[#0C2C47] text-white">
              <div className="p-2 border-r"></div>
              {rooms.map((room) => (
                <div key={room} className="p-2 border-r text-center whitespace-normal">
                  {room}
                </div>
              ))}
            </div>
            <div className="divide-y">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-[auto_repeat(6,1fr)]">
                  <div className="p-2 border-r text-sm text-gray-600">{time}</div>
                  {rooms.map((room) => (
                    <div key={`${time}-${room}`} className="p-2 border-r"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}