import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import { VoteType } from '@/types';
import { REAL_ESTATE_REVIEWS } from '@/constants';
import {
  createGetUserRealEstateVoteQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getUserRealEstateVote = createGetUserRealEstateVoteQuery({ repository });

export interface GetUserRealEstateVoteParams {
  realEstateId: string;
}
export const useGetUserRealEstateVote = ({
  realEstateId,
}: GetUserRealEstateVoteParams): UseQueryResult<VoteType | null> => {
  return useQuery({
    queryKey: [REAL_ESTATE_REVIEWS.getUserRealEstateVote, realEstateId],
    queryFn: () => getUserRealEstateVote({ realEstateId }),
    enabled: Boolean(realEstateId.length),
  });
};
