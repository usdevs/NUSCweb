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
      { label: 'SEMESTER 2', href: 'https://t.me/NUSChannel/6245' },
      { label: 'SEMESTER 1', href: 'https://t.me/NUSChannel/6005' },
    ],
  },
  {
    year: 'AY22/23',
    editions: [{ label: 'VIEW EDITION', href: 'https://t.me/NUSChannel/5207' }],
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
