import React from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-[#0C2C47] text-white py-4 px-8">
      <div className="flex justify-between items-center max-w-8xl mx-auto">
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon" className="p-0" asChild>
            <a href="https://www.linkedin.com/school/nus-college" target="_blank" rel="noopener noreferrer">
              <Image 
                src="/images/linkedin.png"
                alt="LinkedIn"
                width={16}
                height={16}
              />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-white/80" asChild>
            <a href="https://www.instagram.com/nuscollege" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-8 h-8" />
            </a>
          </Button>
        </div>
        <Button variant="outline" className="text-white hover:text-white/90 border-[#FF7D4E] hover:border-[#FF7D4E]/90 bg-[#FF7D4E] hover:bg-[#FF7D4E]/90 rounded-[5px]">
          REPORT A BUG
        </Button>
      </div>
    </footer>
  );
}