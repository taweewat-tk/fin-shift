import bcrypt from 'bcrypt';
import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';

import { makeUser } from '../../../../../test/factories';

import { POST } from './route';

beforeAll(() => {
  process.env.JWT_SECRET = 'integration-test-secret-at-least-32-bytes';
});

function loginRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials and sets a cookie', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    const user = await makeUser({ email: 'login@example.com', passwordHash });

    const response = await POST(
      loginRequest({ email: 'login@example.com', password: 'correct-password' })
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.user.id).toBe(user.id);
    expect(typeof json.token).toBe('string');
    expect(response.cookies.get('token')?.value).toBe(json.token);
  });

  it('rejects a wrong password with 401', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    await makeUser({ email: 'wrong@example.com', passwordHash });

    const response = await POST(
      loginRequest({ email: 'wrong@example.com', password: 'wrong-password' })
    );

    expect(response.status).toBe(401);
  });

  it('rejects an unknown email with 401', async () => {
    const response = await POST(
      loginRequest({ email: 'nobody@example.com', password: 'whatever123' })
    );
    expect(response.status).toBe(401);
  });
});
