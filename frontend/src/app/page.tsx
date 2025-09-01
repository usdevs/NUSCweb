import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-white'>
      <Header />

      <div className='bg-navy-900 relative h-[738px] w-full overflow-hidden'>
        <div className='absolute inset-0'>
          <Image
            src='/images/hero.jpg'
            alt='Students performing'
            width={1440}
            height={738}
            className='h-full w-full object-cover'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-b from-[rgba(29,107,173,0)] to-[#0C2C47]'></div>
        </div>
        <div className='relative z-10 flex h-full items-center justify-center px-8'>
          <div className='flex flex-col items-center gap-16 md:flex-row'>
            <div className='order-first md:order-none'>
              <Image
                src='/images/mascot.png'
                alt='College mascot'
                width={492}
                height={498}
                priority
                className='w-48 translate-y-16 transform sm:w-56 md:w-72 lg:w-96'
              />
            </div>
            <h1 className='text-center text-3xl font-bold text-white md:text-left md:text-5xl lg:text-7xl'>
              <span className='block'>Welcome to</span>
              <span className='my-2 inline-block bg-[#FF7D4E] px-2'>
                NUS College
              </span>
              <span className='block'>Student Life</span>
            </h1>
          </div>
        </div>
      </div>

      <div className='bg-white px-8 py-16'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='flex flex-col justify-center'>
              <h2 className='mb-4 text-4xl font-bold'>Interest Groups</h2>
              <p className='mb-6 text-gray-600'>
                Ever wanted to try something new, meet cool people, or just have
                fun? Our Interest Groups are all about diving into hobbies,
                exploring new skills, and stepping outside your comfort zone —
                no experience needed! Whether you&apos;re into board games,
                photography, or even trying out a completely random skill,
                there&apos;s a group for you!
              </p>
              <Button
                variant='outline'
                className='w-fit rounded-[5px] border-[#FF7D4E] bg-[#FF7D4E] text-white hover:border-[#FF7D4E]/90 hover:bg-[#FF7D4E]/90 hover:text-white/90'
              >
                VIEW ALL
              </Button>
            </div>
            <div className='relative'>
              <Image
                src='/images/interest-groups.jpg'
                alt='Interest group activity'
                width={588}
                height={392}
                className='rounded-[30px]'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white px-8 py-16'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='relative order-2 md:order-1'>
              <Image
                src='/images/course-reviews.jpg'
                alt='Students discussing'
                width={588}
                height={392}
                className='rounded-[30px]'
              />
            </div>
            <div className='order-1 flex flex-col justify-center md:order-2'>
              <h2 className='mb-4 text-4xl font-bold'>Course Reviews</h2>
              <p className='mb-6 text-gray-600'>
                Not sure which courses to take? Learn from those who&apos;ve
                been there! Our Course Review section features insights from
                seniors who&apos;ve taken the classes you&apos;re considering —
                covering everything from workload and grading to hidden gems and
                survival tips.
              </p>
              <Button
                variant='outline'
                className='w-fit rounded-[5px] border-[#FF7D4E] bg-[#FF7D4E] text-white hover:border-[#FF7D4E]/90 hover:bg-[#FF7D4E]/90 hover:text-white/90'
              >
                VIEW ALL
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-auto'>
        <Footer />
      </div>
    </div>
  );
}
