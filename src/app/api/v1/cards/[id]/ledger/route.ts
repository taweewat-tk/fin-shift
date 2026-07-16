import { NextRequest, NextResponse } from 'next/server';

import { requireUser, UnauthorizedError } from '@/server/auth';
import { db } from '@/server/db';
import { buildLedger } from '@/shared/utils/ledger';

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

    const expenses = await db.expense.findMany({ where: { cardId: card.id } });
    const ledger = buildLedger(
      card,
      expenses.map(expense => ({ ...expense, amount: Number(expense.amount) }))
    );

    return NextResponse.json(ledger);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    throw error;
  }
}
