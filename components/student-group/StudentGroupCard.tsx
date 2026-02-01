import Link from 'next/link';
import { Fragment } from 'react';

import CopyButton from '@/components/CopyButton';
import ShowIGModal from '@/components/student-group/IgModal';
import { Button } from '@/components/ui/button';
import { getCategoryBgColor } from '@/lib/formOptions';
import type { OrganisationView } from '@/lib/utils/server/organisation';

interface StudentGroupCardProps {
  organisation: OrganisationView;
}

export default function StudentGroupCard({
  organisation,
}: StudentGroupCardProps) {
  return (
    <div
      key={organisation.id}
      className={`relative flex flex-col rounded-lg p-6 ${getCategoryBgColor(organisation.category)}`}
    >
      {organisation.isInactive && (
        <div className='absolute top-2 left-2 rounded bg-gray-500 px-2 py-1 text-xs text-white'>
          INACTIVE
        </div>
      )}

      <h3 className='mb-3 text-center text-xl font-bold text-gray-900'>
        {organisation.name}
      </h3>
      <p className='mb-4 line-clamp-6 grow text-sm leading-relaxed text-gray-500'>
        {organisation.description || 'No description available.'}
      </p>

      {organisation.userOrgs.length !== 0 && (
        <p className='mb-4 text-sm text-[#A1A1A1]'>
          Headed by{' '}
          {organisation.userOrgs.map((igHead) => igHead.user.name).join(', ')}
        </p>
      )}

      <div className='flex'>
        <ShowIGModal organisation={organisation} />
        {organisation.telegramUrl && (
          <div className='flex items-center gap-1'>
            <CopyButton text={organisation.telegramUrl} iconOnly />
            <Button
              size='sm'
              className='rounded-md bg-[#FF7D4E] text-sm text-white hover:bg-[#FF7D4E]/90'
            >
              <Link
                href={organisation.telegramUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                Join the Telegram chat
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
