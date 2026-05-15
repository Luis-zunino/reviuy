import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  ComposedProfileReadRepository,
  createGetCurrentUserSummaryQuery,
} from '@/modules/profiles';
import { SupabasePropertyReviewReadRepository } from '@/modules/property-reviews';
import { SupabaseRealEstateReadRepository } from '@/modules/real-estates';
import type { GetCurrentUserSummaryOutput } from '@/modules/profiles/domain';

const profileReadRepository = new ComposedProfileReadRepository({
  propertyReviewReadRepository: new SupabasePropertyReviewReadRepository(supabaseClient),
  realEstateReadRepository: new SupabaseRealEstateReadRepository(supabaseClient),
});

const getCurrentUserSummary = createGetCurrentUserSummaryQuery({
  profileReadRepository,
});

export const useGetCurrentUserSummary = (): UseQueryResult<GetCurrentUserSummaryOutput> => {
  return useQuery({
    queryKey: ['currentUserSummary'],
    queryFn: () => getCurrentUserSummary({}),
  });
};
