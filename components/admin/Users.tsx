'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import type { Organisation } from '@/prisma/generated/prisma';
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
import type { z } from 'zod/v4';

import UserModal from '@/components/admin/UserModal';
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
import { Spinner } from '@/components/ui/spinner';
import { deleteUser, editUser } from '@/lib/actions/user';
import { UpdateUserSchema } from '@/lib/schema/user';
import type { UserView } from '@/lib/utils/server/user';

const PAGE_SIZE = 9;

interface UsersPageProps {
  users: UserView[];
  organisations: Organisation[];
}

export default function UsersPage({ users, organisations }: UsersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedUser, setSelectedUser] = useState<UserView | null>(null);

  const [editUserState, editUserAction, editUserPending] = useActionState(
    editUser,
    null,
  );
  const [deleteUserState, deleteUserAction, deleteUserPending] = useActionState(
    deleteUser,
    null,
  );

  const form = useForm<z.input<typeof UpdateUserSchema>>({
    resolver: standardSchemaResolver(UpdateUserSchema),
    defaultValues: {
      organisationIds: [],
    },
  });

  const handleEditSubmit = (formData: z.input<typeof UpdateUserSchema>) => {
    if (!selectedUser) return;

    const editOrganisation = new FormData();
    editOrganisation.set('id', selectedUser.id.toString());
    formData.organisationIds.forEach((orgId) =>
      editOrganisation.append('organisationIds', orgId.toString()),
    );

    editUserAction(editOrganisation);
    setSelectedUser(null);
  };

  const handleDeleteSubmit = (userId: number) => {
    const deleteUser = new FormData();
    deleteUser.set('id', userId.toString());
    deleteUserAction(deleteUser);
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);

    form.reset({
      organisationIds: [],
    });
  };

  // Filter organizations based on search and category
  const filtedUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telegramUserName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filtedUsers.length / PAGE_SIZE);

  // Pagination logic
  const paginateArray = (pageNumber: number) => {
    return filtedUsers.slice(
      (pageNumber - 1) * PAGE_SIZE,
      pageNumber * PAGE_SIZE,
    );
  };

  return (
    <div className='relative container mx-auto px-4 py-8'>
      {(editUserPending || deleteUserPending) && (
        <div className='bg-opacity-60 absolute inset-0 z-50 flex items-center justify-center bg-white'>
          <div className='h-24 w-24'>
            <Spinner />
          </div>
        </div>
      )}
      {/* Header */}
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-3xl font-bold text-slate-800'>Manage Users</h1>

        {selectedUser && (
          <UserModal
            form={form}
            selectedUser={selectedUser}
            handleClose={handleCloseModal}
            handleDeleteUser={handleDeleteSubmit}
            handleEditUser={handleEditSubmit}
            organisations={organisations}
            isPending={editUserPending || deleteUserPending}
          />
        )}
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
              placeholder='Search users...'
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
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-lg border bg-white shadow-sm'>
        {/* Table Header */}
        <div className='bg-slate-800 px-6 py-4 text-white'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='font-medium'>NAME</div>
            <div className='hidden font-medium md:block'>TELE HANDLE</div>
            <div className='hidden font-medium md:block'>ORGANISATIONS</div>
            <div className='text-right font-medium'>ACTIONS</div>
          </div>
        </div>

        {/* Table Body */}
        <div className='divide-y divide-gray-200'>
          {paginateArray(page).map((user) => (
            <div
              key={user.id}
              className='px-6 py-4 transition-colors hover:bg-gray-50'
            >
              <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
                <div className='font-medium text-gray-900'>
                  {user.name}
                  <div className='mt-1 text-sm text-gray-500 md:hidden'>
                    {user.telegramUserName}
                  </div>
                  <div className='mt-1 text-sm text-gray-500 md:hidden'>
                    {user.userOrgs
                      .map((userOrg) => userOrg.org.name)
                      .join(', ')}
                  </div>
                </div>
                <div className='hidden text-gray-600 md:block'>
                  {user.telegramUserName}
                </div>
                <div className='hidden text-gray-600 md:block'>
                  {user.userOrgs.map((userOrg) => userOrg.org.name).join(', ')}
                </div>
                <div className='flex justify-end gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setSelectedUser(user);
                      form.setValue(
                        'organisationIds',
                        user.userOrgs.map((userOrg) => userOrg.org.id),
                      );
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
                          delete the user &quot;{user.name}&quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSubmit(user.id)}
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
        <div className='mt-6 flex justify-center'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  aria-label='Go to first page'
                  size='default'
                  className='px-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
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
        </div>
      )}
    </div>
  );
}
