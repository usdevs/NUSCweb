import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex min-h-100 bg-[#0C2C47]'>
      <div className='min-h-[calc(100vh-125px)] w-72 bg-white px-8 py-4'>
        <Skeleton className='mb-6 h-10 w-full' />
        {[...Array<never>(7)].map((_, i) => (
          <Skeleton key={i} className='mb-2 h-6 w-full' />
        ))}
        <Skeleton className='mb-6 h-10 w-full' />
        {[...Array<never>(4)].map((_, i) => (
          <Skeleton key={i} className='mb-2 h-6 w-full' />
        ))}
      </div>
      <div className='flex-1 p-8'>
        <Skeleton className='mb-8 h-10 w-1/2' />
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array<never>(6)].map((_, i) => (
            <Skeleton key={i} className='mb-4 h-32 w-full' />
          ))}
        </div>
      </div>
    </div>
  );
}
