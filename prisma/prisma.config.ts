import 'dotenv/config';
import type { PrismaConfig } from 'prisma/config';

export default {
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
    seed: 'ts-node seed.ts',
  },
} satisfies PrismaConfig;
