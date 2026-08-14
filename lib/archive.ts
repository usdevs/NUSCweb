export interface ArchiveEdition {
  label: string;
  href: string;
}

export type ArchiveYear =
  | {
      year: string;
      editions?: undefined;
    }
  | {
      year: string;
      editions: readonly [ArchiveEdition, ...ArchiveEdition[]];
    };

export interface ArchiveDefinition {
  name: string;
  href: string;
  description: string;
  years: readonly ArchiveYear[];
}

export interface ArchiveDropdownItem {
  label: string;
  href: string;
}

export const newsletterArchive = {
  name: 'Newsletter Archive',
  href: '/newsletter',
  description:
    'Browse past NUS College Club newsletters and keep up with the stories, updates, and moments that shaped Student Life.',
  years: [
    // why: omitting editions is the single forthcoming state used by every archive surface.
    { year: 'AY26/27' },
    {
      year: 'AY25/26',
      editions: [
        {
          label: 'Issue 1 - Semester 1',
          href: 'https://ogmmddvrmieazwmy.public.blob.vercel-storage.com/newsletters/ay25-26/semester-1.pdf',
        },
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
          label: 'Issue 1 - Semester 1',
          href: 'https://ogmmddvrmieazwmy.public.blob.vercel-storage.com/newsletters/ay24-25/semester-1.pdf',
        },
        {
          label: 'Issue 2 - Semester 2',
          href: 'https://ogmmddvrmieazwmy.public.blob.vercel-storage.com/newsletters/ay24-25/semester-2.pdf',
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
  ],
} satisfies ArchiveDefinition;

export const wikiArchive = {
  name: 'Wiki Archive',
  href: '/wiki',
  description:
    'Explore the NUS College Club wiki archives for practical guides, community knowledge, and resources collected by students.',
  years: [
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
  ],
} satisfies ArchiveDefinition;

export const anchorForArchiveYear = (year: string) =>
  year.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');

export function getArchiveDropdownItems(
  archive: ArchiveDefinition,
): ArchiveDropdownItem[] {
  return archive.years.map((entry) => {
    if (entry.editions?.length === 1) {
      return { label: entry.year, href: entry.editions[0].href };
    }

    // why: forthcoming and multi-edition years need the index because no single destination is canonical.
    return {
      label: entry.year,
      href: `${archive.href}#${anchorForArchiveYear(entry.year)}`,
    };
  });
}
