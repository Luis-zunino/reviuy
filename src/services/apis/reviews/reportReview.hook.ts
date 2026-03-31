import { supabaseClient } from '@/lib/supabase';
import {
  createHasUserReportedReviewQuery,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';
import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';
import { reportReviewAction } from '@/app/_actions/report.actions';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const hasUserReportedReview = createHasUserReportedReviewQuery({
  propertyReviewReadRepository,
});

/**
 * Hook para reportar una review
 */
export const useReportReview = () => {
  return useAuthMutation({
    mutationFn: reportReviewAction,
  });
};

/**
 * Hook para verificar si el usuario ya reportó una review
 */
export const useHasUserReportedReview = (reviewId: string) => {
  return useQuery({
    queryKey: ['has-user-reported-review', reviewId],
    queryFn: () => hasUserReportedReview({ reviewId }),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
