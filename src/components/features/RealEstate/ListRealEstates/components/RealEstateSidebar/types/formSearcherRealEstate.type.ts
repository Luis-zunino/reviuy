import * as z from 'zod';

export const formSchema = z.object({
  real_estate_name: z.string(),
  rating: z.number(),
});

export type FormSearcherRealEstate = z.infer<typeof formSchema>;
