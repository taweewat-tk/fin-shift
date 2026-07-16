import dayjs from 'dayjs';

import { type BillingCard, cycleForDate, dueDate } from './billing-cycle';

export interface LedgerExpense {
  id: string;
  date: Date;
  amount: number;
}

export interface LedgerCycle<T extends LedgerExpense> {
  start: Date;
  end: Date;
  dueDate: Date;
  totalAmount: number;
  expenses: T[];
}

export function buildLedger<T extends LedgerExpense>(
  card: BillingCard,
  expenses: T[]
): LedgerCycle<T>[] {
  const cyclesByEnd = new Map<string, LedgerCycle<T>>();

  for (const expense of expenses) {
    const cycle = cycleForDate(card, expense.date);
    const key = dayjs(cycle.end).format('YYYY-MM-DD');

    let ledgerCycle = cyclesByEnd.get(key);
    if (!ledgerCycle) {
      ledgerCycle = {
        start: cycle.start,
        end: cycle.end,
        dueDate: dueDate(card, cycle.end),
        totalAmount: 0,
        expenses: [],
      };
      cyclesByEnd.set(key, ledgerCycle);
    }

    ledgerCycle.totalAmount += expense.amount;
    ledgerCycle.expenses.push(expense);
  }

  return Array.from(cyclesByEnd.values()).sort((a, b) => b.end.getTime() - a.end.getTime());
}
