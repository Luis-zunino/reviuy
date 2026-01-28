import { hasUserReportedReview, reportReview } from './reportReview.api';
import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook para reportar una review
 */
export const useReportReview = () => {
  return useAuthMutation({
    mutationFn: reportReview,
  });
};

/**
 * Hook para verificar si el usuario ya reportó una review
 */
export const useHasUserReportedReview = (reviewId: string) => {
  return useQuery({
    queryKey: ['has-user-reported-review', reviewId],
    queryFn: () => hasUserReportedReview(reviewId),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
