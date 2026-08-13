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
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

import LocalLoginButton from '@/components/auth/LocalLoginButton';
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

const newsletterArchiveItems = [
  { label: 'AY25/26', href: '/newsletter#ay25-26' },
  { label: 'AY22/23', href: '/newsletter#ay22-23' },
];

const wikiArchiveItems = [
  { label: 'AY25/26', href: '/wiki#ay25-26' },
  { label: 'AY24/25', href: '/wiki#ay24-25' },
  { label: 'AY23/24', href: '/wiki#ay23-24' },
  { label: 'AY22/23', href: '/wiki#ay22-23' },
];

export default function Header() {
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(true);
  const [mobileNewsletterOpen, setMobileNewsletterOpen] = useState(false);
  const [mobileWikiOpen, setMobileWikiOpen] = useState(false);
  const [adminSubmenuOpen, setAdminSubmenuOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAuthenticated = useAuth();

  useEffect(() => {
    if (!isAuthenticated) posthog.reset();
    else
      posthog.identify(isAuthenticated.userId.toString(), {
        telegramUserId: isAuthenticated.userCredentials.id,
        telegramUserName: isAuthenticated.userCredentials.username,
      });
  }, [isAuthenticated]);

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
              <Button
                variant='ghost'
                size='icon'
                aria-label='Open navigation menu'
              >
                <MenuIcon className='h-6 w-6' aria-hidden='true' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='overflow-y-auto'>
              <SheetHeader>
                <SheetTitle />
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
                      className='mb-1 flex w-full items-center justify-between'
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
                      <Link
                        href='https://sites.google.com/view/nuscc-academics/home'
                        target='_blank'
                      >
                        COURSE REVIEWS
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem className='w-full'>
                    <div className='flex items-center justify-between'>
                      <Link
                        href='/newsletter'
                        className='py-1'
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        NEWSLETTER
                      </Link>
                      <button
                        type='button'
                        className='p-2'
                        onClick={() => setMobileNewsletterOpen((open) => !open)}
                        aria-controls='mobile-newsletter-years'
                        aria-expanded={mobileNewsletterOpen}
                        aria-label='Toggle Newsletter years'
                      >
                        {mobileNewsletterOpen ? (
                          <ChevronDownIcon className='h-4 w-4' />
                        ) : (
                          <ChevronRightIcon className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                    {mobileNewsletterOpen && (
                      <div
                        id='mobile-newsletter-years'
                        className='pl-4'
                        role='region'
                        aria-label='Newsletter years'
                      >
                        {newsletterArchiveItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className='block py-1 text-sm'
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </NavigationMenuItem>

                  <NavigationMenuItem className='w-full'>
                    <div className='flex items-center justify-between'>
                      <Link
                        href='/wiki'
                        className='py-1'
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        WIKI
                      </Link>
                      <button
                        type='button'
                        className='p-2'
                        onClick={() => setMobileWikiOpen((open) => !open)}
                        aria-controls='mobile-wiki-years'
                        aria-expanded={mobileWikiOpen}
                        aria-label='Toggle Wiki years'
                      >
                        {mobileWikiOpen ? (
                          <ChevronDownIcon className='h-4 w-4' />
                        ) : (
                          <ChevronRightIcon className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                    {mobileWikiOpen && (
                      <div
                        id='mobile-wiki-years'
                        className='pl-4'
                        role='region'
                        aria-label='Wiki years'
                      >
                        {wikiArchiveItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className='block py-1 text-sm'
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </NavigationMenuItem>

                  {/* Admin menu for logged in users */}
                  {isAuthenticated && (
                    <NavigationMenuItem className='w-full'>
                      {/* Student Life */}
                      <button
                        className='mb-1 flex w-full items-center justify-between'
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
                            {isAuthenticated.isAdmin && (
                              <Link
                                href='/admin/users'
                                className='block py-1 text-sm'
                                onClick={() => setIsSidebarOpen(false)}
                              >
                                USERS
                              </Link>
                            )}
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
                <Link
                  href='https://sites.google.com/view/nuscc-academics/home'
                  target='_blank'
                >
                  COURSE REVIEWS
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <CustomDropdown
                label='NEWSLETTER'
                href='/newsletter'
                items={newsletterArchiveItems}
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <CustomDropdown
                label='WIKI'
                href='/wiki'
                items={wikiArchiveItems}
              />
            </NavigationMenuItem>

            {/* Spacer pushes following items to the right */}
            <div className='flex-1' />

            {/* Right side buttons */}
            {/* Admin dropdown for logged in users */}
            {isAuthenticated && (
              <NavigationMenuItem>
                <CustomDropdown
                  label='ADMIN'
                  items={
                    isAuthenticated.isAdmin
                      ? [
                          {
                            label: 'ORGANISATIONS',
                            href: '/admin/organisations',
                          },
                          { label: 'USERS', href: '/admin/users' },
                        ]
                      : [
                          {
                            label: 'ORGANISATIONS',
                            href: '/admin/organisations',
                          },
                        ]
                  }
                />
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        {isAuthenticated ? (
          <Button
            onClick={() => {
              Cookies.remove('auth', {
                domain: window.location.hostname.replace('www.', ''),
              });
              window.location.reload();
            }}
            variant='ghost'
          >
            <SendIcon className='h-4 w-4' />
            LOGOUT
          </Button>
        ) : process.env.NODE_ENV === 'development' ? (
          <LocalLoginButton />
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
