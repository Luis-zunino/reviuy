import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { VoteType } from '@/types';
import { REVIEW_KEYS } from '@/services/constants';
import { getUserReviewVote } from './getUserReviewVote.api';
import type { GetUserReviewVoteParams } from './types';

export const useGetReviewVote = ({
  reviewId,
}: GetUserReviewVoteParams): UseQueryResult<VoteType | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.getUserReviewVote, reviewId],
    queryFn: () => getUserReviewVote({ reviewId }),
    enabled: !!reviewId,
  });
};
