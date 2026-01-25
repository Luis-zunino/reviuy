import { validateText } from '@/utils';
import * as z from 'zod';

export const formCreateRealEstateSchema = z.object({
  name: z
    .string({ message: 'Este campo es necesario' })
    .min(4, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .superRefine((value, ctx) => {
      if (!value) return;

      const validation = validateText(value);
      if (!validation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validation.message,
        });
      }
    }),
});

export type FormCreateRealEstateSchema = z.infer<typeof formCreateRealEstateSchema>;
