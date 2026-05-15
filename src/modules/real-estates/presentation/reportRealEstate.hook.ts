import { useAuthMutation } from '@/shared/auth';
import { useQuery } from '@tanstack/react-query';
import { reportRealEstateAction } from '@/modules/moderation/presentation';
import { supabaseClient } from '@/lib/supabase';
import {
  createHasUserReportedRealEstateQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const hasUserReportedRealEstate = createHasUserReportedRealEstateQuery({ repository });

export const useReportRealEstate = () => {
  return useAuthMutation({
    mutationFn: reportRealEstateAction,
  });
};

export const useHasUserReportedRealEstate = (realEstateId?: string) => {
  return useQuery({
    queryKey: ['has-user-reported-real-estate', realEstateId],
    queryFn: () => hasUserReportedRealEstate({ realEstateId }),
    enabled: !!realEstateId,
    staleTime: 5 * 60 * 1000,
  });
};
