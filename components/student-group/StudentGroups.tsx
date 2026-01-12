'use client';

import { IGCategory } from '@prisma/client';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';

import StudentGroupCard from '@/components/student-group/StudentGroupCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import type { OrganisationView } from '@/lib/utils/server/organisation';

const DEFAULT_FILTERS: string[] = [
  IGCategory.Sports,
  IGCategory.SocioCultural,
  IGCategory.Others,
];
const PAGE_SIZE = 9;

interface StudentGroupsProps {
  orgs: OrganisationView[];
}

export default function StudentGroups({ orgs }: StudentGroupsProps) {
  const [interestGroupFilters, setInterestGroupFilters] =
    useState<string[]>(DEFAULT_FILTERS);
  const [interestGroupSearchString, setInterestGroupSearchString] =
    useState('');
  const [showInactiveOrgs, setShowInactiveOrgs] = useState<boolean>(false);

  const igCardsToDisplay = orgs.filter(
    (card) =>
      !(card.isInactive && !showInactiveOrgs) &&
      interestGroupFilters.includes(card.category) &&
      card.name.toLowerCase().includes(interestGroupSearchString.toLowerCase()),
  );

  // Pagination
  const [page, setPage] = useState(1);

  // Handle search input
  const onInput = (ev: ChangeEvent<HTMLInputElement>) => {
    setInterestGroupSearchString(ev.target.value);
  };

  // Handle category filter changes
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setInterestGroupFilters([...interestGroupFilters, category]);
    } else {
      setInterestGroupFilters(
        interestGroupFilters.filter((filter) => filter !== category),
      );
    }
  };

  // Reset page whenever filter changes
  useEffect(() => {
    setPage(1);
  }, [interestGroupFilters, interestGroupSearchString, orgs, showInactiveOrgs]);

  // Pagination logic
  const paginateArray = (pageNumber: number) => {
    return igCardsToDisplay.slice(
      (pageNumber - 1) * PAGE_SIZE,
      pageNumber * PAGE_SIZE,
    );
  };

  const totalPages = Math.ceil(igCardsToDisplay.length / PAGE_SIZE);

  return (
    <div className='relative flex flex-1'>
      {orgs.length === 0 && (
        <div className='bg-opacity-60 absolute inset-0 z-50 flex items-center justify-center bg-white'>
          <div className='h-24 w-24'>
            <Spinner />
          </div>
        </div>
      )}
      {/* TODO: How do mobile people view the sidebar? */}
      {/* Sidebar */}
      <div className='hidden w-72 border-r bg-white px-8 py-8 lg:block'>
        <div className='mb-6 rounded-md bg-[#F5F5F5] p-4'>
          <h3 className='mb-3 font-semibold text-gray-900'>Join the...</h3>
          <Button className='ml-3 rounded-md bg-[#FF7D4E] p-6 text-sm text-white hover:bg-[#FF7D4E]/90'>
            <Link
              href='https://t.me/+Mm3qL3aL7c0zNDE1'
              target='_blank'
              rel='noopener noreferrer'
            >
              STUDENT GROUP
              <br />
              TELEGRAM CHAT
            </Link>
          </Button>
        </div>

        <div className='mb-6'>
          <h3 className='mb-3 font-semibold text-gray-900'>SEARCH</h3>
          <Input
            type='search'
            placeholder='Search groups...'
            className='w-full'
            onChange={onInput}
            value={interestGroupSearchString}
          />
        </div>

        <div className='mb-6'>
          <h3 className='mb-3 font-semibold text-gray-900'>CATEGORIES</h3>
          <div className='space-y-3'>
            {Object.keys(IGCategory).map((category) => (
              <div key={category} className='flex items-center space-x-2'>
                <Checkbox
                  id={category}
                  checked={interestGroupFilters.includes(category)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <label htmlFor={category} className='text-sm text-gray-700'>
                  {IGCategory[
                    category as keyof typeof IGCategory
                  ].toUpperCase()}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className='mb-3 font-semibold text-gray-900'>OPTIONS</h3>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='show-inactive'
              checked={showInactiveOrgs}
              onCheckedChange={(checked) =>
                setShowInactiveOrgs(checked as boolean)
              }
            />
            <label htmlFor='show-inactive' className='text-sm text-gray-700'>
              SHOW INACTIVE GROUPS
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 bg-[#0C2C47] p-8'>
        <div className='mb-8'>
          <h1 className='mb-2 text-4xl font-bold text-white'>Student Groups</h1>
          <p className='text-white/80'>{igCardsToDisplay.length} RESULTS</p>
        </div>

        {/* Groups Grid */}
        {igCardsToDisplay.length === 0 ? (
          <div className='py-16 text-center text-white/80'>
            <p className='mb-2 text-xl'>No student groups found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {paginateArray(page).map((organisation) => (
                <StudentGroupCard
                  key={organisation.id}
                  organisation={organisation}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      aria-label='Go to first page'
                      size='default'
                      className='px-2.5 text-white hover:bg-white/10 hover:text-white/80'
                      onClick={() => setPage(1)}
                    >
                      <ChevronsLeftIcon className='h-4 w-4' />
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      aria-label='Go to previous page'
                      size='default'
                      className='px-2.5 text-white hover:bg-white/10 hover:text-white/80'
                      onClick={() => setPage((page) => Math.max(1, page - 1))}
                    >
                      <ChevronLeftIcon className='h-4 w-4' />
                    </PaginationLink>
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (page <= 3) {
                      pageNumber = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = page - 2 + i;
                    }

                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          aria-label='Go to previous page'
                          size='default'
                          className={`px-2.5 text-white hover:bg-white/10 hover:text-white/80 ${page === pageNumber ? 'text-black' : ''}`}
                          onClick={() => setPage(pageNumber)}
                          isActive={page === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationLink
                      aria-label='Go to next page'
                      size='default'
                      className='px-2.5 text-white hover:bg-white/10 hover:text-white/80'
                      onClick={() =>
                        setPage((page) => Math.min(totalPages, page + 1))
                      }
                    >
                      <ChevronRightIcon className='h-4 w-4' />
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      aria-label='Go to last page'
                      size='default'
                      className='px-2.5 text-white hover:bg-white/10 hover:text-white/80'
                      onClick={() => setPage(totalPages)}
                    >
                      <ChevronsRightIcon className='h-4 w-4' />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
