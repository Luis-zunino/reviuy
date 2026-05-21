import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase/client';
import { VoteType } from '@/types/vote-type';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
import {
  createGetUserRealEstateReviewVoteQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getUserRealEstateReviewVote = createGetUserRealEstateReviewVoteQuery({ repository });

export interface GetUserRealEstateReviewVoteParams {
  reviewId: string;
}

export const useGetUserRealEstateReviewVote = ({
  reviewId,
}: GetUserRealEstateReviewVoteParams): UseQueryResult<VoteType | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getUserRealEstateReviewVote, reviewId],
    queryFn: () => getUserRealEstateReviewVote({ reviewId }),
    enabled: Boolean(reviewId),
  });
};
