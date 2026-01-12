'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { IGCategory, type Organisation } from '@prisma/client';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EditIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react';
import { useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import OrganisationModal from '@/components/admin/OrganisationModal';
import CopyButton from '@/components/CopyButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
  createOrganisation,
  deleteOrganisation,
  editOrganisation,
} from '@/lib/actions/organisation';
import { NewOrganisationClientSchema } from '@/lib/schema/organisation';

const PAGE_SIZE = 9;

interface OrganisationsPageProps {
  organisations: Organisation[];
}

export default function OrganisationsPage({
  organisations,
}: OrganisationsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');

  const [selectedOrganisation, setSelectedOrganisation] =
    useState<Organisation | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [
    createOrganisationState,
    createOrganisationAction,
    createOrganisationPending,
  ] = useActionState(createOrganisation, null);
  const [
    editOrganisationState,
    editOrganisationAction,
    editOrganisationPending,
  ] = useActionState(editOrganisation, null);
  const [
    deleteOrganisationState,
    deleteOrganisationAction,
    deleteOrganisationPending,
  ] = useActionState(deleteOrganisation, null);

  const form = useForm<z.input<typeof NewOrganisationClientSchema>>({
    resolver: standardSchemaResolver(NewOrganisationClientSchema),
    defaultValues: {
      name: '',
      description: '',
      isAdminOrg: false,
      telegramUrl: '',
      category: IGCategory.Others,
    },
  });

  const handleCreateSubmit = (
    formData: z.input<typeof NewOrganisationClientSchema>,
  ) => {
    const newOrganisation = new FormData();
    newOrganisation.set('name', formData.name);
    if (formData.description)
      newOrganisation.set('description', formData.description);
    newOrganisation.set('isAdminOrg', formData.isAdminOrg.toString());
    if (formData.telegramUrl)
      newOrganisation.set('telegramUrl', formData.telegramUrl);
    newOrganisation.set('category', formData.category);

    createOrganisationAction(newOrganisation);
    setIsModalOpen(false);
  };

  const handleEditSubmit = (
    formData: z.input<typeof NewOrganisationClientSchema>,
  ) => {
    if (!selectedOrganisation) return;

    const editOrganisation = new FormData();
    editOrganisation.set('id', selectedOrganisation.id.toString());
    editOrganisation.set('name', formData.name);
    if (formData.description)
      editOrganisation.set('description', formData.description);
    editOrganisation.set('isAdminOrg', formData.isAdminOrg.toString());
    if (formData.telegramUrl)
      editOrganisation.set('telegramUrl', formData.telegramUrl);
    editOrganisation.set('category', formData.category);

    editOrganisationAction(editOrganisation);
    setSelectedOrganisation(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (
    formData: z.input<typeof NewOrganisationClientSchema>,
  ) => {
    const handle =
      selectedOrganisation === null ? handleCreateSubmit : handleEditSubmit;
    handle(formData);
  };

  const handleDeleteSubmit = (organisationId: number) => {
    const deleteOrganisation = new FormData();
    deleteOrganisation.set('id', organisationId.toString());
    deleteOrganisationAction(deleteOrganisation);
    setSelectedOrganisation(null);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedOrganisation(null);

    form.reset({
      name: '',
      description: '',
      isAdminOrg: false,
      telegramUrl: '',
      category: IGCategory.Others,
    });
  };

  // Filter organizations based on search and category
  const filteredOrganisations = organisations.filter((org) => {
    const matchesSearch = org.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All categories' || org.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filteredOrganisations.length / PAGE_SIZE);

  // Pagination logic
  const paginateArray = (pageNumber: number) => {
    return filteredOrganisations.slice(
      (pageNumber - 1) * PAGE_SIZE,
      pageNumber * PAGE_SIZE,
    );
  };

  return (
    <div className='relative container mx-auto px-4 py-8'>
      {(createOrganisationPending ||
        editOrganisationPending ||
        deleteOrganisationPending) && (
        <div className='bg-opacity-60 absolute inset-0 z-50 flex items-center justify-center bg-white'>
          <div className='h-24 w-24'>
            <Spinner />
          </div>
        </div>
      )}
      {/* Header */}
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-3xl font-bold text-slate-800'>
          Manage Organisations
        </h1>

        <OrganisationModal
          form={form}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          handleClose={handleCloseModal}
          selectedOrganisation={selectedOrganisation}
          handleDeleteOrganisation={handleDeleteSubmit}
          handleSubmitOrganisation={handleSubmit}
          isPending={
            createOrganisationPending ||
            editOrganisationPending ||
            deleteOrganisationPending
          }
        />
      </div>

      {/* Search and Filter */}
      <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
        <div className='flex-1'>
          <Label
            htmlFor='search'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            SEARCH
          </Label>
          <div className='relative'>
            <SearchIcon className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              id='search'
              type='text'
              placeholder='Search organisations...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Reset page on search
                setPage(1);
              }}
              className='pl-10'
            />
          </div>
        </div>

        <div className='sm:w-64'>
          <Label
            htmlFor='category-filter'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            FILTER BY CATEGORY
          </Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id='category-filter'>
              <SelectValue placeholder='All categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All categories'>All categories</SelectItem>
              {Object.keys(IGCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-lg border bg-white shadow-sm'>
        {/* Table Header */}
        <div className='bg-slate-800 px-6 py-4 text-white'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='font-medium'>NAME</div>
            <div className='hidden font-medium md:block'>CATEGORY</div>
            <div className='text-right font-medium'>ACTIONS</div>
          </div>
        </div>

        {/* Table Body */}
        <div className='divide-y divide-gray-200'>
          {paginateArray(page).map((org) => (
            <div
              key={org.id}
              className='px-6 py-4 transition-colors hover:bg-gray-50'
            >
              <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-3'>
                <div className='font-medium text-gray-900'>
                  {org.name}
                  <div className='mt-1 text-sm text-gray-500 md:hidden'>
                    {org.category}
                  </div>
                </div>
                <div className='hidden text-gray-600 md:block'>
                  {org.category}
                </div>
                <div className='flex justify-end gap-2'>
                  {org.telegramUrl && (
                    <CopyButton
                      text={org.telegramUrl}
                      labelText='COPY TELEGRAM URL'
                    />
                  )}
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setSelectedOrganisation(org);
                      form.setValue('name', org.name);
                      form.setValue('description', org.description);
                      form.setValue('category', org.category);
                      if (org.telegramUrl)
                        form.setValue('telegramUrl', org.telegramUrl);
                      form.setValue('isAdminOrg', org.isAdminOrg);
                      setIsModalOpen(true);
                    }}
                    className='text-gray-600 hover:text-gray-800'
                  >
                    <EditIcon className='mr-1 h-4 w-4' />
                    EDIT
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-orange-200 text-orange-600 hover:border-orange-300 hover:text-orange-800'
                      >
                        <Trash2Icon className='mr-1 h-4 w-4' />
                        DELETE
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the organisation "{org.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSubmit(org.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                aria-label='Go to first page'
                size='default'
                className='px-2.5 text-gray-600 hover:bg-white/10 hover:text-white/80'
                onClick={() => setPage(1)}
              >
                <ChevronsLeftIcon className='h-4 w-4' />
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                aria-label='Go to previous page'
                size='default'
                className='px-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
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
                    aria-label={`Go to page ${pageNumber}`}
                    size='default'
                    className={`px-2.5 ${
                      page === pageNumber
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
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
                className='px-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
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
                className='px-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                onClick={() => setPage(totalPages)}
              >
                <ChevronsRightIcon className='h-4 w-4' />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
