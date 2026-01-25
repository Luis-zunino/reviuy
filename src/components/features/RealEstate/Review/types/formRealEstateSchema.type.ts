import { validateText } from '@/utils';
import * as z from 'zod';

export const formRealEstateSchema = z.object({
  title: z
    .string()
    .min(1, 'Este campo es necesario')
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
  description: z
    .string()
    .min(1, 'Este campo es necesario')
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
  rating: z.number().max(5).min(1, 'Debes ingresar la calificacion'),
});

export type FormRealEstateSchema = z.infer<typeof formRealEstateSchema>;
