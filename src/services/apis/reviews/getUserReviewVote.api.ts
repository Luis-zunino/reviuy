import { supabaseClient } from '@/lib/supabase-client';
import { VoteType } from '@/types';
import type { GetUserReviewVoteParams } from './types';

export const getUserReviewVote = async ({
  reviewId,
  userId,
}: GetUserReviewVoteParams): Promise<VoteType | null> => {
  if (!userId) return null;

  const { data, error } = await supabaseClient
    .from('review_votes')
    .select('vote_type')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data?.vote_type as VoteType;
};
