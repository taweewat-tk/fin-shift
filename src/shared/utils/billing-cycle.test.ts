import { describe, expect, it } from 'vitest';

import { bestCardForFloat, closingDate, cycleForDate, dueDate, floatDays } from './billing-cycle';

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

describe('cycleForDate', () => {
  const card = { statementClosingDay: 25, graceDays: 20 };

  it('assigns a purchase mid-cycle to the cycle closing later that month', () => {
    const cycle = cycleForDate(card, d(2026, 1, 10));
    expect(isSameDate(cycle.end, d(2026, 1, 25))).toBe(true);
    expect(isSameDate(cycle.start, d(2025, 12, 26))).toBe(true);
  });

  it('assigns a purchase ON the closing day to that same closing cycle', () => {
    const cycle = cycleForDate(card, d(2026, 1, 25));
    expect(isSameDate(cycle.end, d(2026, 1, 25))).toBe(true);
  });

  it('assigns a purchase the day AFTER closing to the next cycle', () => {
    const cycle = cycleForDate(card, d(2026, 1, 26));
    expect(isSameDate(cycle.end, d(2026, 2, 25))).toBe(true);
    expect(isSameDate(cycle.start, d(2026, 1, 26))).toBe(true);
  });

  it('rolls over the year boundary correctly', () => {
    const cycle = cycleForDate(card, d(2026, 12, 30));
    expect(isSameDate(cycle.end, d(2027, 1, 25))).toBe(true);
    expect(isSameDate(cycle.start, d(2026, 12, 26))).toBe(true);
  });
});

describe('month-length clamping (statementClosingDay = 31)', () => {
  const card = { statementClosingDay: 31, graceDays: 15 };

  it('clamps to Feb 28 in a non-leap year', () => {
    const cycle = cycleForDate(card, d(2026, 2, 10));
    expect(isSameDate(cycle.end, d(2026, 2, 28))).toBe(true);
  });

  it('clamps to Feb 29 in a leap year', () => {
    const cycle = cycleForDate(card, d(2024, 2, 10));
    expect(isSameDate(cycle.end, d(2024, 2, 29))).toBe(true);
  });

  it('clamps to the 30th in a 30-day month (April)', () => {
    const cycle = cycleForDate(card, d(2026, 4, 10));
    expect(isSameDate(cycle.end, d(2026, 4, 30))).toBe(true);
  });

  it('does not clamp in a 31-day month', () => {
    const cycle = cycleForDate(card, d(2026, 1, 10));
    expect(isSameDate(cycle.end, d(2026, 1, 31))).toBe(true);
  });

  it('clamps the PREVIOUS month boundary too, when computing cycle start', () => {
    // Purchase just after March's (unclamped) 31st close -> cycle starts Apr 1,
    // but the cycle before that started the day after Feb's clamped close.
    const cycle = cycleForDate(card, d(2026, 3, 5));
    expect(isSameDate(cycle.start, d(2026, 3, 1))).toBe(true); // day after Feb 28 close
    expect(isSameDate(cycle.end, d(2026, 3, 31))).toBe(true);
  });
});

describe('closingDate', () => {
  it('returns the same closing date as cycleForDate(...).end', () => {
    const card = { statementClosingDay: 25, graceDays: 20 };
    const date = d(2026, 1, 10);
    expect(isSameDate(closingDate(card, date), cycleForDate(card, date).end)).toBe(true);
  });
});

describe('dueDate', () => {
  it('adds graceDays to the closing date', () => {
    const card = { statementClosingDay: 25, graceDays: 20 };
    const due = dueDate(card, d(2026, 1, 25));
    expect(isSameDate(due, d(2026, 2, 14))).toBe(true);
  });

  it('spans a month/year boundary correctly', () => {
    const card = { statementClosingDay: 31, graceDays: 25 };
    const due = dueDate(card, d(2026, 12, 31));
    expect(isSameDate(due, d(2027, 1, 25))).toBe(true);
  });
});

describe('floatDays', () => {
  const card = { statementClosingDay: 25, graceDays: 20 };

  it('is at its minimum (= graceDays) for a purchase made ON the closing day', () => {
    expect(floatDays(card, d(2026, 1, 25))).toBe(20);
  });

  it('is at its maximum for a purchase made the day AFTER closing', () => {
    // cycle end = Feb 25, due = Mar 17; purchase Jan 26 -> due - purchase
    const float = floatDays(card, d(2026, 1, 26));
    expect(float).toBeGreaterThan(20);
    expect(float).toBe(50); // Jan26 -> Mar17 inclusive of the ~full next cycle + grace
  });

  it('decreases monotonically as the purchase date moves later within a cycle', () => {
    const early = floatDays(card, d(2026, 1, 26));
    const late = floatDays(card, d(2026, 2, 20));
    expect(early).toBeGreaterThan(late);
  });
});

describe('bestCardForFloat', () => {
  it('picks the card with the longest float for a purchase made today', () => {
    const freshlyClosedCard = { id: 'a', statementClosingDay: 25, graceDays: 20 };
    // today is Jan 26 in the fixed reference below: this card closed yesterday -> max float
    const aboutToCloseCard = { id: 'b', statementClosingDay: 26, graceDays: 20 };
    // this card closes today -> minimum float

    const today = d(2026, 1, 26);
    const best = bestCardForFloat([aboutToCloseCard, freshlyClosedCard], today);
    expect(best?.id).toBe('a');
  });

  it('breaks ties deterministically by preferring the longer grace period', () => {
    const shortGrace = { id: 'short', statementClosingDay: 25, graceDays: 10 };
    const longGrace = { id: 'long', statementClosingDay: 25, graceDays: 20 };

    const today = d(2026, 1, 25);
    const best = bestCardForFloat([shortGrace, longGrace], today);
    expect(best?.id).toBe('long');
  });

  it('returns undefined for an empty card list', () => {
    expect(bestCardForFloat([], d(2026, 1, 1))).toBeUndefined();
  });
});
