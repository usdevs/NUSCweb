'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

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
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="px-4 py-2 text-sm flex items-center gap-1 h-10"
        onClick={handleClick}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full h-6 z-[9999]"></div>
      )}
      
      <div 
        className={`fixed md:absolute top-[calc(100%+4px)] left-1/2 transform -translate-x-1/2 w-40 bg-white rounded-md shadow-lg z-[9999] overflow-hidden transition-all duration-300 origin-top ${
          isOpen 
            ? 'opacity-100 scale-y-100' 
            : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="py-1">
          {items.map((item, index) => (
            <li key={index} className="text-center hover:bg-gray-100 transition-colors duration-200">
              <Link
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 w-full"
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