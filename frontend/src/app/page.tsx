import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="relative h-[738px] w-full bg-navy-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Students performing"
            width={1440}
            height={738}
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(29,107,173,0)] to-[#0C2C47]"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-full px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="order-first md:order-none">
            <Image
              src="/images/mascot.png"
              alt="College mascot"
              width={492}
              height={498}
              priority
              className="transform translate-y-16 w-48 sm:w-56 md:w-72 lg:w-96"
            />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white text-center md:text-left">
              <span className="block">Welcome to</span>
              <span className="bg-[#FF7D4E] px-2 my-2 inline-block">NUS College</span>
              <span className="block">Student Life</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Interest Groups</h2>
              <p className="text-gray-600 mb-6">
                Ever wanted to try something new, meet cool people, or just have fun? 
                Our Interest Groups are all about diving into hobbies, exploring new skills, 
                and stepping outside your comfort zone — no experience needed! Whether you&apos;re into 
                board games, photography, or even trying out a completely random skill, there&apos;s a group for you!
              </p>
              <Button variant="outline" className="text-white hover:text-white/90 border-[#FF7D4E] hover:border-[#FF7D4E]/90 bg-[#FF7D4E] hover:bg-[#FF7D4E]/90 w-fit rounded-[5px]">
                VIEW ALL
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/images/interest-groups.jpg"
                alt="Interest group activity"
                width={588}
                height={392}
                className="rounded-[30px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative order-2 md:order-1">
              <Image
                src="/images/course-reviews.jpg"
                alt="Students discussing"
                width={588}
                height={392}
                className="rounded-[30px]"
              />
            </div>
            <div className="flex flex-col justify-center order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-4">Course Reviews</h2>
              <p className="text-gray-600 mb-6">
                Not sure which courses to take? Learn from those who&apos;ve been there! 
                Our Course Review section features insights from seniors who&apos;ve taken 
                the classes you&apos;re considering — covering everything from workload and 
                grading to hidden gems and survival tips.
              </p>
              <Button variant="outline" className="text-white hover:text-white/90 border-[#FF7D4E] hover:border-[#FF7D4E]/90 bg-[#FF7D4E] hover:bg-[#FF7D4E]/90 w-fit rounded-[5px]">
                VIEW ALL
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}