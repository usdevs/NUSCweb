import { getOrganisations } from '@/lib/utils/server/organisation';

import StudentGroups from '../../components/student-group/StudentGroups';

export default async function GroupsPage() {
  const orgs = await getOrganisations();

  return <StudentGroups orgs={orgs} />;
}
