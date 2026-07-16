import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';

import { signToken } from '@/server/auth';

import { makeCard, makeCategory, makeExpense, makeUser } from '../../../../../../../test/factories';

import { GET } from './route';

beforeAll(() => {
  process.env.JWT_SECRET = 'integration-test-secret-at-least-32-bytes';
});

function requestWithCookie(token: string): NextRequest {
  return new NextRequest('http://localhost/api/v1/cards/x/ledger', {
    headers: { cookie: `token=${token}` },
  });
}

function paramsFor(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

describe('GET /api/v1/cards/[id]/ledger', () => {
  it("groups the card's expenses into billing cycles with totals", async () => {
    const user = await makeUser();
    const card = await makeCard(user.id, { statementClosingDay: 25, graceDays: 20 });
    const category = await makeCategory();
    await makeExpense(user.id, card.id, category.id, {
      date: new Date(2026, 0, 10),
      amount: 100,
    });
    await makeExpense(user.id, card.id, category.id, {
      date: new Date(2026, 0, 20),
      amount: 50,
    });
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await GET(requestWithCookie(token), paramsFor(card.id));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toHaveLength(1);
    expect(json[0].totalAmount).toBe(150);
    expect(json[0].expenses).toHaveLength(2);
  });

  it("returns 404 for another user's card (isolation)", async () => {
    const owner = await makeUser({ email: 'owner@example.com' });
    const intruder = await makeUser({ email: 'intruder@example.com' });
    const card = await makeCard(owner.id);
    const intruderToken = await signToken({ sub: intruder.id, email: intruder.email });

    const response = await GET(requestWithCookie(intruderToken), paramsFor(card.id));

    expect(response.status).toBe(404);
  });

  it('rejects a missing token with 401', async () => {
    const response = await GET(
      new NextRequest('http://localhost/api/v1/cards/x/ledger'),
      paramsFor('x')
    );
    expect(response.status).toBe(401);
  });
});
