import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';

import { signToken } from '@/server/auth';

import { makeCard, makeCategory, makeExpense, makeUser } from '../../../../../test/factories';

import { GET, POST } from './route';

beforeAll(() => {
  process.env.JWT_SECRET = 'integration-test-secret-at-least-32-bytes';
});

function requestWithCookie(token: string): NextRequest {
  return new NextRequest('http://localhost/api/v1/expenses', {
    headers: { cookie: `token=${token}` },
  });
}

function postRequest(token: string, body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/v1/expenses', {
    method: 'POST',
    headers: { cookie: `token=${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('GET /api/v1/expenses', () => {
  it("returns only the requesting user's expenses", async () => {
    const userA = await makeUser({ email: 'a@example.com' });
    const userB = await makeUser({ email: 'b@example.com' });
    const cardA = await makeCard(userA.id);
    const cardB = await makeCard(userB.id);
    const category = await makeCategory();
    await makeExpense(userA.id, cardA.id, category.id, { merchant: 'Coffee Shop' });
    await makeExpense(userB.id, cardB.id, category.id, { merchant: 'Bookstore' });
    const tokenA = await signToken({ sub: userA.id, email: userA.email });

    const response = await GET(requestWithCookie(tokenA));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toHaveLength(1);
    expect(json[0].merchant).toBe('Coffee Shop');
  });

  it('returns an empty list for a user with no expenses', async () => {
    const user = await makeUser();
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await GET(requestWithCookie(token));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it('rejects a missing token with 401', async () => {
    const response = await GET(new NextRequest('http://localhost/api/v1/expenses'));
    expect(response.status).toBe(401);
  });
});

describe('POST /api/v1/expenses', () => {
  it('creates an expense owned by the requesting user', async () => {
    const user = await makeUser();
    const card = await makeCard(user.id);
    const category = await makeCategory();
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await POST(
      postRequest(token, {
        amount: 350.5,
        date: '2026-07-10',
        cardId: card.id,
        categoryId: category.id,
        merchant: 'Coffee Shop',
      })
    );

    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json).toMatchObject({
      cardId: card.id,
      categoryId: category.id,
      merchant: 'Coffee Shop',
    });

    const listResponse = await GET(requestWithCookie(token));
    expect(await listResponse.json()).toHaveLength(1);
  });

  it("rejects creating an expense against another user's card", async () => {
    const owner = await makeUser({ email: 'owner@example.com' });
    const intruder = await makeUser({ email: 'intruder@example.com' });
    const ownerCard = await makeCard(owner.id);
    const category = await makeCategory();
    const intruderToken = await signToken({ sub: intruder.id, email: intruder.email });

    const response = await POST(
      postRequest(intruderToken, {
        amount: 100,
        date: '2026-07-10',
        cardId: ownerCard.id,
        categoryId: category.id,
      })
    );

    expect(response.status).toBe(404);
  });

  it('rejects an invalid payload with 400', async () => {
    const user = await makeUser();
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await POST(postRequest(token, { amount: -10 }));

    expect(response.status).toBe(400);
  });

  it('rejects a missing token with 401', async () => {
    const response = await POST(
      new NextRequest('http://localhost/api/v1/expenses', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      })
    );
    expect(response.status).toBe(401);
  });
});
