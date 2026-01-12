import ShowIGModal from '@/components/student-group/IgModal';
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
      className='relative flex flex-col rounded-lg bg-white p-6'
    >
      {organisation.isInactive && (
        <div className='absolute top-2 left-2 rounded bg-gray-500 px-2 py-1 text-xs text-white'>
          INACTIVE
        </div>
      )}

      <h3 className='mb-3 text-center text-xl font-bold text-gray-900'>
        {organisation.name}
      </h3>
      <p className='mb-4 line-clamp-6 text-sm leading-relaxed text-gray-500'>
        {organisation.description || 'No description available.'}
      </p>

      {organisation.userOrgs.length !== 0 && (
        <p className='mb-4 text-sm text-[#A1A1A1]'>
          Headed by{' '}
          {organisation.userOrgs.map((igHead) => igHead.user.name).join(', ')}
        </p>
      )}

      <ShowIGModal organisation={organisation} />
    </div>
  );
}
