import { PrismaClient } from '@/prisma/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  const mph = await prisma.venue.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'WW MPH' },
  });

  const user = await prisma.user.upsert({
    where: { telegramId: '03448833' },
    update: {},
    create: {
      name: 'Alex Lim',
      telegramId: '03448833',
      telegramUserName: 'AlexLim',
    },
  });

  const org = await prisma.organisation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'NUSC Badminton',
      description: 'NUS College Badminton Interest Group',
      category: 'Sports',
    },
  });

  await prisma.userOnOrg.upsert({
    where: { userId_orgId: { userId: user.id, orgId: org.id } },
    update: {},
    create: { userId: user.id, orgId: org.id },
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.booking.upsert({
    where: { id: 1 },
    update: {},
    create: {
      bookingName: 'Weekly Session Week 3',
      venueId: mph.id,
      userId: user.id,
      userOrgId: org.id,
      bookedForOrgId: org.id,
      start: new Date(Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 10, 0, 0)),
      end: new Date(Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 12, 0, 0)),
    },
  });

  await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      eventName: 'Taster Session',
      userId: user.id,
      userOrgId: org.id,
      bookedForOrgId: org.id,
      start: new Date(Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 8, 0, 0)),
      end: new Date(Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 10, 0, 0)),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
