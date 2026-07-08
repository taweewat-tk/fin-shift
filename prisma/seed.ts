import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const DEFAULT_CATEGORIES: { name: string; icon: string }[] = [
  { name: 'Dining', icon: 'utensils' },
  { name: 'Groceries', icon: 'shopping-cart' },
  { name: 'Online Shopping', icon: 'shopping-bag' },
  { name: 'Travel', icon: 'plane' },
  { name: 'Fuel', icon: 'fuel' },
  { name: 'Utilities', icon: 'zap' },
  { name: 'Entertainment', icon: 'film' },
  { name: 'Health', icon: 'heart-pulse' },
  { name: 'Other', icon: 'ellipsis' },
];

async function main(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  await prisma.$disconnect();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
