import { textValidationRefinement } from './_shared/text-validation.refinement';
import * as z from 'zod';

export const formCreateRealEstateSchema = z.object({
  real_estate_name: z
    .string({ message: 'Este campo es necesario' })
    .min(4, 'Nombre muy corto')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .superRefine(textValidationRefinement),
});

export type FormCreateRealEstateSchema = z.infer<typeof formCreateRealEstateSchema>;
