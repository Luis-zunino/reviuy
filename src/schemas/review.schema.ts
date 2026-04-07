import { validateText } from '@/utils';
import * as z from 'zod';

export const formReviewRoomSchema = z
  .object({
    room_type: z.string().optional(),
    area_m2: z.number('Debes indicar los metros cuadrados').optional(),
  })
  .superRefine((data, ctx) => {
    const { room_type, area_m2 } = data;

    // Si uno existe, el otro también
    if (!room_type) {
      ctx.addIssue({
        path: ['room_type'],
        code: z.ZodIssueCode.custom,
        message: 'Debes indicar el tipo de habitación',
      });
    }

    if (area_m2 === undefined || area_m2 === null) {
      ctx.addIssue({
        path: ['area_m2'],
        code: z.ZodIssueCode.custom,
        message: 'Debes indicar los metros cuadrados',
      });
    }

    if (room_type && area_m2 === 0) {
      ctx.addIssue({
        path: ['area_m2'],
        code: z.ZodIssueCode.custom,
        message: 'Los metros cuadrados deben ser mayor a 0',
      });
    }
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
  osm_type: z.string().optional(),
  latitude: z.string().min(1),
  longitude: z.string().min(1),
  zone_rating: z
    .number({ message: 'Este campo es necesario' })
    .min(1, 'Asigna al menos una estrella')
    .max(5, 'El maximo son 5 estrellas'),
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
  apartment_number: z
    .string()
    .trim()
    .max(10, 'El número de apartamento es muy largo')
    .optional()
    .or(z.literal('')),
  images: z
    .array(
      z.custom<File>(
        (value) => typeof File === 'undefined' || value instanceof File,
        'Archivo inválido'
      )
    )
    .max(5, 'Podés subir hasta 5 imágenes')
    .optional()
    .default([]),
  review_rooms: z.array(formReviewRoomSchema).optional(),
});

export type FormReviewSchema = z.input<typeof formReviewSchema>;
export type ReviewRoomSchema = z.infer<typeof formReviewRoomSchema>;

// Schema para validar datos después de formatDataToBackend (con latitude/longitude como números)
export const backendReviewSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(20).max(800),
  rating: z.number().min(1).max(5),
  property_type: z.string().optional().nullable(),
  address_text: z.string().min(1),
  address_osm_id: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  zone_rating: z.number().optional().nullable(),
  winter_comfort: z.string().optional(),
  summer_comfort: z.string().optional(),
  humidity: z.string().optional(),
  real_estate_id: z.string().optional().nullable(),
  real_estate_experience: z.string().optional().nullable(),
  apartment_number: z.string().optional().nullable(),
  review_rooms: z
    .array(
      z.object({
        room_type: z.string().nullable(),
        area_m2: z.number().nullable(),
      })
    )
    .optional(),
});

export type BackendReviewSchema = z.infer<typeof backendReviewSchema>;
