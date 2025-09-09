import type { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

import type AuthCookie from '@/lib/schema/auth';
import { validateCookie } from '@/lib/utils/server/jwt';

export const hasOrgPerms = (authCookie: AuthCookie, orgId: number) =>
  authCookie.userOrgs.some((userOrg) => userOrg.id === orgId) ||
  authCookie.isOverallAdmin;

export const getAuthCookie = async (): Promise<
  (AuthCookie & JwtPayload) | undefined
> => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth');
  if (!authCookie) return undefined;

  let cookieContents;
  try {
    cookieContents = validateCookie(authCookie.value);
  } catch {
    // Invalid cookie, or expired
    cookieStore.delete('auth');
    return undefined;
  }

  return cookieContents.payload as AuthCookie & JwtPayload;
};
