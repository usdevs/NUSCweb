'use client';

import Cookies from 'js-cookie';
import { LoginButton } from '@telegram-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, ChevronRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import CustomDropdown from './custom-dropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { NavigationMenuContent } from '@radix-ui/react-navigation-menu';

export default function Header() {
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [adminSubmenuOpen, setAdminSubmenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoggedIn = useAuth();

  return (
    <header
      className={`sticky top-0 z-100 border-b bg-white shadow-lg ${isSidebarOpen ? 'hidden lg:block' : 'block'}`}
    >
      <div className='flex items-center justify-between px-4 py-2'>
        {/* Mobile Menu */}
        <div className='lg:hidden'>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left'>
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription className='sr-only'>
                  Main navigation menu for mobile devices
                </SheetDescription>
              </SheetHeader>

              <nav className='mt-6 flex flex-col gap-4'>
                <Link
                  href='/'
                  className='font-bold text-orange-500'
                  onClick={() => setIsSidebarOpen(false)}
                >
                  NUS COLLEGE CLUB
                </Link>

                {/* Student Life */}
                <div>
                  <button
                    className='flex w-full items-center justify-between py-2'
                    onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                  >
                    <span>STUDENT LIFE</span>
                    {mobileSubmenuOpen ? (
                      <ChevronDown className='h-4 w-4' />
                    ) : (
                      <ChevronRight className='h-4 w-4' />
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
                        href='/'
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
                </div>

                <Link
                  href='/'
                  className='block py-2'
                  onClick={() => setIsSidebarOpen(false)}
                >
                  COURSE REVIEWS
                </Link>
                <Link
                  href='/'
                  className='block py-2'
                  onClick={() => setIsSidebarOpen(false)}
                >
                  NEWSLETTER
                </Link>

                {/* Admin menu for logged in users */}
                {isLoggedIn && (
                  <div>
                    <button
                      className='flex w-full items-center justify-between py-2'
                      onClick={() => setAdminSubmenuOpen(!adminSubmenuOpen)}
                    >
                      <span>ADMIN</span>
                      {adminSubmenuOpen ? (
                        <ChevronDown className='h-4 w-4' />
                      ) : (
                        <ChevronRight className='h-4 w-4' />
                      )}
                    </button>

                    {adminSubmenuOpen && (
                      <div className='pl-4'>
                        <Link
                          href='/'
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
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <div className='hidden lg:block'>
          <NavigationMenu>
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
                    { label: 'STUDENT GROUPS', href: '/groups' },
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
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side buttons */}
        <div className='flex items-center gap-4'>
          {/* Admin dropdown for logged in users */}
          <div className='hidden lg:flex'>
            {isLoggedIn && (
              <CustomDropdown
                label='ADMIN'
                items={[
                  { label: 'ORGANISATIONS', href: '/' },
                  { label: 'USERS', href: '/' },
                ]}
              />
            )}
          </div>

          {/* Login/Logout button */}
          {isLoggedIn ? (
            <Button
              className='flex items-center gap-2'
              onClick={() => {
                Cookies.remove('auth');
                window.location.reload();
              }}
              variant='ghost'
            >
              <Send className='h-4 w-4' />
              LOGOUT
            </Button>
          ) : (
            <LoginButton
              botUsername={process.env.NEXT_PUBLIC_TELEGRAM_LOGIN_BOT!}
              authCallbackUrl='/api/auth/callback'
            />
          )}
        </div>
      </div>
    </header>
  );
}
