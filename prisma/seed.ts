import { PrismaClient } from '@/prisma/generated/prisma/client';

const prisma = new PrismaClient()

type VenueResult = Awaited<ReturnType<typeof prisma.venue.upsert>>
type UserResult = Awaited<ReturnType<typeof prisma.user.upsert>>
type OrgResult = Awaited<ReturnType<typeof prisma.organisation.upsert>>

async function main() {
  const mph = await prisma.venue.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'WW MPH' },
  }) as VenueResult

  const user = await prisma.user.upsert({
    where: { telegramId: '03448833' },
    update: {},
    create: {
      name: 'Alex Lim',
      telegramId: '03448833',
      telegramUserName: '@AlexLim',
    },
  }) as UserResult

  const org = await prisma.organisation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'NUSC Badminton',
      description: 'NUS College Badminton Interest Group',
      category: 'Sports',
    },
  }) as OrgResult

  await prisma.userOnOrg.upsert({
    where: { userId_orgId: { userId: user.id, orgId: org.id } },
    update: {},
    create: { userId: user.id, orgId: org.id },
  })

  await prisma.booking.upsert({
    where: { id: 1 },
    update: {},
    create: {
      bookingName: 'Weekly Session Week 3',
      venueId: mph.id,
      userId: user.id,
      userOrgId: org.id,
      bookedForOrgId: org.id,
      start: new Date('2025-09-05T14:00:00.000Z'),
      end: new Date('2025-09-05T16:00:00.000Z'),
    },
  })

  await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      eventName: 'Taster Session',
      userId: user.id,
      userOrgId: org.id,
      bookedForOrgId: org.id,
      start: new Date('2025-09-12T14:00:00.000Z'),
      end: new Date('2025-09-12T17:00:00.000Z'),
    },
  })
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })