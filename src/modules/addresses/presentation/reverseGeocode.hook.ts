'use client';

import { REVIEW_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { createReverseGeocodeQuery } from '@/modules/addresses/application';
import { NominatimAddressReadRepository } from '@/modules/addresses/infrastructure';
import type { NominatimByOsmId } from '@/modules/addresses/domain';

interface UseReverseGeocodeParams {
  lat: number | null;
  lon: number | null;
}

const repository = new NominatimAddressReadRepository();
const reverseGeocode = createReverseGeocodeQuery({ repository });

export const useReverseGeocode = ({ lat, lon }: UseReverseGeocodeParams) => {
  return useQuery<NominatimByOsmId | null>({
    queryKey: [REVIEW_KEYS.reverseGeocode, lat, lon],
    queryFn: () => reverseGeocode({ lat: lat!, lon: lon! }),
    enabled: lat !== null && lon !== null,
  });
};
