import dayjs from 'dayjs';
import { z } from 'zod';

export const createExpenseFormSchema = z.object({
  amount: z.number().positive({ message: 'Amount must be greater than 0.' }),
  cardId: z.string().min(1, { message: 'Select a card.' }),
  categoryId: z.string().min(1, { message: 'Select a category.' }),
  date: z.string().min(1, { message: 'Select a date.' }),
  merchant: z.string().nullish(),
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseFormSchema>;

export const createExpenseFormDefaultValues: CreateExpenseFormValues = {
  amount: 0,
  cardId: '',
  categoryId: '',
  date: dayjs().format('YYYY-MM-DD'),
  merchant: '',
};
