import { z } from 'zod';

export const createCardFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  issuer: z.string().min(1, { message: 'Issuer is required.' }),
  last4: z.string().regex(/^\d{4}$/, { message: 'Enter the last 4 digits.' }),
  creditLimit: z.number().positive({ message: 'Credit limit must be greater than 0.' }),
  statementClosingDay: z
    .number()
    .int()
    .min(1)
    .max(31, { message: 'Enter a day between 1 and 31.' }),
  graceDays: z.number().int().min(0, { message: 'Grace days cannot be negative.' }),
});

export type CreateCardFormValues = z.infer<typeof createCardFormSchema>;

export const createCardFormDefaultValues: CreateCardFormValues = {
  name: '',
  issuer: '',
  last4: '',
  creditLimit: 0,
  statementClosingDay: 25,
  graceDays: 20,
};
