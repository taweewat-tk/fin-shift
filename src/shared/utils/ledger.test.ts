import { describe, expect, it } from 'vitest';

import { buildLedger } from './ledger';

function d(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

describe('buildLedger', () => {
  const card = { statementClosingDay: 25, graceDays: 20 };

  it('groups expenses into the cycle they fall in and totals each cycle', () => {
    const expenses = [
      { id: '1', date: d(2026, 1, 10), amount: 100 },
      { id: '2', date: d(2026, 1, 20), amount: 50 },
      { id: '3', date: d(2026, 1, 26), amount: 200 },
    ];

    const ledger = buildLedger(card, expenses);

    expect(ledger).toHaveLength(2);
    const januaryCycle = ledger.find(cycle => isSameDate(cycle.end, d(2026, 1, 25)));
    expect(januaryCycle?.totalAmount).toBe(150);
    expect(januaryCycle?.expenses).toHaveLength(2);

    const februaryCycle = ledger.find(cycle => isSameDate(cycle.end, d(2026, 2, 25)));
    expect(februaryCycle?.totalAmount).toBe(200);
    expect(februaryCycle?.expenses).toHaveLength(1);
  });

  it('returns cycles ordered most-recent-first', () => {
    const expenses = [
      { id: '1', date: d(2026, 1, 10), amount: 100 },
      { id: '2', date: d(2026, 3, 5), amount: 50 },
      { id: '3', date: d(2026, 2, 1), amount: 20 },
    ];

    const ledger = buildLedger(card, expenses);

    expect(ledger.map(cycle => cycle.end.getMonth())).toEqual([2, 1, 0]);
  });

  it('returns an empty ledger for no expenses', () => {
    expect(buildLedger(card, [])).toEqual([]);
  });
});
