'use server';

import { z } from 'zod';
import { withRateLimit } from '@/lib';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NOMINATIM_URL } from '@/constants';
import { NominatimEntity } from '@/types';

const addressSearchSchema = z.object({
  query: z.string().min(1).max(200),
  countrycodes: z
    .string()
    .regex(/^[a-z]{2}(,[a-z]{2})*$/i, 'Código de país inválido')
    .default('uy'),
  limit: z.number().int().min(1).max(10).default(5),
});

export const searchAddressAction = async (
  query: string,
  countrycodes: string = 'uy',
  limit: number = 5
): Promise<NominatimEntity[]> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user) {
  //   throw createError('UNAUTHORIZED');
  // }

  await withRateLimit(`search-address:${user?.id ?? 'anonymous'}`, 'write');

  const params = addressSearchSchema.parse({ query, countrycodes, limit });

  try {
    // Construir URL con URLSearchParams para evitar inyección de parámetros externos
    const url = new URL(`${NOMINATIM_URL}/search`);
    url.searchParams.set('format', 'json');
    url.searchParams.set('q', params.query);
    url.searchParams.set('countrycodes', params.countrycodes);
    url.searchParams.set('limit', String(params.limit));

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'ReviUy/1.0',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
};
