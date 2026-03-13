import { REVIEW_KEYS } from '@/services/constants';
import { NominatimByOsmId } from '@/types/nominatim';
import { useQuery } from '@tanstack/react-query';
import type { UseGetAddressInfoProps } from './types';
import { NOMINATIM_URL } from '@/constants';

export const useGetAddressInfo = (props: UseGetAddressInfoProps) => {
  const { osmId } = props;
  return useQuery<NominatimByOsmId[]>({
    queryKey: [REVIEW_KEYS.getAddressInfo, osmId],
    queryFn: async (): Promise<NominatimByOsmId[]> => {
      const response = await fetch(
        `${NOMINATIM_URL}/lookup?osm_ids=${osmId}&format=json&extratags=1`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: osmId.length > 0,
  });
};
