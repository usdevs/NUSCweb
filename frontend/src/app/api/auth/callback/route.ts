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

  let user = await prisma.user.findUnique({
    where: { telegramId: userCredentials.id.toString() },
  });

  if (user === null) {
    let name = `${userCredentials.first_name}`;
    if (userCredentials.last_name) {
      name += ` ${userCredentials.last_name}`;
    }

    user = await prisma.user.create({
      data: {
        name: name,
        telegramId: userCredentials.id.toString(),
        telegramUserName: userCredentials.username!,
      },
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
