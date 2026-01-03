import { supabaseClient } from '@/lib/supabase-client';
import type { VoteReviewRequest } from './types';

export const voteReview = async ({ reviewId, voteType }: VoteReviewRequest) => {
  const { data, error } = await supabaseClient.rpc('vote_review', {
    p_review_id: reviewId,
    p_vote_type: voteType,
  });
  if (error) {
    throw error;
  }
  return data;
};
