import ArchivePage, { type ArchiveYear } from '@/components/ArchivePage';

const newsletterYears: ArchiveYear[] = [
  { year: 'AY26/27' },
  {
    year: 'AY25/26',
    editions: [
      {
        label: 'Issue 2 - Semester 2',
        href: 'https://ogmmddvrmieazwmy.public.blob.vercel-storage.com/newsletters/ay25-26/semester-2.pdf',
      },
    ],
  },
  {
    year: 'AY24/25',
    editions: [
      {
        label: 'View edition',
        href: 'https://sites.google.com/view/nusc-wiki-2425/home',
      },
    ],
  },
  {
    year: 'AY22/23',
    editions: [
      {
        label: 'The NUSC Minute',
        href: 'https://ogmmddvrmieazwmy.public.blob.vercel-storage.com/newsletters/ay22-23/the-nusc-minute.pdf',
      },
    ],
  },
];

export default function NewsletterPage() {
  return (
    <ArchivePage
      archiveName='Newsletter Archive'
      description='Browse past NUS College Club newsletters and keep up with the stories, updates, and moments that shaped Student Life.'
      years={newsletterYears}
    />
  );
}
