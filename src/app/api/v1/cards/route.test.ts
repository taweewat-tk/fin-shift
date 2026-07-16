import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';

import { signToken } from '@/server/auth';

import { makeCard, makeUser } from '../../../../../test/factories';

import { GET, POST } from './route';

beforeAll(() => {
  process.env.JWT_SECRET = 'integration-test-secret-at-least-32-bytes';
});

function requestWithCookie(token: string): NextRequest {
  return new NextRequest('http://localhost/api/v1/cards', {
    headers: { cookie: `token=${token}` },
  });
}

function postRequest(token: string, body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/v1/cards', {
    method: 'POST',
    headers: { cookie: `token=${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('GET /api/v1/cards', () => {
  it("returns only the requesting user's cards", async () => {
    const userA = await makeUser({ email: 'a@example.com' });
    const userB = await makeUser({ email: 'b@example.com' });
    await makeCard(userA.id, { name: 'KBank Visa' });
    await makeCard(userB.id, { name: 'SCB Master' });
    const tokenA = await signToken({ sub: userA.id, email: userA.email });

    const response = await GET(requestWithCookie(tokenA));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toHaveLength(1);
    expect(json[0].name).toBe('KBank Visa');
  });

  it('returns an empty list for a user with no cards', async () => {
    const user = await makeUser();
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await GET(requestWithCookie(token));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it('rejects a missing token with 401', async () => {
    const response = await GET(new NextRequest('http://localhost/api/v1/cards'));
    expect(response.status).toBe(401);
  });
});

describe('POST /api/v1/cards', () => {
  it('creates a card owned by the requesting user', async () => {
    const user = await makeUser();
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await POST(
      postRequest(token, {
        name: 'KBank Visa',
        issuer: 'KBank',
        last4: '1234',
        creditLimit: 50000,
        statementClosingDay: 25,
        graceDays: 20,
      })
    );

    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json).toMatchObject({ name: 'KBank Visa', issuer: 'KBank', last4: '1234' });

    const listResponse = await GET(requestWithCookie(token));
    expect(await listResponse.json()).toHaveLength(1);
  });

  it('rejects an invalid payload with 400', async () => {
    const user = await makeUser();
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await POST(postRequest(token, { name: '', statementClosingDay: 40 }));

    expect(response.status).toBe(400);
  });

  it('rejects a missing token with 401', async () => {
    const response = await POST(
      new NextRequest('http://localhost/api/v1/cards', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      })
    );
    expect(response.status).toBe(401);
  });
});
