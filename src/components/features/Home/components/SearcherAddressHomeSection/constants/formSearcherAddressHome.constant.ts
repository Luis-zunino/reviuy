import * as z from 'zod';

export const formSchema = z.object({
  address_text: z.string({ message: 'Este campo es necesario' }).min(8, 'El campo es requerido'),
  osm_id: z.string().min(1),
  osm_type: z.string().min(1),
  latitude: z.string().min(1),
  longitude: z.string().min(1),
});

export type FormSearcherAddressHome = z.infer<typeof formSchema>;
