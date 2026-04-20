import { EMAIL_REGEX } from '@/constants';
import * as z from 'zod';

export const formLoginSchema = z.object({
  email: z
    .string({ message: 'Por favor ingresa tu email.' })
    .min(1, { message: 'El campo es obligatorio.' })
    .email({ message: 'Ingresa un email válido.' })
    .regex(EMAIL_REGEX, { message: 'Ingresa un email válido.' }),
  acceptedTerms: z.boolean(),
});

export type FormLoginSchema = z.infer<typeof formLoginSchema>;
