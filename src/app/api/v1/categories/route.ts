import { NextRequest, NextResponse } from 'next/server';

import { requireUser, UnauthorizedError } from '@/server/auth';
import { db } from '@/server/db';

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);
    const categories = await db.category.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(categories);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    throw error;
  }
}
