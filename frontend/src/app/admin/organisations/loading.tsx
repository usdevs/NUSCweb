import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Skeleton className='mb-2 h-10 w-1/3' />
        <Skeleton className='mb-2 h-10 w-32' />
      </div>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
        <Skeleton className='h-10 w-full sm:w-1/2' />
        <Skeleton className='h-10 w-64' />
      </div>
      <div className='overflow-hidden rounded-lg border bg-white shadow-sm'>
        <div className='bg-slate-800 px-6 py-4 text-white'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <Skeleton className='h-6 w-1/2' />
            <Skeleton className='hidden h-6 w-1/4 md:block' />
            <Skeleton className='h-6 w-1/4' />
          </div>
        </div>
        <div className='divide-y divide-gray-200'>
          {[...Array<never>(6)].map((_, i) => (
            <div key={i} className='px-6 py-4'>
              <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-3'>
                <Skeleton className='h-6 w-2/3' />
                <Skeleton className='hidden h-6 w-1/3 md:block' />
                <Skeleton className='h-8 w-24' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
