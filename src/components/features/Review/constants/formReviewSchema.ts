import { validateText } from '@/utils';
import * as z from 'zod';

export const reviewRoomSchema = z.object({
  id: z.string().optional(),
  room_type: z.string().optional(),
  area_m2: z.number().optional(),
});

export const formReviewSchema = z.object({
  title: z
    .string({ message: 'Este campo es necesario' })
    .min(10, 'Mensaje muy corto')
    .max(100, 'El título no puede exceder 100 caracteres')
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
    .string({ message: 'Este campo es necesario' })
    .min(20, 'Mensaje muy corto')
    .max(800, 'El contenido no puede exceder los 800 caracteres')
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
  rating: z
    .number({ message: 'Este campo es necesario' })
    .min(1, 'Asigna al menos una estrella')
    .max(5, 'El maximo son 5 estrellas'),
  property_type: z
    .string({ message: 'Este campo es necesario' })
    .min(1, 'Debes indicar el tipo de propiedad'),
  address_text: z.string({ message: 'Este campo es necesario' }).min(1, 'El campo es requerido'),
  osm_id: z.string().min(1, 'El campo es requerido'),
  osm_type: z.string().min(1, 'El campo es requerido'),
  latitude: z.string().min(1),
  longitude: z.string().min(1),
  zone_rating: z
    .number()
    .optional()
    .refine((value) => value === undefined || value >= 1, {
      message: 'Selecciona al menos 1 estrella',
    }),
  winter_comfort: z.string().optional(),
  summer_comfort: z.string().optional(),
  humidity: z.string().optional(),
  real_estate_id: z.string().optional(),
  real_estate_name: z.string().optional(),
  real_estate_experience: z
    .string()
    .optional()
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
  apartment_number: z.preprocess((value) => {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }, z.string().max(10, 'El número de apartamento es muy largo').optional()),
  review_rooms: z.array(reviewRoomSchema).optional(),
});

export type FormReviewSchema = z.infer<typeof formReviewSchema>;
export type ReviewRoomSchema = z.infer<typeof reviewRoomSchema>;
