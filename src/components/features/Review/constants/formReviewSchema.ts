import * as z from 'zod';

export const formReviewSchema = z.object({
  title: z.string().min(1, 'El campo es requerido'),
  description: z.string().min(1, 'El campo es requerido'),
  rating: z.number().min(1, 'Asigna al menos una estrella').max(5, 'El maximo son 5 estrellas'),
  property_type: z.string().min(1, 'Debes indicar el tipo de propiedad'),
  address_text: z.string().min(1, 'El campo es requerido'),
  osm_id: z.string().min(1, 'El campo es requerido'),
  osm_type: z.string().min(1, 'El campo es requerido'),
  latitude: z.string().min(1),
  longitude: z.string().min(1),
  zone_rating: z.number().optional(),
  winter_comfort: z.string().optional(),
  summer_comfort: z.string().optional(),
  humidity: z.string().optional(),
  real_estate_id: z.string().optional(),
  real_estate_name: z.string().optional(),
  real_estate_experience: z.string().optional(),
  apartment_number: z.string().optional(),
  review_rooms: z
    .array(
      z.object({
        id: z.string().optional(),
        room_type: z.string().optional(),
        area_m2: z.number().optional(),
      })
    )
    .optional(),
});

export type FormReviewSchema = z.infer<typeof formReviewSchema>;
