'use client'

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface OrganisationWithIGHead {
  id: string;
  name: string;
  description: string;
  category: string;
  isInactive: boolean;
  isInvisible: boolean;
  igHead?: {
    name: string;
    telegramHandle?: string;
  };
  inviteLink?: string;
  hasVerified?: boolean;
}

interface IGCategories {
  [key: string]: string;
}

const DEFAULT_FILTERS: string[] = ['Sports', 'SocioCultural', 'Others'];

// Utility function to make categories prettier
const makeCategoriesPrettier = (categories: any): IGCategories => {
  const prettierCategories: IGCategories = {};
  Object.keys(categories).forEach(key => {
    prettierCategories[key] = categories[key].replace(/([A-Z])/g, ' $1').trim();
  });
  return prettierCategories;
};

export default function StudentGroupsPage() {
  const [allOrgs, setAllOrgs] = useState<OrganisationWithIGHead[]>([]);
  const [igCardsToDisplay, setIgCardsToDisplay] = useState<OrganisationWithIGHead[]>([]);
  const [allIGCategories, setAllIGCategories] = useState<IGCategories>({});
  const [interestGroupFilters, setInterestGroupFilters] = useState<string[]>(DEFAULT_FILTERS);
  const [interestGroupSearchString, setInterestGroupSearchString] = useState('');
  const [isInactive, setIsInactive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.nusc.club/';
        
        const [orgsResponse, categoriesResponse] = await Promise.all([
          fetch(`${backendUrl}orgs`),
          fetch(`${backendUrl}orgs/categories`)
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
      setInterestGroupFilters(interestGroupFilters.filter((filter) => filter !== category));
    }
  };

  // Handle inactive filter change
  const handleInactiveChange = (checked: boolean) => {
    setIsInactive(checked);
  };

  // Filter and search logic
  useEffect(() => {
    const visibleCards = allOrgs.filter((card) => !card.isInvisible);
    const inactiveFilteredCards = visibleCards.filter((card) => !(card.isInactive && !isInactive));
    let filteredCards = inactiveFilteredCards.filter((card) =>
      interestGroupFilters.includes(card.category)
    );
    filteredCards = filteredCards.filter((ig) =>
      ig.name.toLowerCase().includes(interestGroupSearchString)
    );
    setIgCardsToDisplay(filteredCards);
    setPage(1);
  }, [interestGroupFilters, interestGroupSearchString, allOrgs, isInactive]);

  // Pagination logic
  const paginateArray = (pageNumber: number) => {
    return igCardsToDisplay.slice(
      (pageNumber - 1) * pageSize,
      (pageNumber - 1) * pageSize + pageSize
    );
  };
  
  const totalPages = Math.ceil(igCardsToDisplay.length / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF7D4E] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student groups...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading student groups: {error}</p>
            <Button onClick={() => window.location.reload()} className="bg-[#FF7D4E] hover:bg-[#FF7D4E]/90">
              Retry
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-72 bg-white px-8 py-8 border-r">
          <div className="mb-6 bg-[#F5F5F5] p-4 rounded-md">
            <h3 className="font-semibold text-gray-900 mb-3">Copy link to...</h3>
            <Button className="bg-[#FF7D4E] hover:bg-[#FF7D4E]/90 text-white text-sm ml-3 p-6 rounded-md">
              STUDENT GROUP<br></br>TELEGRAM CHAT
            </Button>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">SEARCH</h3>
            <Input 
              type="search" 
              placeholder="Search groups..." 
              className="w-full"
              onChange={onInput}
              value={interestGroupSearchString}
            />
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">CATEGORIES</h3>
            <div className="space-y-3">
              {Object.keys(allIGCategories).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={category}
                    checked={interestGroupFilters.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <label htmlFor={category} className="text-sm text-gray-700">
                    {allIGCategories[category].toUpperCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">OPTIONS</h3>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-inactive"
                checked={isInactive}
                onCheckedChange={(checked) => handleInactiveChange(checked as boolean)}
              />
              <label htmlFor="show-inactive" className="text-sm text-gray-700">
                SHOW INACTIVE GROUPS
              </label>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 bg-[#0C2C47] px-16 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Student Groups</h1>
            <p className="text-white/80">{igCardsToDisplay.length} RESULTS</p>
          </div>
          
          {/* Groups Grid */}
          {igCardsToDisplay.length === 0 ? (
            <div className="text-center text-white/80 py-16">
              <p className="text-xl mb-2">No student groups found</p>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginateArray(page).map((group) => (
                  <div key={group.id} className="bg-white rounded-lg p-6 relative">
                    {group.hasVerified && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">V</span>
                      </div>
                    )}
                    
                    {group.isInactive && (
                      <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
                        INACTIVE
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{group.name}</h3>
                    <p className="text-[#A1A1A1] text-sm mb-4 leading-relaxed line-clamp-6">
                      {group.description || "No description available."}
                    </p>
                    
                    {group.igHead && (
                      <p className="text-xs text-gray-500 mb-4">
                        Headed by {group.igHead.name}
                        {group.igHead.telegramHandle && ` (@${group.igHead.telegramHandle})`}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-[#0C2C47] text-white hover:bg-[#0C2C47]/90 border-[#0C2C47] text-xs px-6 py-1"
                      >
                        IG HEAD
                      </Button>
                      {group.inviteLink ? (
                        <Button 
                          size="sm" 
                          className="bg-[#FF7D4E] hover:bg-[#FF7D4E]/90 text-white text-xs px-4 py-1"
                          onClick={() => window.open(group.inviteLink, '_blank')}
                        >
                          JOIN IG GROUP
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-gray-400 text-white text-xs px-3 py-1 cursor-not-allowed"
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
                <div className="flex justify-center items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:text-white/80 hover:bg-white/10"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    &lt;&lt;
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:text-white/80 hover:bg-white/10"
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
                        size="sm"
                        variant={page === pageNumber ? "default" : "ghost"}
                        className={
                          page === pageNumber
                            ? "bg-white text-[#0C2C47] hover:bg-white/90 min-w-[32px]"
                            : "text-white hover:text-white/80 hover:bg-white/10 min-w-[32px]"
                        }
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:text-white/80 hover:bg-white/10"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    &gt;
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:text-white/80 hover:bg-white/10"
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
      <Footer />
    </div>
  );
}