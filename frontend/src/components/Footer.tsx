import { InstagramIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className='sticky bottom-0 bg-[#0C2C47] px-8 py-4 text-white'>
      <div className='mx-auto flex items-center justify-between'>
        <div className='flex space-x-4'>
          <Button variant='ghost' size='icon' className='p-0' asChild>
            <a
              href='https://www.linkedin.com/school/nus-college'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                src='/images/linkedin.png'
                alt='LinkedIn'
                width={16}
                height={16}
              />
            </a>
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className={`text-white hover:text-white/80`}
            asChild
          >
            <a
              href='https://www.instagram.com/nuscollege'
              target='_blank'
              rel='noopener noreferrer'
            >
              <InstagramIcon className='h-8 w-8' />
            </a>
          </Button>
        </div>
        <Button
          variant='outline'
          className={`rounded-[5px] border-[#FF7D4E] bg-[#FF7D4E] text-white hover:border-[#FF7D4E]/90 hover:bg-[#FF7D4E]/90 hover:text-white/90`}
        >
          REPORT A BUG
        </Button>
      </div>
    </footer>
  );
}
