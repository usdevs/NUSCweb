import ArchivePage from '@/components/ArchivePage';
import { wikiArchive } from '@/lib/archive';

export default function WikiPage() {
  return <ArchivePage archive={wikiArchive} />;
}
