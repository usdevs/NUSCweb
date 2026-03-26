'use client';

import { useMemo, useState } from 'react';

import CopyButton from '@/components/CopyButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OrganisationView } from '@/lib/utils/server/organisation';

interface ShowIGModalProps {
  organisation: OrganisationView | null;
}

export default function ShowIGModal({ organisation }: ShowIGModalProps) {
  // Extract IG Heads from the organisation data
  const igHeads = useMemo(() => {
    return organisation
      ? organisation.userOrgs.map((userOrg) => ({
          name: userOrg.user.name,
          telegramUserName: userOrg.user.telegramUserName,
        }))
      : [];
  }, [organisation]);

  const [selectedIGHead, setSelectedIGHead] = useState(igHeads[0]?.name ?? '');

  if (!organisation) return null;

  const getSelectedIGHeadTelegram = () => {
    const selectedHead = igHeads.find((head) => head.name === selectedIGHead);
    return selectedHead?.telegramUserName || '';
  };

  return (
    <Dialog>
      <DialogTrigger className='mr-auto cursor-pointer rounded-md border-[#0C2C47] bg-[#0C2C47] px-6 py-1 text-sm text-white hover:bg-[#0C2C47]/90'>
        SHOW MORE
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{`${organisation.name} Details`}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {/* Interest Group Name */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Interest Group Name
            </label>
            <div className='rounded-md border bg-gray-50 p-3'>
              <p className='text-sm text-gray-900'>{organisation.name}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Description
            </label>
            <div className='min-h-20 rounded-md border bg-gray-50 p-3'>
              <p className='text-sm leading-relaxed text-gray-900'>
                {organisation.description || 'No description available.'}
              </p>
            </div>
          </div>

          {/* TODO: Redo this IG section */}
          {/* TODO: Add the telegram group chat link as well */}
          {/* IG Head Selection */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              IG Head
            </label>
            {igHeads.length > 1 ? (
              <Select value={selectedIGHead} onValueChange={setSelectedIGHead}>
                <SelectTrigger className='rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden'>
                  <SelectValue placeholder='Select an IG Head' />
                </SelectTrigger>
                <SelectContent>
                  {igHeads.map((head) => (
                    <SelectItem key={head.name} value={head.name}>
                      {head.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className='rounded-md border bg-gray-50 p-3 py-2'>
                <p className='text-sm text-gray-900'>
                  {igHeads.length > 0 ? igHeads[0].name : 'No IG Head assigned'}
                </p>
              </div>
            )}
          </div>

          {/* IG Head's Telegram */}
          {getSelectedIGHeadTelegram() && (
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                IG Head&apos;s Telegram
              </label>
              <div className='flex items-center gap-2'>
                <div className='flex-1 rounded-md border bg-gray-50 p-3 py-2'>
                  <p className='text-sm text-gray-900'>
                    {getSelectedIGHeadTelegram()}
                  </p>
                </div>
                <CopyButton text={getSelectedIGHeadTelegram()} />
              </div>
            </div>
          )}

          {/* Status Indicators */}
          <div className='flex flex-wrap gap-2 pt-2'>
            {organisation.isInactive && (
              <span className='inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800'>
                Inactive
              </span>
            )}
            <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800'>
              {organisation.category}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
