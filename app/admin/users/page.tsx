import { redirect } from 'next/navigation';

import UsersPage from '@/components/admin/Users';
import { getAuthCookie } from '@/lib/auth/server';
import prisma from '@/lib/prisma';
import { getUsers } from '@/lib/utils/server/user';

export default async function OrganisationAdminPage() {
  const authCookie = await getAuthCookie();
  if (!authCookie || !authCookie.isAdmin) redirect('/');

  const [users, organisations] = await Promise.all([
    getUsers(),
    prisma.organisation.findMany(),
  ]);

  return <UsersPage users={users} organisations={organisations} />;
}
