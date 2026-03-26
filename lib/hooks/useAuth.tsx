'use client';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import type AuthCookie from '@/lib/schema/auth';

export function useAuth(): AuthCookie | undefined {
  const authCookie = Cookies.get('auth');
  let jwtPayload = undefined;
  if (authCookie !== undefined) {
    try {
      jwtPayload = jwtDecode<AuthCookie>(authCookie);
    } catch {}
  }
  return jwtPayload;
}
