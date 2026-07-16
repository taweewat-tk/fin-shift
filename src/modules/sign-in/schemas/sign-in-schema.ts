import { z } from 'zod';

export const signInFormSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;

export const signInFormDefaultValues: SignInFormValues = {
  email: '',
  password: '',
};
