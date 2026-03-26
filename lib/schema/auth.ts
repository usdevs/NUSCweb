import { TelegramUserData } from '@telegram-auth/server';

export default interface AuthCookie {
  userCredentials: TelegramUserData;
  userId: number;
  userOrgs: {
    id: number;
    name: string;
    isAdminOrg: boolean;
  }[];
  isAdmin: boolean;
  development?: true;
}
