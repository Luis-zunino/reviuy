import { supabaseClient } from '@/lib/supabase-client';
import { VoteType } from '@/types';

export const voteRealEstateReview = async ({
  reviewId,
  voteType,
}: {
  reviewId: string;
  voteType: VoteType;
}) => {
  const { data, error } = await supabaseClient.rpc('vote_real_estate_review', {
    p_review_id: reviewId,
    p_vote_type: voteType,
  });
  if (error) {
    throw error;
  }
  return data;
};
