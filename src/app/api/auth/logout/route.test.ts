import { describe, expect, it } from 'vitest';

import { POST } from './route';

describe('POST /api/auth/logout', () => {
  it('clears the auth cookie', async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    const cookie = response.cookies.get('token');
    expect(cookie?.value).toBe('');
  });
});
