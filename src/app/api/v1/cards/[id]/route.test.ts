import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';

import { signToken } from '@/server/auth';

import { makeCard, makeUser } from '../../../../../../test/factories';

import { DELETE, GET, PATCH } from './route';

beforeAll(() => {
  process.env.JWT_SECRET = 'integration-test-secret-at-least-32-bytes';
});

function requestWithCookie(token: string): NextRequest {
  return new NextRequest('http://localhost/api/v1/cards/x', {
    headers: { cookie: `token=${token}` },
  });
}

function paramsFor(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

describe('GET /api/v1/cards/[id]', () => {
  it("returns the requester's card", async () => {
    const user = await makeUser();
    const card = await makeCard(user.id, { name: 'KBank Visa' });
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await GET(requestWithCookie(token), paramsFor(card.id));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.id).toBe(card.id);
  });

  it("returns 404 for another user's card (isolation)", async () => {
    const owner = await makeUser({ email: 'owner@example.com' });
    const intruder = await makeUser({ email: 'intruder@example.com' });
    const card = await makeCard(owner.id);
    const intruderToken = await signToken({ sub: intruder.id, email: intruder.email });

    const response = await GET(requestWithCookie(intruderToken), paramsFor(card.id));

    expect(response.status).toBe(404);
  });

  it('returns 404 for a nonexistent card', async () => {
    const user = await makeUser();
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await GET(requestWithCookie(token), paramsFor('nonexistent-id'));

    expect(response.status).toBe(404);
  });

  it('rejects a missing token with 401', async () => {
    const response = await GET(new NextRequest('http://localhost/api/v1/cards/x'), paramsFor('x'));
    expect(response.status).toBe(401);
  });
});

function patchRequest(token: string, body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/v1/cards/x', {
    method: 'PATCH',
    headers: { cookie: `token=${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('PATCH /api/v1/cards/[id]', () => {
  it("updates the requester's card", async () => {
    const user = await makeUser();
    const card = await makeCard(user.id, { name: 'Old Name' });
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await PATCH(patchRequest(token, { name: 'New Name' }), paramsFor(card.id));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.name).toBe('New Name');
  });

  it("returns 404 when updating another user's card (isolation)", async () => {
    const owner = await makeUser({ email: 'owner2@example.com' });
    const intruder = await makeUser({ email: 'intruder2@example.com' });
    const card = await makeCard(owner.id);
    const intruderToken = await signToken({ sub: intruder.id, email: intruder.email });

    const response = await PATCH(
      patchRequest(intruderToken, { name: 'Hijacked' }),
      paramsFor(card.id)
    );

    expect(response.status).toBe(404);
  });

  it('rejects an invalid payload with 400', async () => {
    const user = await makeUser();
    const card = await makeCard(user.id);
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await PATCH(
      patchRequest(token, { statementClosingDay: 40 }),
      paramsFor(card.id)
    );

    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/v1/cards/[id]', () => {
  it("deletes the requester's card", async () => {
    const user = await makeUser();
    const card = await makeCard(user.id);
    const token = await signToken({ sub: user.id, email: user.email });

    const response = await DELETE(requestWithCookie(token), paramsFor(card.id));
    expect(response.status).toBe(204);

    const getResponse = await GET(requestWithCookie(token), paramsFor(card.id));
    expect(getResponse.status).toBe(404);
  });

  it("returns 404 when deleting another user's card (isolation)", async () => {
    const owner = await makeUser({ email: 'owner3@example.com' });
    const intruder = await makeUser({ email: 'intruder3@example.com' });
    const card = await makeCard(owner.id);
    const intruderToken = await signToken({ sub: intruder.id, email: intruder.email });

    const response = await DELETE(requestWithCookie(intruderToken), paramsFor(card.id));

    expect(response.status).toBe(404);
  });

  it('rejects a missing token with 401', async () => {
    const response = await DELETE(
      new NextRequest('http://localhost/api/v1/cards/x'),
      paramsFor('x')
    );
    expect(response.status).toBe(401);
  });
});
