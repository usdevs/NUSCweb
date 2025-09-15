import { redirect } from 'next/navigation';

import OrganisationsPage from '@/components/admin/Organisations';
import { getAuthCookie } from '@/lib/auth/server';
import prisma from '@/lib/prisma';

export default async function OrganisationAdminPage() {
  const authCookie = await getAuthCookie();
  if (!authCookie) redirect('/');

  const organisations = await prisma.organisation.findMany(
    authCookie.isAdmin
      ? undefined
      : {
          where: {
            userOrgs: {
              some: {
                userId: authCookie.userId,
              },
            },
          },
        },
  );
  return <OrganisationsPage organisations={organisations} />;
}
