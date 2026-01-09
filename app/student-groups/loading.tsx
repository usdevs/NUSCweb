import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex min-h-[calc(100vh-160px)]'>
      <div className='w-72 border-r bg-white px-8 py-8'>
        <Skeleton className='mb-6 h-10 w-full' />
        <Skeleton className='mb-6 h-10 w-full' />
        <Skeleton className='mb-6 h-10 w-full' />
        <Skeleton className='mb-6 h-10 w-full' />
      </div>
      <div className='flex-1 bg-[#0C2C47] px-16 py-8'>
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
