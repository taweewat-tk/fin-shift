import type { Card, Category, Expense, User } from '@prisma/client';

import { testDb } from './db';

let counter = 0;
function unique(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export async function makeUser(overrides: Partial<User> = {}): Promise<User> {
  return testDb.user.create({
    data: {
      email: overrides.email ?? `${unique('user')}@example.com`,
      passwordHash: overrides.passwordHash ?? 'hashed-password',
      name: overrides.name ?? unique('User'),
      ...overrides,
    },
  });
}

export async function makeCard(userId: string, overrides: Partial<Card> = {}): Promise<Card> {
  return testDb.card.create({
    data: {
      userId,
      name: overrides.name ?? unique('Card'),
      issuer: overrides.issuer ?? 'KBank',
      last4: overrides.last4 ?? '1234',
      creditLimit: overrides.creditLimit ?? 50000,
      statementClosingDay: overrides.statementClosingDay ?? 25,
      graceDays: overrides.graceDays ?? 20,
      color: overrides.color ?? null,
      ...overrides,
    },
  });
}

export async function makeCategory(overrides: Partial<Category> = {}): Promise<Category> {
  return testDb.category.create({
    data: {
      name: overrides.name ?? unique('Category'),
      icon: overrides.icon ?? null,
      ...overrides,
    },
  });
}

export async function makeExpense(
  userId: string,
  cardId: string,
  categoryId: string,
  overrides: Partial<Expense> = {}
): Promise<Expense> {
  return testDb.expense.create({
    data: {
      userId,
      cardId,
      categoryId,
      amount: overrides.amount ?? 100,
      date: overrides.date ?? new Date(),
      merchant: overrides.merchant ?? null,
      note: overrides.note ?? null,
      ...overrides,
    },
  });
}
