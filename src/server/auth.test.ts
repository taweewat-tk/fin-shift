import { beforeAll, describe, expect, it } from 'vitest';

import { signToken, verifyToken } from './auth';

beforeAll(() => {
  process.env.JWT_SECRET = 'unit-test-secret-at-least-32-bytes-long';
});

describe('signToken / verifyToken', () => {
  it('round-trips the subject and email through a signed token', async () => {
    const token = await signToken({ sub: 'user-1', email: 'a@example.com' });
    const payload = await verifyToken(token);
    expect(payload).toEqual({ sub: 'user-1', email: 'a@example.com' });
  });

  it('rejects a tampered token', async () => {
    const token = await signToken({ sub: 'user-1', email: 'a@example.com' });
    const [header, payload, signature] = token.split('.');
    // Flip an interior character (not the last one, which can land on a
    // base64url "don't-care" padding bit and silently decode identically).
    const chars = payload.split('');
    chars[2] = chars[2] === 'a' ? 'b' : 'a';
    const tamperedPayload = chars.join('');
    await expect(verifyToken(`${header}.${tamperedPayload}.${signature}`)).rejects.toThrow();
  });

  it('rejects a token signed with a different secret', async () => {
    const token = await signToken({ sub: 'user-1', email: 'a@example.com' });
    process.env.JWT_SECRET = 'a-completely-different-secret-value-here';
    await expect(verifyToken(token)).rejects.toThrow();
    process.env.JWT_SECRET = 'unit-test-secret-at-least-32-bytes-long';
  });
});
