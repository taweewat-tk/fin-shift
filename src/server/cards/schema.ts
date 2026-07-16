import { z } from 'zod';

export const cardInputSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  last4: z.string().regex(/^\d{4}$/),
  creditLimit: z.number().positive(),
  statementClosingDay: z.number().int().min(1).max(31),
  graceDays: z.number().int().min(0),
  color: z.string().nullish(),
});

export const updateCardSchema = cardInputSchema.partial();
