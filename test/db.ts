import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const testDb = new PrismaClient({ adapter });

export async function resetDb(): Promise<void> {
  const tables = await testDb.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;

  const names = tables
    .map(({ tablename }) => tablename)
    .filter(name => name !== '_prisma_migrations');

  if (names.length === 0) return;

  await testDb.$executeRawUnsafe(
    `TRUNCATE TABLE ${names.map(name => `"${name}"`).join(', ')} RESTART IDENTITY CASCADE`
  );
}
