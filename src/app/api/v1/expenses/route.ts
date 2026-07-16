import { NextRequest, NextResponse } from 'next/server';

import { requireUser, UnauthorizedError } from '@/server/auth';
import { db } from '@/server/db';
import { expenseInputSchema } from '@/server/expenses/schema';

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const expenses = await db.expense.findMany({ where: { userId: user.id } });
    return NextResponse.json(expenses);
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
    const parsed = expenseInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const card = await db.card.findFirst({
      where: { id: parsed.data.cardId, userId: user.id },
    });
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const expense = await db.expense.create({ data: { userId: user.id, ...parsed.data } });
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    throw error;
  }
}
