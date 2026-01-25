import * as z from 'zod';

export const formLoginSchema = z.object({
  email: z
    .string({ message: 'Por favor ingresa tu email.' })
    .min(1, { message: 'El campo es obligatorio.' })
    .email({ message: 'Ingresa un email válido.' })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Ingresa un email válido.' }),
});

export type FormLoginSchema = z.infer<typeof formLoginSchema>;
