import { getOrganisations } from '@/lib/utils/server/organisation';

import StudentGroupsPage from './component';

export default async function GroupsPage() {
  const orgs = await getOrganisations();

  return <StudentGroupsPage orgs={orgs} />;
}
