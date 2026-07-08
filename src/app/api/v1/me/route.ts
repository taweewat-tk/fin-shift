import { NextRequest, NextResponse } from 'next/server';

import { requireUser, UnauthorizedError } from '@/server/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    throw error;
  }
}
