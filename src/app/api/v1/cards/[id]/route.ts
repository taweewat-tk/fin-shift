import { NextRequest, NextResponse } from 'next/server';

import { requireUser, UnauthorizedError } from '@/server/auth';
import { updateCardSchema } from '@/server/cards/schema';
import { db } from '@/server/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    const card = await db.card.findFirst({ where: { id, userId: user.id } });
    if (!card) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(card);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    throw error;
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireUser(request);
    const { id } = await params;

    const body = await request.json();
    const parsed = updateCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await db.card.findFirst({ where: { id, userId: user.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const card = await db.card.update({ where: { id }, data: parsed.data });
    return NextResponse.json(card);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    throw error;
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireUser(request);
    const { id } = await params;

    const existing = await db.card.findFirst({ where: { id, userId: user.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await db.card.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    throw error;
  }
}
