import { jwtVerify, SignJWT } from 'jose';
import type { NextRequest } from 'next/server';

import { db } from './db';

export const AUTH_COOKIE_NAME = 'token';
const TOKEN_TTL = '7d';

export interface AuthTokenPayload {
  sub: string;
  email: string;
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
    throw new Error('Invalid token payload');
  }
  return { sub: payload.sub, email: payload.email };
}

function extractToken(request: NextRequest): string | undefined {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length);
  }

  return undefined;
}

export async function requireUser(request: NextRequest) {
  const token = extractToken(request);
  if (!token) throw new UnauthorizedError();

  let payload: AuthTokenPayload;
  try {
    payload = await verifyToken(token);
  } catch {
    throw new UnauthorizedError();
  }

  const user = await db.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new UnauthorizedError();

  return user;
}
