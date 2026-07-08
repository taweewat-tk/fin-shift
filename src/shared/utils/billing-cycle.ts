import dayjs from 'dayjs';

export interface BillingCard {
  statementClosingDay: number;
  graceDays: number;
}

export interface BillingCycle {
  start: Date;
  end: Date;
}

function closingDateInMonth(closingDay: number, year: number, monthIndex: number): Date {
  const daysInMonth = dayjs(new Date(year, monthIndex, 1)).daysInMonth();
  const day = Math.min(closingDay, daysInMonth);
  return new Date(year, monthIndex, day);
}

export function cycleForDate(card: BillingCard, date: Date): BillingCycle {
  const reference = dayjs(date).startOf('day');
  const thisMonthClosing = closingDateInMonth(
    card.statementClosingDay,
    reference.year(),
    reference.month()
  );

  let cycleEnd: Date;
  if (reference.isAfter(dayjs(thisMonthClosing))) {
    const nextMonth = reference.add(1, 'month');
    cycleEnd = closingDateInMonth(card.statementClosingDay, nextMonth.year(), nextMonth.month());
  } else {
    cycleEnd = thisMonthClosing;
  }

  const previousMonth = dayjs(cycleEnd).subtract(1, 'month');
  const previousClosing = closingDateInMonth(
    card.statementClosingDay,
    previousMonth.year(),
    previousMonth.month()
  );
  const cycleStart = dayjs(previousClosing).add(1, 'day').toDate();

  return { start: cycleStart, end: cycleEnd };
}

export function closingDate(card: BillingCard, date: Date): Date {
  return cycleForDate(card, date).end;
}

export function dueDate(card: BillingCard, closing: Date): Date {
  return dayjs(closing).add(card.graceDays, 'day').toDate();
}

export function floatDays(card: BillingCard, purchaseDate: Date): number {
  const cycle = cycleForDate(card, purchaseDate);
  const due = dueDate(card, cycle.end);
  return dayjs(due).startOf('day').diff(dayjs(purchaseDate).startOf('day'), 'day');
}

export function bestCardForFloat<T extends BillingCard>(cards: T[], today: Date): T | undefined {
  if (cards.length === 0) return undefined;

  return cards.reduce((best, card) => {
    const bestFloat = floatDays(best, today);
    const cardFloat = floatDays(card, today);

    if (cardFloat > bestFloat) return card;
    if (cardFloat === bestFloat && card.graceDays > best.graceDays) return card;
    return best;
  });
}
