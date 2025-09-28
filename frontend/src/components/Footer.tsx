import { InstagramIcon, LinkedinIcon } from 'lucide-react';
import Link from 'next/link';
import { FaFlickr } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className='sticky bottom-0 bg-[#0C2C47] px-8 py-4 text-white'>
      <div className='mx-auto flex items-center justify-between'>
        <div className='flex space-x-4'>
          <Button variant='ghost' size='icon' asChild>
            <a
              href='https://www.linkedin.com/school/nus-college'
              target='_blank'
              rel='noopener noreferrer'
            >
              <LinkedinIcon className='h-8 w-8' />
            </a>
          </Button>
          <Button variant='ghost' size='icon' asChild>
            <a
              href='https://www.instagram.com/nuscollege'
              target='_blank'
              rel='noopener noreferrer'
            >
              <InstagramIcon className='h-8 w-8' />
            </a>
          </Button>
          <Button variant='ghost' size='icon' asChild>
            <a
              href='https://www.flickr.com/photos/nuscclubcomms/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaFlickr className='h-8 w-8' />
            </a>
          </Button>
        </div>
        <Button
          variant='outline'
          className={`rounded-[5px] border-[#FF7D4E] bg-[#FF7D4E] text-white hover:border-[#FF7D4E]/90 hover:bg-[#FF7D4E]/90 hover:text-white/90`}
          asChild
        >
          <Link href='https://forms.gle/PbmJa9SDVMYxhaFYA' target='_blank'>
            REPORT A BUG
          </Link>
        </Button>
      </div>
    </footer>
  );
}
