'use client';

import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

interface DropdownItem {
  label: string;
  href: string;
}

interface CustomDropdownProps {
  label: string;
  items: DropdownItem[];
  href?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  items,
  href,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isClickOpenRef = useRef(false);
  const menuId = useId();

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return;

    timeoutRef.current = setTimeout(() => {
      if (
        !isClickOpenRef.current &&
        !dropdownRef.current?.contains(document.activeElement)
      )
        setIsOpen(false);
    }, 100);
  };

  const handlePointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleClick = () => {
    // why: click pins an otherwise transient hover/focus menu so touch users
    // and pointer users moving toward the menu get the same stable control.
    isClickOpenRef.current = !isClickOpenRef.current;
    setIsOpen(isClickOpenRef.current);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        isClickOpenRef.current = false;
        setIsOpen(false);
      }
    }, 0);
  };

  const handleToggleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowDown') return;

    event.preventDefault();
    setIsOpen(true);
    window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    });
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
    );
    const currentIndex = items.indexOf(
      document.activeElement as HTMLAnchorElement,
    );

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      items
        .at((currentIndex + direction + items.length) % items.length)
        ?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      items.at(event.key === 'Home' ? 0 : -1)?.focus();
    }
  };

  useEffect(() => {
    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        isClickOpenRef.current = false;
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointerDown);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointerDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className='relative'
      ref={dropdownRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          isClickOpenRef.current = false;
          toggleRef.current?.focus();
          setIsOpen(false);
        }
      }}
    >
      {href ? (
        <div className='flex h-10 items-center'>
          <Link
            href={href}
            className='hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground px-4 py-2 text-sm focus:outline-none'
            onClick={() => {
              isClickOpenRef.current = false;
              setIsOpen(false);
            }}
          >
            {label}
          </Link>
          <button
            ref={toggleRef}
            type='button'
            className='hover:bg-accent focus:bg-accent h-full px-2 focus:outline-none'
            onClick={handleClick}
            onKeyDown={handleToggleKeyDown}
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-haspopup='menu'
            aria-label={`Toggle ${label} menu`}
          >
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-300 ${isOpen ? `rotate-180` : ''}`}
              aria-hidden='true'
            />
          </button>
        </div>
      ) : (
        <button
          ref={toggleRef}
          type='button'
          className='flex h-10 items-center gap-1 px-4 py-2 text-sm'
          onClick={handleClick}
          onKeyDown={handleToggleKeyDown}
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup='menu'
          aria-label={`Toggle ${label} menu`}
        >
          {label}
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? `rotate-180` : ''}`}
            aria-hidden='true'
          />
        </button>
      )}

      {isOpen && <div className='absolute top-full left-0 z-9999 h-6 w-full' />}

      <div
        aria-hidden={!isOpen}
        className={`fixed top-[calc(100%+4px)] left-1/2 z-9999 w-40 origin-top -translate-x-1/2 transform overflow-hidden rounded-md bg-white shadow-lg transition-all duration-300 md:absolute ${
          isOpen
            ? 'scale-y-100 opacity-100'
            : 'pointer-events-none scale-y-0 opacity-0'
        }`}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={(e) => e.stopPropagation()}
      >
        <ul
          id={menuId}
          ref={menuRef}
          className='py-1'
          role='menu'
          onKeyDown={handleMenuKeyDown}
        >
          {items.map((item) => (
            <li
              key={item.href}
              className='text-center transition-colors duration-200 hover:bg-gray-100'
              role='none'
            >
              <Link
                href={item.href}
                className='block w-full px-4 py-2 text-sm text-gray-700'
                role='menuitem'
                tabIndex={isOpen ? undefined : -1}
                onClick={() => {
                  isClickOpenRef.current = false;
                  setIsOpen(false);
                }}
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
