'use client';

import type { Organisation } from '@prisma/client';
import { Trash2Icon } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import z from 'zod/v4';

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { UpdateUserSchema } from '@/lib/schema/user';
import type { UserView } from '@/lib/utils/server/user';

interface UserModalProps {
  form: UseFormReturn<z.input<typeof UpdateUserSchema>>;
  selectedUser: UserView;
  handleClose: () => void;
  handleDeleteUser: (userId: number) => void;
  handleEditUser: (formData: z.input<typeof UpdateUserSchema>) => void;
  organisations: Organisation[];
  isPending: boolean;
}

export default function UserModal({
  form,
  handleClose,
  selectedUser,
  handleDeleteUser,
  handleEditUser,
  organisations,
  isPending,
}: UserModalProps) {
  const groupedOrganisations = Object.groupBy(
    organisations,
    (org) => org.category,
  );

  return (
    <Form {...form}>
      <Dialog
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent aria-describedby={undefined}>
          <form
            onSubmit={form.handleSubmit(handleEditUser)}
            className='flex flex-col gap-3 sm:max-w-md'
          >
            <DialogHeader className='bg-[#0C2C47] text-white'>
              <DialogTitle>EDIT USER</DialogTitle>
            </DialogHeader>
            <div className='grid grid-cols-[1fr_2fr] items-center gap-3'>
              <div>NAME</div>
              <div>{selectedUser.name}</div>
            </div>
            <div className='grid grid-cols-[1fr_2fr] items-center gap-3'>
              <div>TELEGRAM USERNAME</div>
              <div>{selectedUser.telegramUserName}</div>
            </div>
            <FormField
              control={form.control}
              name='organisationIds'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-[1fr_2fr] items-center gap-3'>
                    <FormLabel>ORGANISATIONS</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={Object.entries(groupedOrganisations).map(
                          ([category, orgs]) => ({
                            heading: category,
                            options: orgs.map((org) => ({
                              label: org.name,
                              value: org.id.toString(),
                            })),
                          }),
                        )}
                        onValueChange={field.onChange}
                        defaultValue={field.value.map((num) => num.toString())}
                        placeholder='Select organisations...'
                        hideSelectAll
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter className='sm:justify-between'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='destructive'
                    size='icon'
                    className='rounded-[5px] border-none bg-[#FF7D4E] px-6 text-white hover:bg-[#FF7D4E]/90'
                    disabled={isPending}
                  >
                    <Trash2Icon />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the user &quot;{selectedUser.name}&quot;.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        handleDeleteUser(selectedUser.id);
                        e.preventDefault();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <div className='ml-auto flex gap-2'>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button
                  type='submit'
                  className='rounded-[5px] border-none bg-[#FF7D4E] px-4 text-white hover:bg-[#FF7D4E]/90'
                  disabled={isPending}
                >
                  Submit
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
