'use client';

import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface DropdownItem {
  label: string;
  href: string;
}

interface CustomDropdownProps {
  label: string;
  items: DropdownItem[];
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className='relative'
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className='flex h-10 items-center gap-1 px-4 py-2 text-sm'
        onClick={handleClick}
      >
        {label}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? `rotate-180` : ''}`}
        />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 z-9999 h-6 w-full'></div>
      )}

      <div
        className={`fixed top-[calc(100%+4px)] left-1/2 z-9999 w-40 origin-top -translate-x-1/2 transform overflow-hidden rounded-md bg-white shadow-lg transition-all duration-300 md:absolute ${
          isOpen
            ? 'scale-y-100 opacity-100'
            : 'pointer-events-none scale-y-0 opacity-0'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className='py-1'>
          {items.map((item, index) => (
            <li
              key={index}
              className={`text-center transition-colors duration-200 hover:bg-gray-100`}
            >
              <Link
                href={item.href}
                className='block w-full px-4 py-2 text-sm text-gray-700'
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomDropdown;
