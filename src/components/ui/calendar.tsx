'use client'

import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Custom arrow components
const LeftArrow = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    className={className} 
    {...props}
  >
    {/* Horizontal line */}
    <path 
      d="M12 8H4" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    {/* Arrowhead */}
    <path 
      d="M7 5L4 8L7 11" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

const RightArrow = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    className={className} 
    {...props}
  >
    {/* Horizontal line */}
    <path 
      d="M4 8H12" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    {/* Arrowhead */}
    <path 
      d="M9 5L12 8L9 11" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

// Custom formatters for single letter day names
const formatters = {
  formatWeekdayName: (day: Date) => {
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return dayNames[day.getDay()];
  }
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      formatters={formatters}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-2 flex items-center",
        nav_button: "h-6 w-6 bg-transparent p-0 opacity-70 hover:opacity-100 border-0 transition-opacity flex items-center justify-center",
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground w-8 font-normal text-[0.8rem] flex items-center justify-center",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-8 h-8",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex items-center justify-center text-sm",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-[#0C2C47] text-white hover:bg-[#0C2C47] hover:text-white focus:bg-[#0C2C47] focus:text-white",
        day_today: "bg-accent text-accent-foreground font-bold",
        day_outside: "day-outside text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <LeftArrow className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <RightArrow className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      modifiersStyles={{
        selected: {
          backgroundColor: '#0C2C47',
          color: 'white'
        }
      }}
      weekStartsOn={0}
      fixedWeeks={false}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }