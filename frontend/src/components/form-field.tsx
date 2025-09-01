'use client';

import React from 'react';
import { Calendar } from '@/components/ui/calendar';

interface FormFieldProps {
  label: string;
  type: 'text' | 'select' | 'date' | 'time' | 'checkbox';
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  placeholder?: string;
  options?: string[];
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

export default function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  options = [],
  disabled = false,
  required = false,
  id,
}: FormFieldProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Convert string date to Date object for calendar
  const getDateValue = () => {
    if (type === 'date' && typeof value === 'string' && value) {
      return new Date(value);
    }
    return undefined;
  };

  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onChange(date.toISOString());
    }
    setIsCalendarOpen(false);
  };

  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'time':
        return (
          <div className='flex items-center'>
            <input
              id={fieldId}
              type='text'
              className={`flex h-6 ${type === 'time' ? 'w-6/12' : 'w-full'} rounded-[5px] border border-input border-stone-400 bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${typeof value === 'string' && value ? '' : 'text-gray-500'}`}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
            />
            {type === 'time' && (
              <button
                type='button'
                className='ml-2 text-gray-400 hover:text-gray-500'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='12' cy='12' r='10'></circle>
                  <polyline points='12 6 12 12 16 14'></polyline>
                </svg>
              </button>
            )}
          </div>
        );

      case 'select':
        return (
          <div className='relative'>
            <select
              id={fieldId}
              className={`flex h-6 w-full appearance-none rounded-[5px] border border-input border-stone-400 bg-transparent px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${typeof value === 'string' && value ? '' : 'text-gray-500'}`}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              required={required}
            >
              <option value='' disabled>
                {placeholder || `Select ${label.toLowerCase()}`}
              </option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='h-4 w-4 fill-current'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className='flex items-center'>
            <input
              id={fieldId}
              type='text'
              className='flex h-6 w-8/12 rounded-[5px] border border-input border-stone-400 bg-transparent px-3 py-1 text-xs text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              value={formatDateForDisplay(getDateValue())}
              readOnly
              placeholder={placeholder || 'Select date'}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              disabled={disabled}
              required={required}
            />
            <button
              type='button'
              className='ml-2 text-gray-400 hover:text-gray-500'
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              disabled={disabled}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
                <line x1='16' y1='2' x2='16' y2='6'></line>
                <line x1='8' y1='2' x2='8' y2='6'></line>
                <line x1='3' y1='10' x2='21' y2='10'></line>
              </svg>
            </button>
            {isCalendarOpen && (
              <div className='absolute left-1/4 top-48 z-10 mt-1 rounded-md border bg-white shadow-lg'>
                <Calendar
                  mode='single'
                  selected={getDateValue()}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </div>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div className='flex items-center'>
            <input
              id={fieldId}
              type='checkbox'
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              checked={typeof value === 'boolean' ? value : false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
            />
            <label
              htmlFor={fieldId}
              className='ml-2 block text-xs text-gray-700'
            >
              {label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  if (type === 'checkbox') {
    return renderInput();
  }

  return (
    <div className='grid grid-cols-[1fr_2fr] items-center gap-3'>
      <label htmlFor={fieldId} className='text-left text-[13px] font-normal'>
        {label}
      </label>
      {renderInput()}
    </div>
  );
}
