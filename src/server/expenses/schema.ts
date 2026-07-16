import { z } from 'zod';

export const expenseInputSchema = z.object({
  amount: z.number().positive(),
  date: z.coerce.date(),
  cardId: z.string().min(1),
  categoryId: z.string().min(1),
  merchant: z.string().nullish(),
  note: z.string().nullish(),
});

export const updateExpenseSchema = expenseInputSchema.partial();
