'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery } from '@tanstack/react-query';
import type { GetAddressListByNameParams } from './types';
import { createSearchAddressByNameQuery } from '@/modules/addresses/application';
import { NominatimAddressReadRepository } from '@/modules/addresses/infrastructure';

const repository = new NominatimAddressReadRepository();
const searchAddressByName = createSearchAddressByNameQuery({ repository });

export const useGetAddressListByName = (props: GetAddressListByNameParams) => {
  const { query, limit = 5, countrycodes = 'uy' } = props;
  return useQuery({
    queryKey: [REVIEW_KEYS.getAddressListByName, query],
    enabled: query.length > 7,
    queryFn: () => searchAddressByName({ query, countrycodes, limit }),
  });
};
