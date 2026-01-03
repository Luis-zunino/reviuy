'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/types';
import type { GetReviewsByAddressParams } from './types';

const getReviewsByAddress = async ({ osmId }: GetReviewsByAddressParams): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`*`)
    .eq('address_osm_id', osmId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const useGetReviewsByAddress = ({
  osmId,
}: GetReviewsByAddressParams): UseQueryResult<Review[] | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewsByAddress, osmId],
    queryFn: () => getReviewsByAddress({ osmId }),
    enabled: !!osmId,
  });
};
