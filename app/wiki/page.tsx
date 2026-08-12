import ArchivePage, { type ArchiveYear } from '@/components/ArchivePage';

const wikiYears: ArchiveYear[] = [
  { year: 'AY25/26' },
  {
    year: 'AY24/25',
    editions: [
      {
        label: 'VIEW WIKI',
        href: 'https://sites.google.com/view/nusc-wiki-2425/home',
      },
    ],
  },
  {
    year: 'AY23/24',
    editions: [
      {
        label: 'VIEW WIKI',
        href: 'https://nusc-wiki.gitbook.io/nusc-wiki-23-24/',
      },
    ],
  },
  {
    year: 'AY22/23',
    editions: [
      {
        label: 'VIEW WIKI',
        href: 'https://nusc-wiki.gitbook.io/nusc-wiki-22/',
      },
    ],
  },
];

export default function WikiPage() {
  return (
    <ArchivePage
      archiveName='Wiki Archive'
      description='Explore the NUS College Club wiki archives for practical guides, community knowledge, and resources collected by students.'
      years={wikiYears}
    />
  );
}
