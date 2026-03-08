'use client';

import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/errors';
import type { ReviewWithVotesPublic } from '@/types';
import type { GetReviewsByAddressParams } from './types';

const getReviewsByAddress = async ({
  osmId,
}: GetReviewsByAddressParams): Promise<ReviewWithVotesPublic[]> => {
  const { data, error } = await supabaseClient
    .from('reviews_with_votes_public')
    .select(`*`)
    .eq('address_osm_id', osmId)
    .order('created_at', { ascending: false });

  if (error) throw handleSupabaseError(error);
  return data;
};

export const useGetReviewsByAddress = ({
  osmId,
}: GetReviewsByAddressParams): UseQueryResult<ReviewWithVotesPublic[] | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getReviewsByAddress, osmId],
    queryFn: () => getReviewsByAddress({ osmId }),
    enabled: !!osmId,
  });
};
