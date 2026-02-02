import { supabaseClient } from '@/lib/supabase';
import { VoteType } from '@/types';
import { handleSupabaseError } from '@/lib/errors';

export const getUserReviewVote = async ({
  reviewId,
}: {
  reviewId: string;
}): Promise<VoteType | null> => {
  const { data, error } = await supabaseClient.rpc('get_user_review_vote', {
    p_review_id: reviewId,
  });

  if (error) throw handleSupabaseError(error);

  return data as VoteType | null;
};
