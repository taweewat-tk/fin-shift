import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';

import { signToken } from '@/server/auth';

import { makeUser } from '../../../../../test/factories';

import { GET } from './route';

beforeAll(() => {
  process.env.JWT_SECRET = 'integration-test-secret-at-least-32-bytes';
});

function requestWithCookie(token: string): NextRequest {
  return new NextRequest('http://localhost/api/v1/me', {
    headers: { cookie: `token=${token}` },
  });
}

function requestWithBearer(token: string): NextRequest {
  return new NextRequest('http://localhost/api/v1/me', {
    headers: { authorization: `Bearer ${token}` },
  });
}

describe('GET /api/v1/me', () => {
  it('returns the authenticated user via cookie transport', async () => {
    const user = await makeUser({ email: 'cookie@example.com' });
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await GET(requestWithCookie(token));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toMatchObject({ id: user.id, email: user.email });
    expect(json.passwordHash).toBeUndefined();
  });

  it('returns the authenticated user via bearer transport (native app)', async () => {
    const user = await makeUser({ email: 'bearer@example.com' });
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await GET(requestWithBearer(token));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toMatchObject({ id: user.id, email: user.email });
  });

  it('never returns another user (per-user isolation)', async () => {
    const userA = await makeUser({ email: 'a@example.com' });
    const userB = await makeUser({ email: 'b@example.com' });
    const tokenA = await signToken({ sub: userA.id, email: userA.email });

    const response = await GET(requestWithCookie(tokenA));
    const json = await response.json();

    expect(json.id).toBe(userA.id);
    expect(json.id).not.toBe(userB.id);
  });

  it('rejects a missing token with 401', async () => {
    const response = await GET(new NextRequest('http://localhost/api/v1/me'));
    expect(response.status).toBe(401);
  });

  it('rejects an invalid token with 401', async () => {
    const response = await GET(requestWithCookie('not-a-real-token'));
    expect(response.status).toBe(401);
  });
});
