import { REVIEW_KEYS } from '@/services/constants';
import type { NominatimEntity } from '@/types';
import { useQuery } from '@tanstack/react-query';
import type { GetAddressListByNameParams } from './types';

export const useGetAddressListByName = (props: GetAddressListByNameParams) => {
  const { query, limit = 5, countrycodes = 'uy' } = props;
  return useQuery({
    queryKey: [REVIEW_KEYS.getAddressListByName, query],
    enabled: query.length > 7,
    queryFn: async (): Promise<NominatimEntity[]> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=${countrycodes}&limit=${limit}`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        return [];
      }
    },
  });
};
