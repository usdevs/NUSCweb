import { AuthDataValidator } from '@telegram-auth/server';
import { urlStrToAuthDataMap } from '@telegram-auth/server/utils';
import { addHours } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import type AuthCookie from '@/lib/schema/auth';
import { generateToken } from '@/lib/utils/server/jwt';

const validator = new AuthDataValidator({ botToken: process.env.BOT_TOKEN });

const generatePermissions = async (userId: number) => {
  const userRoles = await prisma.userOnOrg.findMany({
    where: {
      userId,
      deleted: false,
    },
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

export async function GET(req: NextRequest) {
  if (process.env.VERCEL === '1') {
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
      domain: process.env.VERCEL_PROJECT_PRODUCTION_URL!.replace('www.', ''),
      secure: true,
      sameSite: 'lax',
      expires: in1hour,
    });
  } else {
    if (!process.env.TELEGRAM_ID)
      return Response.json('Set TELEGRAM_ID to test login locally', {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });

    const user = await prisma.user.findUnique({
      where: { telegramId: process.env.TELEGRAM_ID },
    });

    if (!user)
      return Response.json(
        `No user found with telegram id ${process.env.TELEGRAM_ID}`,
        { status: StatusCodes.UNPROCESSABLE_ENTITY },
      );

    const userId = user.id;

    const cookieStore = await cookies();
    const permissions = await generatePermissions(userId);
    const authObject: AuthCookie = {
      userCredentials: {
        id: Number.parseInt(process.env.TELEGRAM_ID, 10),
        first_name: user.name,
      },
      userId: userId,
      ...permissions,
      development: true,
    };
    const token = generateToken(authObject);

    const in1hour = addHours(new Date(), 1);

    cookieStore.set('auth', token, {
      domain: process.env.TEST_DOMAIN || undefined,
      sameSite: 'lax',
      expires: in1hour,
    });
  }

  const headersList = await headers();
  const redirectUrl = headersList.get('Referer') || '/';
  redirect(redirectUrl);
}
