import { AuthDataValidator } from '@telegram-auth/server';
import { urlStrToAuthDataMap } from '@telegram-auth/server/utils';
import { StatusCodes } from 'http-status-codes';
import { default as jwt } from 'jsonwebtoken';
import { cookies } from 'next/headers';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

const validator = new AuthDataValidator({ botToken: process.env.BOT_TOKEN });

const SECRET_KEY = process.env.SECRET_KEY || 'hello';
const NO_MATCHING_USER_MESSAGE = `You are not authorized to access the NUSC website!
Note: this may be an issue if you have recently changed your Telegram username without actually having logged into the NUSC website.
If so, please add your new username via the Admin tab.`;

// const idk = () => {
//   const { token, orgIds, userCredentials, userId, permissions } = res;
//   if (userCredentials === undefined) {
//     throw new Error('Undefined userCredentials received');
//   }
//   const userInfo = {
//     firstName: userCredentials.first_name,
//     telegramId: userCredentials.id,
//     photoUrl: userCredentials.photo_url,
//     username: userCredentials.username,
//   };
//   setAuth({
//     token,
//     orgIds,
//     userInfo,
//     userId,
//     permissions,
//     setupTime: new Date(),
//   });
//   window.location.reload();
// };

const generateToken = (payload: string | Buffer | object): string =>
  jwt.sign(payload, SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });

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

  const isOverallAdmin = userRoles.some((userRole) => userRole.org.isAdminOrg);
  const userOrgs = userRoles.map((userRole) => userRole.org.name);

  return {
    userOrgs,
    isOverallAdmin,
  };
};

export async function GET(req: Request) {
  const data = urlStrToAuthDataMap(req.url);

  let userCredentials;

  try {
    userCredentials = await validator.validate(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      'Failed to check user credentials against those obtained from the bot!',
      { status: StatusCodes.UNAUTHORIZED },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      telegramId: userCredentials.id.toString(),
    },
  });

  let userId;
  if (user === null) {
    return Response.json(NO_MATCHING_USER_MESSAGE, {
      status: StatusCodes.UNAUTHORIZED,
    });
  } else {
    // Update telegram details in the database
    // When the user was initially created, we did not have their telegramId
    userId = user.id;
    let name = `${userCredentials.first_name}`;
    // because last name is optional on Tele
    if (userCredentials.last_name) {
      name += ` ${userCredentials.last_name}`;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name,
        telegramId: userCredentials.id.toString(),
        telegramUserName: userCredentials.username,
      },
    });
  }

  const userOrgs = await prisma.userOnOrg.findMany({
    where: {
      userId: userId,
    },
    include: {
      org: {
        select: {
          isAdminOrg: true,
        },
      },
    },
  });

  const cookieStore = await cookies();
  const orgIds = userOrgs.map((userOrg) => userOrg.orgId);
  const permissions = await generatePermissions(userId);
  const token = generateToken({
    userCredentials,
    orgIds,
    userId,
    permissions,
  });

  const in1hour = new Date();
  in1hour.setTime(in1hour.getTime() + 60 * 60 * 1000);
  console.log(token);

  cookieStore.set('token', token, {
    expires: in1hour,
  });
  redirect('/');
}
