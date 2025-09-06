'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';

import ShowIGModal from '@/components/show-ig-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface OrganisationWithIGHead {
  id: string;
  name: string;
  description: string;
  category: string;
  isInactive: boolean;
  isInvisible: boolean;
  userOrg: Array<{
    isIGHead: boolean;
    user: {
      name: string;
      telegramHandle?: string;
    };
  }>;
  inviteLink?: string;
  hasVerified?: boolean;
}

interface IGCategories {
  [key: string]: string;
}

const DEFAULT_FILTERS: string[] = ['Sports', 'SocioCultural', 'Others'];

// Utility function to make categories prettier
const makeCategoriesPrettier = (
  categories: Record<string, string>,
): IGCategories => {
  const prettierCategories: IGCategories = {};
  Object.keys(categories).forEach((key) => {
    prettierCategories[key] = categories[key].replace(/([A-Z])/g, ' $1').trim();
  });
  return prettierCategories;
};

export default function StudentGroupsPage() {
  const [allOrgs, setAllOrgs] = useState<OrganisationWithIGHead[]>([]);
  const [igCardsToDisplay, setIgCardsToDisplay] = useState<
    OrganisationWithIGHead[]
  >([]);
  const [allIGCategories, setAllIGCategories] = useState<IGCategories>({});
  const [interestGroupFilters, setInterestGroupFilters] =
    useState<string[]>(DEFAULT_FILTERS);
  const [interestGroupSearchString, setInterestGroupSearchString] =
    useState('');
  const [isInactive, setIsInactive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedOrg, setSelectedOrg] = useState<OrganisationWithIGHead | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.nusc.club/';

        // TODO: This doesn't work due to CORS issues
        // but backend API will be migrated into the nextjs app
        // will work on this after bookings is completed
        const [orgsResponse, categoriesResponse] = await Promise.all([
          fetch(`${backendUrl}orgs`),
          fetch(`${backendUrl}orgs/categories`),
        ]);

        if (!orgsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const orgsData = await orgsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setAllOrgs(orgsData);
        setAllIGCategories(makeCategoriesPrettier(categoriesData));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search input
  const onInput = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;
    setInterestGroupSearchString(value.toLowerCase());
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

  // Handle inactive filter change
  const handleInactiveChange = (checked: boolean) => {
    setIsInactive(checked);
  };

  // Filter and search logic
  useEffect(() => {
    const visibleCards = allOrgs.filter((card) => !card.isInvisible);
    const inactiveFilteredCards = visibleCards.filter(
      (card) => !(card.isInactive && !isInactive),
    );
    let filteredCards = inactiveFilteredCards.filter((card) =>
      interestGroupFilters.includes(card.category),
    );
    filteredCards = filteredCards.filter((ig) =>
      ig.name.toLowerCase().includes(interestGroupSearchString),
    );
    setIgCardsToDisplay(filteredCards);
    setPage(1);
  }, [interestGroupFilters, interestGroupSearchString, allOrgs, isInactive]);

  // Pagination logic
  const paginateArray = (pageNumber: number) => {
    return igCardsToDisplay.slice(
      (pageNumber - 1) * pageSize,
      (pageNumber - 1) * pageSize + pageSize,
    );
  };

  const totalPages = Math.ceil(igCardsToDisplay.length / pageSize);

  // Handle showing modal for organization details
  const handleShowMore = (org: OrganisationWithIGHead) => {
    setSelectedOrg(org);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrg(null);
  };

  if (loading) {
    return (
      <div
        className={`flex min-h-[calc(100vh-160px)] items-center justify-center`}
      >
        <div className='text-center'>
          <div
            className={`mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-[#FF7D4E]`}
          ></div>
          <p className='text-gray-600'>Loading student groups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex min-h-[calc(100vh-160px)] items-center justify-center`}
      >
        <div className='text-center'>
          <p className='mb-4 text-red-600'>
            Error loading student groups: {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className={`bg-[#FF7D4E] hover:bg-[#FF7D4E]/90`}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='flex min-h-[calc(100vh-80px)]'>
        {/* Sidebar */}
        <div className='w-72 border-r bg-white px-8 py-8'>
          <div className='mb-6 rounded-md bg-[#F5F5F5] p-4'>
            <h3 className='mb-3 font-semibold text-gray-900'>
              Copy link to...
            </h3>
            <Button
              className={`ml-3 rounded-md bg-[#FF7D4E] p-6 text-sm text-white hover:bg-[#FF7D4E]/90`}
              onClick={() => {
                navigator.clipboard.writeText('https://t.me/+Mm3qL3aL7c0zNDE1');
              }}
            >
              STUDENT GROUP<br></br>TELEGRAM CHAT
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
              {Object.keys(allIGCategories).map((category) => (
                <div key={category} className='flex items-center space-x-2'>
                  <Checkbox
                    id={category}
                    checked={interestGroupFilters.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <label htmlFor={category} className='text-sm text-gray-700'>
                    {allIGCategories[category].toUpperCase()}
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
                checked={isInactive}
                onCheckedChange={(checked) =>
                  handleInactiveChange(checked as boolean)
                }
              />
              <label htmlFor='show-inactive' className='text-sm text-gray-700'>
                SHOW INACTIVE GROUPS
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 bg-[#0C2C47] px-16 py-8'>
          <div className='mb-8'>
            <h1 className='mb-2 text-4xl font-bold text-white'>
              Student Groups
            </h1>
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
              <div
                className={`mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`}
              >
                {paginateArray(page).map((group) => (
                  <div
                    key={group.id}
                    className='relative rounded-lg bg-white p-6'
                  >
                    {group.hasVerified && (
                      <div
                        className={`absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600`}
                      >
                        <span className='text-sm font-bold text-white'>V</span>
                      </div>
                    )}

                    {group.isInactive && (
                      <div
                        className={`absolute top-2 left-2 rounded bg-gray-500 px-2 py-1 text-xs text-white`}
                      >
                        INACTIVE
                      </div>
                    )}

                    <h3
                      className={`mb-3 text-center text-xl font-bold text-gray-900`}
                    >
                      {group.name}
                    </h3>
                    <p
                      className={`mb-4 line-clamp-6 text-sm leading-relaxed text-[#A1A1A1]`}
                    >
                      {group.description || 'No description available.'}
                    </p>

                    <p className='mb-4 text-sm text-gray-500'>
                      Headed by{' '}
                      {group.userOrg
                        .filter((userOnOrg) => userOnOrg.isIGHead)
                        .map((igHead) => igHead.user.name)
                        .join(', ')}
                    </p>

                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className={`border-[#0C2C47] bg-[#0C2C47] px-6 py-1 text-xs text-white hover:bg-[#0C2C47]/90`}
                        onClick={() => handleShowMore(group)}
                      >
                        SHOW MORE
                      </Button>
                      {group.inviteLink ? (
                        <Button
                          size='sm'
                          className={`bg-[#FF7D4E] px-4 py-1 text-xs text-white hover:bg-[#FF7D4E]/90`}
                          onClick={() =>
                            window.open(group.inviteLink, '_blank')
                          }
                        >
                          JOIN IG GROUP
                        </Button>
                      ) : (
                        <Button
                          size='sm'
                          className={`cursor-not-allowed bg-gray-400 px-3 py-1 text-xs text-white`}
                          disabled
                        >
                          NO GROUP LINK
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex items-center justify-center space-x-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className={`text-white hover:bg-white/10 hover:text-white/80`}
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    &lt;&lt;
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className={`text-white hover:bg-white/10 hover:text-white/80`}
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    &lt;
                  </Button>

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
                      <Button
                        key={pageNumber}
                        size='sm'
                        variant={page === pageNumber ? 'default' : 'ghost'}
                        className={
                          page === pageNumber
                            ? `min-w-[32px] bg-white text-[#0C2C47] hover:bg-white/90`
                            : `min-w-[32px] text-white hover:bg-white/10 hover:text-white/80`
                        }
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}

                  <Button
                    variant='ghost'
                    size='sm'
                    className={`text-white hover:bg-white/10 hover:text-white/80`}
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    &gt;
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className={`text-white hover:bg-white/10 hover:text-white/80`}
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    &gt;&gt;
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Show IG Modal */}
      <ShowIGModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        organisation={selectedOrg}
      />
    </>
  );
}
