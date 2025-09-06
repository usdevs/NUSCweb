'use client';

import Cookies from 'js-cookie';

export function useAuth() {
  const authCookie = Cookies.get('auth');
  return authCookie !== undefined;
}
