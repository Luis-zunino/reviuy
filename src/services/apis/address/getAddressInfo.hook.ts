import { REVIEW_KEYS } from '@/services/constants';
import { NominatimByOsmId } from '@/types/nominatim';
import { useQuery } from '@tanstack/react-query';
import type { UseGetAddressInfoProps } from './types';
import { createGetAddressInfoQuery } from '@/modules/addresses/application';
import { NominatimAddressReadRepository } from '@/modules/addresses/infrastructure';

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
