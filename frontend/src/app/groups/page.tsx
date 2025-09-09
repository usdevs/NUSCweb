import { getOrganisations } from '@/lib/utils/server/organisation';

import StudentGroups from './StudentGroups';

export default async function GroupsPage() {
  const orgs = await getOrganisations();

  return <StudentGroups orgs={orgs} />;
}
