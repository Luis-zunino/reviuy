import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import { VoteType } from '@/types';
import { REVIEW_KEYS } from '@/services/constants';
import {
  createGetUserReviewVoteQuery,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';
import type { GetUserReviewVoteParams } from './types';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const getUserReviewVote = createGetUserReviewVoteQuery({
  propertyReviewReadRepository,
});

export const useGetReviewVote = ({
  reviewId,
}: GetUserReviewVoteParams): UseQueryResult<VoteType | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getUserReviewVote, reviewId],
    queryFn: () => getUserReviewVote({ reviewId }),
    enabled: !!reviewId,
  });
};
