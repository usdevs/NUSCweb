'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Send, ChevronDown, ChevronRight } from 'lucide-react';
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
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import CustomDropdown from './custom-dropdown';

export default function Header() {
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminSubmenuOpen, setAdminSubmenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
  }, []);

  const handleLoginToggle = () => {
    const newLoginState = !isLoggedIn;
    setIsLoggedIn(newLoginState);
    localStorage.setItem('isLoggedIn', newLoginState.toString());
  };

  return (
    <header className={`border-b sticky top-0 z-[100] bg-white shadow-lg ${isSidebarOpen ? 'lg:block hidden' : 'block'}`}>
      <div className="flex items-center justify-between px-4 py-2">
        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation menu for mobile devices
                </SheetDescription>
              </SheetHeader>
              
              <nav className="flex flex-col gap-4 mt-6">
                <Link href="/" className="text-orange-500 font-bold" onClick={() => setIsSidebarOpen(false)}>
                  NUS COLLEGE CLUB
                </Link>
                
                {/* Student Life */}
                <div>
                  <button 
                    className="flex w-full items-center justify-between py-2"
                    onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                  >
                    <span>STUDENT LIFE</span>
                    {mobileSubmenuOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {mobileSubmenuOpen && (
                    <div className="pl-4">
                      <Link href="/events" className="block py-1 text-sm" onClick={() => setIsSidebarOpen(false)}>
                        EVENTS
                      </Link>
                      <Link href="/" className="block py-1 text-sm" onClick={() => setIsSidebarOpen(false)}>
                        STUDENT GROUPS
                      </Link>
                      <Link href="/bookings" className="block py-1 text-sm" onClick={() => setIsSidebarOpen(false)}>
                        VENUE BOOKING
                      </Link>
                    </div>
                  )}
                </div>
                
                <Link href="/" className="block py-2" onClick={() => setIsSidebarOpen(false)}>
                  COURSE REVIEWS
                </Link>
                <Link href="/" className="block py-2" onClick={() => setIsSidebarOpen(false)}>
                  NEWSLETTER
                </Link>

                {/* Admin menu for logged in users */}
                {isLoggedIn && (
                  <>
                    <div>
                      <button 
                        className="flex w-full items-center justify-between py-2"
                        onClick={() => setAdminSubmenuOpen(!adminSubmenuOpen)}
                      >
                        <span>ADMIN</span>
                        {adminSubmenuOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {adminSubmenuOpen && (
                        <div className="pl-4">
                          <Link href="/" className="block py-1 text-sm" onClick={() => setIsSidebarOpen(false)}>
                            ORGANISATIONS
                          </Link>
                          <Link href="/" className="block py-1 text-sm" onClick={() => setIsSidebarOpen(false)}>
                            USERS
                          </Link>
                        </div>
                      )}
                    </div>
                    <Link href="" className="block py-2" onClick={() => setIsSidebarOpen(false)}>
                      TOKEN
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-orange-500">NUS COLLEGE CLUB</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <CustomDropdown 
                label="STUDENT LIFE" 
                items={[
                  { label: "EVENTS", href: "/events" },
                  { label: "STUDENT GROUPS", href: "/groups" },
                  { label: "VENUE BOOKING", href: "/bookings" }
                ]} 
              />
              
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    COURSE REVIEWS
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    NEWSLETTER
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Admin dropdown for logged in users */}
          <div className="hidden lg:flex">
            {isLoggedIn && (
              <CustomDropdown 
                label="ADMIN" 
                items={[
                  { label: "ORGANISATIONS", href: "/" },
                  { label: "USERS", href: "/" }
                ]} 
              />
            )}
          </div>

          {/* Token link - only visible when logged in */}
          {isLoggedIn && (
            <Button variant="ghost" asChild className="hidden lg:flex">
              <Link href="" className="flex items-center gap-2"> 
                TOKEN
              </Link>
            </Button>
          )}

          {/* Login/Logout button */}
          <Button variant="ghost" onClick={handleLoginToggle} asChild>
            <Link href="/" className="flex items-center gap-2">
              <Send className="h-4 w-4" /> 
              {isLoggedIn ? 'LOGOUT' : 'LOGIN'}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}