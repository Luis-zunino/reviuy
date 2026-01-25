import * as z from 'zod';

export const formContactSchema = z.object({
  name: z.string({ message: 'Este campo es necesario' }).min(8, 'El campo es requerido'),
  email: z
    .string({ message: 'Por favor ingresa tu email.' })
    .min(1, { message: 'El campo es obligatorio.' })
    .email({ message: 'Ingresa un email válido.' })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Ingresa un email válido.' }),
  message: z.string({ message: 'Este campo es necesario' }).min(10, 'El mensaje es muy corto'),
});

export type FormContactSchema = z.infer<typeof formContactSchema>;
