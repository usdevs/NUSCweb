'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { IGCategory, type Organisation } from '@prisma/client';
import { Edit, Search, Trash2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createOrganisation,
  deleteOrganisation,
  editOrganisation,
} from '@/lib/actions/organisation';
import { NewOrganisationClientSchema } from '@/lib/schema/organisation';

import OrganisationModal from './OrganisationModal';

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

  return (
    <div className='container mx-auto px-4 py-8'>
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
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              id='search'
              type='text'
              placeholder='Search organisations...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          {filteredOrganisations.map((org) => (
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
                    <Edit className='mr-1 h-4 w-4' />
                    EDIT
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDeleteSubmit(org.id)}
                    className='border-orange-200 text-orange-600 hover:border-orange-300 hover:text-orange-800'
                  >
                    <Trash2 className='mr-1 h-4 w-4' />
                    DELETE
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className='mt-8'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='#' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#' isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href='#' />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
