'use client';

import { REVIEW_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { createGetAddressInfoQuery } from '@/modules/addresses/application';
import { NominatimAddressReadRepository } from '@/modules/addresses/infrastructure';
import { NominatimByOsmId } from '../domain';

interface UseGetAddressInfoProps {
  osmId: string;
}

const repository = new NominatimAddressReadRepository();
const getAddressInfo = createGetAddressInfoQuery({
  repository,
});

export const useGetAddressInfo = (props: UseGetAddressInfoProps) => {
  const { osmId } = props;

  return useQuery<NominatimByOsmId[]>({
    queryKey: [REVIEW_KEYS.getAddressInfo, osmId],
    queryFn: () => getAddressInfo({ osmId }),
    enabled: osmId.length > 0,
  });
};
