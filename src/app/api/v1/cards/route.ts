import { NextRequest, NextResponse } from 'next/server';

import { requireUser, UnauthorizedError } from '@/server/auth';
import { cardInputSchema } from '@/server/cards/schema';
import { db } from '@/server/db';

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const cards = await db.card.findMany({ where: { userId: user.id } });
    return NextResponse.json(cards);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const parsed = cardInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const card = await db.card.create({ data: { userId: user.id, ...parsed.data } });
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    throw error;
  }
}
