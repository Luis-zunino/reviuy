'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery } from '@tanstack/react-query';
import type { GetAddressListByNameParams } from './types';
import { searchAddressAction } from '@/app/_actions';

export const useGetAddressListByName = (props: GetAddressListByNameParams) => {
  const { query, limit = 5, countrycodes = 'uy' } = props;
  return useQuery({
    queryKey: [REVIEW_KEYS.getAddressListByName, query],
    enabled: query.length > 7,
    queryFn: () => searchAddressAction(query, countrycodes, limit),
  });
};
