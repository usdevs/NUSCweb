import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { type NextRequest } from 'next/server';

import { getAuthCookie } from '@/lib/auth/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get('token');
  if (token === null) {
    return new Response('No token specified!', { status: 400 });
  }

  const [authCookie, org] = await Promise.all([
    getAuthCookie(),
    prisma.organisation.findUnique({
      where: { inviteToken: token },
    }),
  ]);

  if (!authCookie) {
    return new Response('Please login!', { status: 401 });
  }

  if (!org) {
    return new Response('Invalid token!', { status: 404 });
  }

  try {
    await prisma.userOnOrg.createMany({
      data: {
        userId: authCookie.userId,
        orgId: org.id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      return new Response('You already part of the organisation!', {
        status: 422,
      });
    }
    return new Response('Unknown error, please contact an admin.', {
      status: 500,
    });
  }

  return new Response(`You are now part of the organisation ${org.name}`, {
    status: 200,
  });
}
