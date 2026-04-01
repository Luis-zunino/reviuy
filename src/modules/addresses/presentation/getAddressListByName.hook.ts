'use client';

import { REVIEW_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { createSearchAddressByNameQuery } from '@/modules/addresses/application';
import { NominatimAddressReadRepository } from '@/modules/addresses/infrastructure';
import { NominatimEntity } from '../domain';

interface GetAddressListByNameParams {
  query: string;
  limit?: number;
  countrycodes?: string;
}

const repository = new NominatimAddressReadRepository();
const searchAddressByName = createSearchAddressByNameQuery({ repository });

export const useGetAddressListByName = (props: GetAddressListByNameParams) => {
  const { query, limit = 5, countrycodes = 'uy' } = props;

  return useQuery<NominatimEntity[]>({
    queryKey: [REVIEW_KEYS.getAddressListByName, query],
    enabled: query.length > 7,
    queryFn: () => searchAddressByName({ query, countrycodes, limit }),
  });
};
