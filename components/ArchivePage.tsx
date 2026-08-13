import { ExternalLinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { anchorForArchiveYear, type ArchiveDefinition } from '@/lib/archive';

export default function ArchivePage({
  archive,
}: {
  archive: ArchiveDefinition;
}) {
  return (
    <>
      <section className='relative h-80 w-full overflow-hidden md:h-104'>
        <Image
          src='/images/hero.jpg'
          alt='Students performing at a NUS College event'
          fill
          sizes='100vw'
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-b from-[rgba(29,107,173,0)] to-[#0C2C47]' />
        <div className='relative z-10 flex h-full items-end px-8 pb-12 md:px-16 md:pb-16'>
          <h1 className='text-4xl font-bold text-white md:text-6xl'>
            {archive.name}
          </h1>
        </div>
      </section>

      <section className='bg-white px-8 py-14 md:px-16 md:py-20'>
        <div className='mx-auto max-w-7xl'>
          <p className='max-w-3xl text-lg leading-8 text-gray-600'>
            {archive.description}
          </p>

          <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {archive.years.map((year) => (
              <article
                key={year.year}
                id={anchorForArchiveYear(year.year)}
                className='flex min-h-56 scroll-mt-24 flex-col items-center justify-center bg-[#FFF4E5] p-8 text-center'
              >
                <h2 className='text-2xl font-bold text-[#0C2C47] uppercase'>
                  {year.year}
                </h2>
                {year.editions ? (
                  <ul className='mt-6 space-y-3'>
                    {year.editions.map((edition) => (
                      <li key={edition.href}>
                        <Link
                          href={edition.href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 font-semibold text-[#FF7D4E] underline decoration-2 underline-offset-4 hover:text-[#0C2C47] focus-visible:text-[#0C2C47]'
                        >
                          {edition.label}
                          <ExternalLinkIcon
                            className='h-4 w-4 shrink-0'
                            aria-hidden='true'
                          />
                          <span className='sr-only'>(opens in a new tab)</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='mt-6 font-semibold text-gray-500'>
                    FORTHCOMING
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
