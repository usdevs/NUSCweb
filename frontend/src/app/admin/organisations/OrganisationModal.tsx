'use client';

import { IGCategory, Organisation } from '@prisma/client';
import { Plus, Trash2Icon } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import z from 'zod/v4';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/hooks/useAuth';
import { NewOrganisationClientSchema } from '@/lib/schema/organisation';

interface OrganisationModalProps {
  form: UseFormReturn<z.input<typeof NewOrganisationClientSchema>>;
  selectedOrganisation: Organisation | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  handleDeleteOrganisation: (bookingId: number) => void;
  handleSubmitOrganisation: (
    formData: z.input<typeof NewOrganisationClientSchema>,
  ) => void;
}

export default function OrganisationModal({
  form,
  isOpen,
  setIsOpen,
  handleClose,
  selectedOrganisation,
  handleDeleteOrganisation,
  handleSubmitOrganisation,
}: OrganisationModalProps) {
  const authToken = useAuth();

  return (
    <Form {...form}>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) handleClose();
        }}
      >
        <DialogTrigger asChild>
          {authToken?.isAdmin && (
            <Button className='bg-orange-500 text-white hover:bg-orange-600'>
              <Plus className='mr-2 h-4 w-4' />
              CREATE NEW ORGANISATION
            </Button>
          )}
        </DialogTrigger>
        <DialogContent aria-describedby={undefined}>
          <form
            onSubmit={form.handleSubmit(handleSubmitOrganisation)}
            className={`flex flex-col gap-3 sm:max-w-md`}
          >
            <DialogHeader className='bg-[#0C2C47] text-white'>
              <DialogTitle>
                {selectedOrganisation === null
                  ? 'CREATE A NEW ORGANISATION'
                  : 'EDIT ORGANISATION'}
              </DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-[1fr_2fr] items-center gap-3'>
                    <FormLabel>NAME</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        id='name'
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Enter name'
                        className='placeholder:text-gray-500'
                        required
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-[1fr_2fr] items-center gap-3'>
                    <FormLabel>DESCRIPTION</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        id='description'
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Enter description'
                        className='placeholder:text-gray-500'
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem
                  className={`grid grid-cols-[1fr_2fr] items-center gap-3`}
                >
                  <FormLabel>CATEGORY</FormLabel>
                  <Select
                    // value={field.value}
                    defaultValue={IGCategory.Others}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className='[margin-block-end:0]'>
                        <SelectValue placeholder='Select organisation' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-background'>
                      <SelectGroup>
                        {Object.keys(IGCategory).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='telegramUrl'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-[1fr_2fr] items-center gap-3'>
                    <FormLabel>TELEGRAM CHAT LINK</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        id='telegramUrl'
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Enter telegram chat url'
                        className='placeholder:text-gray-500'
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isAdminOrg'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-3'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                    <FormLabel>IS AN ADMIN ORGANISATION</FormLabel>
                  </div>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='sm:justify-between'>
              {selectedOrganisation !== null && (
                <Button
                  variant='destructive'
                  size='icon'
                  className={`rounded-[5px] border-none bg-[#FF7D4E] px-6 text-white hover:bg-[#FF7D4E]/90`}
                  onClick={(e) => {
                    handleDeleteOrganisation(selectedOrganisation.id);
                    e.preventDefault();
                  }}
                >
                  <Trash2Icon />
                </Button>
              )}

              <div className='ml-auto flex gap-2'>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button
                  type='submit'
                  className={`rounded-[5px] border-none bg-[#FF7D4E] px-4 text-white hover:bg-[#FF7D4E]/90`}
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
