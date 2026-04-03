'use client';

import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  isSameDay,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MobileWeekStrip({
  selected,
  onSelect,
}: {
  selected: Date;
  onSelect: (d: Date) => void;
}) {
  const [offset, setOffset] = useState(0);
  //   Main dragging logic
  const dragX = useRef<number | null>(null);
  const today = useMemo(() => startOfDay(new Date()), []);

  const getWeek = (off: number) => {
    const base = addWeeks(startOfWeek(today, { weekStartsOn: 1 }), off);
    return eachDayOfInterval({ start: base, end: addDays(base, 6) });
  };

  const settle = (endX: number) => {
    if (dragX.current === null) return;
    const delta = endX - dragX.current;
    if (delta < -60) setOffset((o) => o + 1);
    else if (delta > 60) setOffset((o) => o - 1);
    dragX.current = null;
  };

  const mid = getWeek(offset)[3];
  const monthLabel = mid.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className='bg-[#0C2C47] px-2 pt-3 pb-2 select-none lg:hidden'
      onMouseDown={(e) => {
        dragX.current = e.clientX;
      }}
      onMouseUp={(e) => settle(e.clientX)}
      onTouchStart={(e) => {
        dragX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => settle(e.changedTouches[0].clientX)}
    >
      <div className='mb-2 flex items-center justify-between px-1'>
        <button
          onClick={() => setOffset((o) => o - 1)}
          className='rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white'
        >
          <ChevronLeftIcon className='size-4' />
        </button>
        <span className='text-[11px] font-medium tracking-widest text-white/70 uppercase'>
          {monthLabel}
        </span>
        <button
          onClick={() => setOffset((o) => o + 1)}
          className='rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white'
        >
          <ChevronRightIcon className='size-4' />
        </button>
      </div>

      <div className='grid grid-cols-7 gap-1'>
        {getWeek(offset).map((day, i) => (
          <button
            key={i}
            onClick={() => onSelect(day)}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition-colors',
              isSameDay(day, selected)
                ? 'bg-white'
                : isSameDay(day, today)
                  ? 'bg-white/20'
                  : 'hover:bg-white/10',
            )}
          >
            <span
              className={cn(
                'text-[9px] leading-none font-medium tracking-wide uppercase',
                isSameDay(day, selected)
                  ? 'text-[#0C2C47]/60'
                  : 'text-white/55',
              )}
            >
              {DAYS[i]}
            </span>
            <span
              className={cn(
                'mt-0.5 text-sm leading-none font-semibold',
                isSameDay(day, selected) ? 'text-[#0C2C47]' : 'text-white',
              )}
            >
              {day.getDate()}
            </span>
            {isSameDay(day, today) && (
              <span
                className={cn(
                  'size-1 rounded-full',
                  isSameDay(day, selected) ? 'bg-[#0C2C47]/40' : 'bg-white/50',
                )}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
