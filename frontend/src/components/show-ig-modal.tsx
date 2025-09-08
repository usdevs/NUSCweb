'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { OrganisationView } from '@/lib/utils/server/organisation';

import BaseModal from './base-modal';

interface ShowIGModalProps {
  isOpen: boolean;
  onClose: () => void;
  organisation: OrganisationView | null;
}

export default function ShowIGModal({
  isOpen,
  onClose,
  organisation,
}: ShowIGModalProps) {
  const [selectedIGHead, setSelectedIGHead] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<{ [key: string]: boolean }>(
    {},
  );

  // Extract IG Heads from the organisation data
  const igHeads = useMemo(() => {
    return organisation
      ? organisation.userOrg.map((userOrg) => ({
          name: userOrg.user.name,
          telegramUserName: userOrg.user.telegramUserName,
        }))
      : [];
  }, [organisation]);

  // Set default selected IG Head if not already set
  React.useEffect(() => {
    if (igHeads.length > 0 && !selectedIGHead) {
      setSelectedIGHead(igHeads[0].name);
    }
  }, [igHeads, selectedIGHead]);

  if (!organisation) return null;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess({ ...copySuccess, [type]: true });
      setTimeout(() => {
        setCopySuccess({ ...copySuccess, [type]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getSelectedIGHeadTelegram = () => {
    const selectedHead = igHeads.find((head) => head.name === selectedIGHead);
    return selectedHead?.telegramUserName || '';
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${organisation.name} Details`}
      cancelLabel='CLOSE'
    >
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
          <div className='min-h-[80px] rounded-md border bg-gray-50 p-3'>
            <p className='text-sm leading-relaxed text-gray-900'>
              {organisation.description || 'No description available.'}
            </p>
          </div>
        </div>

        {/* IG Head Selection */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            IG Head
          </label>
          {igHeads.length > 1 ? (
            <select
              value={selectedIGHead}
              onChange={(e) => setSelectedIGHead(e.target.value)}
              className={`w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden`}
            >
              <option value=''>Select an IG Head</option>
              {igHeads.map((head) => (
                <option key={head.name} value={head.name}>
                  {head.name}
                </option>
              ))}
            </select>
          ) : (
            <div className='rounded-md border bg-gray-50 p-3'>
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
              <div className='flex-1 rounded-md border bg-gray-50 p-3'>
                <p className='text-sm text-gray-900'>
                  {getSelectedIGHeadTelegram()}
                </p>
              </div>
              <Button
                size='sm'
                variant='outline'
                onClick={() =>
                  copyToClipboard(getSelectedIGHeadTelegram(), 'telegram')
                }
                className='px-3 py-2 text-xs'
              >
                {copySuccess.telegram ? (
                  <span className='text-green-600'>Copied!</span>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect
                      x='9'
                      y='9'
                      width='13'
                      height='13'
                      rx='2'
                      ry='2'
                    ></rect>
                    <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path>
                  </svg>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Status Indicators */}
        <div className='flex flex-wrap gap-2 pt-2'>
          {organisation.isInactive && (
            <span
              className={`inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800`}
            >
              Inactive
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800`}
          >
            {organisation.category}
          </span>
        </div>
      </div>
    </BaseModal>
  );
}
