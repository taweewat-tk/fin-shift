import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';

import { signToken } from '@/server/auth';

import { makeCategory, makeUser } from '../../../../../test/factories';

import { GET } from './route';

beforeAll(() => {
  process.env.JWT_SECRET = 'integration-test-secret-at-least-32-bytes';
});

function requestWithCookie(token: string): NextRequest {
  return new NextRequest('http://localhost/api/v1/categories', {
    headers: { cookie: `token=${token}` },
  });
}

describe('GET /api/v1/categories', () => {
  it('returns all categories regardless of which user is asking', async () => {
    const userA = await makeUser({ email: 'a@example.com' });
    const userB = await makeUser({ email: 'b@example.com' });
    await makeCategory({ name: 'Groceries' });
    await makeCategory({ name: 'Transport' });
    const tokenA = await signToken({ sub: userA.id, email: userA.email });
    const tokenB = await signToken({ sub: userB.id, email: userB.email });

    const responseA = await GET(requestWithCookie(tokenA));
    const responseB = await GET(requestWithCookie(tokenB));

    expect(responseA.status).toBe(200);
    const jsonA = await responseA.json();
    const jsonB = await responseB.json();
    expect(jsonA).toHaveLength(2);
    expect(jsonA).toEqual(jsonB);
  });

  it('rejects a missing token with 401', async () => {
    const response = await GET(new NextRequest('http://localhost/api/v1/categories'));
    expect(response.status).toBe(401);
  });
});
