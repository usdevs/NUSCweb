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
  // why: hover/focus visibility is transient, while a click pins the menu open.
  const isClickOpenRef = useRef(false);
  const menuId = useId();

  const handlePointerLeave = (event: React.PointerEvent) => {
    // why: touch and pen pointers should use the stable click interaction.
    if (event.pointerType !== 'mouse') return;

    // why: a short grace period lets the pointer cross the visual gap to the
    // menu without closing it mid-movement and causing a flicker.
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
    isClickOpenRef.current = !isClickOpenRef.current;
    setIsOpen(isClickOpenRef.current);
  };

  const handleFocus = () => {
    // why: keyboard users who Tab into the control need the same menu reveal
    // that mouse users get from hovering.
    setIsOpen(true);
  };

  const handleBlur = () => {
    // why: blur fires before focus settles on the next element, so checking
    // immediately would close the menu while the user Tabs into one of its links.
    window.setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        isClickOpenRef.current = false;
        setIsOpen(false);
      }
    }, 0);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    // why: ArrowDown is the standard shortcut for entering an attached menu;
    // handling keydown lets us prevent page scrolling before it occurs.
    if (event.key !== 'ArrowDown') return;

    event.preventDefault();
    setIsOpen(true);
    // why: let React commit the open state before moving keyboard focus into the menu.
    window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    });
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    // why: menu-style arrow navigation moves focus between choices without
    // making keyboard users Tab through the rest of the page.
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
      {/* why: both trigger variants must expose the controlled menu and its open state to screen readers. */}
      {href ? (
        <div className='flex h-10 items-center'>
          <Link
            href={href}
            className='hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground px-4 py-2 text-sm focus:outline-none'
            onKeyDown={handleTriggerKeyDown}
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-haspopup='menu'
            onClick={() => {
              isClickOpenRef.current = false;
              setIsOpen(false);
            }}
          >
            {label}
          </Link>
          {/* why: screen readers need to distinguish this menu toggle from the adjacent page link. */}
          <button
            ref={toggleRef}
            type='button'
            className='hover:bg-accent focus:bg-accent h-full px-2 focus:outline-none'
            onClick={handleClick}
            onKeyDown={handleTriggerKeyDown}
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
          onKeyDown={handleTriggerKeyDown}
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

      {/* why: bridge the visual gap so moving a mouse into the menu does not close it. */}
      {isOpen && <div className='absolute top-full left-0 z-9999 h-6 w-full' />}

      {/* why: keep the menu mounted for its close animation, but make closed links inert. */}
      {/* why: assistive technology also needs an explicit signal while those mounted contents are unavailable. */}
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
        {/* why: menu semantics announce that arrow keys move between these choices. */}
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
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  item.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
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
