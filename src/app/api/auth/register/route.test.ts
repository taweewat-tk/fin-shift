import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';

import { testDb } from '../../../../../test/db';
import { makeUser } from '../../../../../test/factories';

import { POST } from './route';

beforeAll(() => {
  process.env.JWT_SECRET = 'integration-test-secret-at-least-32-bytes';
});

function registerRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/register', () => {
  it('creates a user, hashes the password, and sets an httpOnly cookie', async () => {
    const response = await POST(
      registerRequest({ email: 'new@example.com', password: 'password123', name: 'New User' })
    );

    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.user).toMatchObject({ email: 'new@example.com', name: 'New User' });
    expect(json.user.passwordHash).toBeUndefined();
    expect(typeof json.token).toBe('string');

    const setCookie = response.cookies.get('token');
    expect(setCookie?.value).toBe(json.token);
    expect(setCookie?.httpOnly).toBe(true);

    const stored = await testDb.user.findUniqueOrThrow({ where: { email: 'new@example.com' } });
    expect(stored.passwordHash).not.toBe('password123');
  });

  it('rejects a duplicate email with 409', async () => {
    await makeUser({ email: 'dup@example.com' });

    const response = await POST(
      registerRequest({ email: 'dup@example.com', password: 'password123', name: 'Someone' })
    );

    expect(response.status).toBe(409);
  });

  it('rejects an invalid payload with 400', async () => {
    const response = await POST(registerRequest({ email: 'not-an-email', password: '123' }));
    expect(response.status).toBe(400);
  });
});
