'use client';

import { LoginButton } from '@telegram-auth/react';
import Cookies from 'js-cookie';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MenuIcon,
  SendIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/lib/hooks/useAuth';

import CustomDropdown from './custom-dropdown';

export default function Header() {
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [adminSubmenuOpen, setAdminSubmenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAuthenticated = useAuth();

  return (
    <header
      className={`sticky top-0 z-100 border-b bg-white shadow-lg ${
        isSidebarOpen ? `hidden lg:block` : `block`
      }`}
    >
      <div className='flex items-center justify-between px-4 py-2'>
        {/* Mobile MenuIcon */}
        <div className='lg:hidden'>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MenuIcon className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left'>
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription className='sr-only'>
                  Main navigation menu for mobile devices
                </SheetDescription>
              </SheetHeader>

              <NavigationMenu className='mt-6 w-full max-w-full flex-col items-start'>
                <NavigationMenuList className='flex-col items-start gap-8'>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href='/'
                        className='font-bold text-orange-500'
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        NUS COLLEGE CLUB
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className='w-full'>
                    {/* Student Life */}
                    <button
                      className='flex w-full items-center justify-between'
                      onClick={() => setMobileSubmenuOpen((open) => !open)}
                    >
                      <span>STUDENT LIFE</span>
                      {mobileSubmenuOpen ? (
                        <ChevronDownIcon className='h-4 w-4' />
                      ) : (
                        <ChevronRightIcon className='h-4 w-4' />
                      )}
                    </button>
                    {mobileSubmenuOpen && (
                      <div className='pl-4'>
                        <Link
                          href='/events'
                          className='block py-1 text-sm'
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          EVENTS
                        </Link>
                        <Link
                          href='/student-groups'
                          className='block py-1 text-sm'
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          STUDENT GROUPS
                        </Link>
                        <Link
                          href='/bookings'
                          className='block py-1 text-sm'
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          VENUE BOOKING
                        </Link>
                      </div>
                    )}
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href='/' onClick={() => setIsSidebarOpen(false)}>
                        COURSE REVIEWS
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href='/' onClick={() => setIsSidebarOpen(false)}>
                        NEWSLETTER
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Admin menu for logged in users */}
                  {isAuthenticated && (
                    <NavigationMenuItem className='w-full'>
                      {/* Student Life */}
                      <button
                        className='flex w-full items-center justify-between'
                        onClick={() => setAdminSubmenuOpen((open) => !open)}
                      >
                        <span>ADMIN</span>
                        {adminSubmenuOpen ? (
                          <ChevronDownIcon className='h-4 w-4' />
                        ) : (
                          <ChevronRightIcon className='h-4 w-4' />
                        )}
                      </button>
                      <div>
                        {adminSubmenuOpen && (
                          <div className='pl-4'>
                            <Link
                              href='/admin/organisations'
                              className='block py-1 text-sm'
                              onClick={() => setIsSidebarOpen(false)}
                            >
                              ORGANISATIONS
                            </Link>
                            <Link
                              href='/'
                              className='block py-1 text-sm'
                              onClick={() => setIsSidebarOpen(false)}
                            >
                              USERS
                            </Link>
                          </div>
                        )}
                      </div>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop MenuIcon */}
        <NavigationMenu className='hidden w-full max-w-full lg:block'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link href='/' className='text-orange-500'>
                  NUS COLLEGE CLUB
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <CustomDropdown
                label='STUDENT LIFE'
                items={[
                  { label: 'EVENTS', href: '/events' },
                  { label: 'STUDENT GROUPS', href: '/student-groups' },
                  { label: 'VENUE BOOKING', href: '/bookings' },
                ]}
              />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link href='/'>COURSE REVIEWS</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link href='/'>NEWSLETTER</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Spacer pushes following items to the right */}
            <div className='flex-1' />

            {/* Right side buttons */}
            {/* Admin dropdown for logged in users */}
            {isAuthenticated && (
              <NavigationMenuItem>
                <CustomDropdown
                  label='ADMIN'
                  items={[
                    { label: 'ORGANISATIONS', href: '/admin/organisations' },
                    { label: 'USERS', href: '/' },
                  ]}
                />
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        {isAuthenticated ? (
          <Button
            onClick={() => {
              Cookies.remove('auth');
              window.location.reload();
            }}
            variant='ghost'
          >
            <SendIcon className='h-4 w-4' />
            LOGOUT
          </Button>
        ) : (
          <LoginButton
            botUsername={process.env.NEXT_PUBLIC_TELEGRAM_LOGIN_BOT!}
            authCallbackUrl='/api/auth/callback'
          />
        )}
      </div>
    </header>
  );
}
