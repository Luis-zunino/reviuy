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

// Schema específico para crear review de inmobiliaria (incluye real_estate_id)
export const createRealEstateReviewSchema = formRealEstateSchema.extend({
  real_estate_id: z.string().min(1, 'El ID de la inmobiliaria es requerido'),
});

export type FormRealEstateSchema = z.infer<typeof formRealEstateSchema>;
export type CreateRealEstateReviewSchema = z.infer<typeof createRealEstateReviewSchema>;
