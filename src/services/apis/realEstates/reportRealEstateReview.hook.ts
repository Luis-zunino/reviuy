import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';
import { reportRealEstateReviewAction } from '@/app/_actions/report.actions';
import { supabaseClient } from '@/lib/supabase';
import {
  createHasUserReportedRealEstateReviewQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const hasUserReportedRealEstateReview = createHasUserReportedRealEstateReviewQuery({
  repository,
});

export const useReportRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: reportRealEstateReviewAction,
  });
};

export const useHasUserReportedRealEstateReview = (reviewId: string) => {
  return useQuery({
    queryKey: ['has-user-reported-real-estate-review', reviewId],
    queryFn: () => hasUserReportedRealEstateReview({ reviewId }),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000,
  });
};
