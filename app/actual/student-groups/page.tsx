import StudentGroups from '@/components/student-group/StudentGroups';
import { getOrganisations } from '@/lib/utils/server/organisation';

export default async function GroupsPage() {
  const orgs = await getOrganisations();

  return <StudentGroups orgs={orgs} />;
}
