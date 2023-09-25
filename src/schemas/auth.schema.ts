import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string()
    .email({ message: 'email is not valid' })
    .nonempty("can't be empty") // eslint-disable-line quotes
    .min(3, { message: 'too short' })
    .max(50, { message: 'too long' }),
  password: z
    .string()
    .nonempty("can't be empty") // eslint-disable-line quotes
    .min(6, { message: 'too short' })
    .max(20, { message: 'too long' }),
});

export type AuthSchema = z.infer<typeof authSchema>;
