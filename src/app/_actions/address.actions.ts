'use server';

import { NominatimEntity } from '@/types';

export const searchAddressAction = async (
  query: string,
  countrycodes: string = 'uy',
  limit: number = 5
): Promise<NominatimEntity[]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=${countrycodes}&limit=${limit}`,
      {
        headers: {
          'User-Agent': 'ReviUy/1.0',
        },
      }
    );

    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching address:', error);
    return [];
  }
};
