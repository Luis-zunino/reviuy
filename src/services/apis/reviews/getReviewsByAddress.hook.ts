'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ReviewWithVotes } from '@/types';
import type { GetReviewsByAddressParams } from './types';
import { parseSupabaseError } from '@/utils';

const getReviewsByAddress = async ({
  osmId,
}: GetReviewsByAddressParams): Promise<ReviewWithVotes[]> => {
  const { data, error } = await supabase
    .from('reviews_with_votes')
    .select(`*`)
    .eq('address_osm_id', osmId)
    .order('created_at', { ascending: false });

  if (error) throw parseSupabaseError(error);
  return data;
};

export const useGetReviewsByAddress = ({
  osmId,
}: GetReviewsByAddressParams): UseQueryResult<ReviewWithVotes[] | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewsByAddress, osmId],
    queryFn: () => getReviewsByAddress({ osmId }),
    enabled: !!osmId,
  });
};
