import { AuthDataValidator } from '@telegram-auth/server';
import { urlStrToAuthDataMap } from '@telegram-auth/server/utils';
import { addHours } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';
import type AuthCookie from '@/lib/schema/auth';
import { generateToken } from '@/lib/utils/server/jwt';

const validator = new AuthDataValidator({ botToken: process.env.BOT_TOKEN });

const NO_MATCHING_USER_MESSAGE = `You are not authorized to access the NUSC website!
Note: this may be an issue if you have recently changed your Telegram username without actually having logged into the NUSC website.
If so, please add your new username via the Admin tab.`;

const generatePermissions = async (userId: number) => {
  const userRoles = await prisma.userOnOrg.findMany({
    where: { userId },
    select: {
      org: {
        select: {
          id: true,
          name: true,
          isAdminOrg: true,
        },
      },
    },
  });

  const isAdmin = userRoles.some((userRole) => userRole.org.isAdminOrg);
  const userOrgs = userRoles.map((userRole) => userRole.org);

  return {
    userOrgs,
    isAdmin,
  };
};

export async function GET(req: Request) {
  const data = urlStrToAuthDataMap(req.url);

  let userCredentials;

  try {
    userCredentials = await validator.validate(data);
  } catch {
    return Response.json(
      'Failed to check user credentials against those obtained from the bot!',
      { status: StatusCodes.UNAUTHORIZED },
    );
  }

  const user = await prisma.user.findUnique({
    where: { telegramId: userCredentials.id.toString() },
  });

  if (user === null) {
    return Response.json(NO_MATCHING_USER_MESSAGE, {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const userId = user.id;

  const cookieStore = await cookies();
  const permissions = await generatePermissions(userId);
  const authObject: AuthCookie = {
    userCredentials,
    userId,
    ...permissions,
  };
  const token = generateToken(authObject);

  const in1hour = addHours(new Date(), 1);

  cookieStore.set('auth', token, {
    expires: in1hour,
  });

  const headersList = await headers();
  const redirectUrl = headersList.get('Referer') || '/';
  redirect(redirectUrl);
}
