import { hasUserReportedRealEstateReview } from './reportRealEstateReview.api';
import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';
import { reportRealEstateReviewAction } from '@/app/_actions/report.actions';

export const useReportRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: reportRealEstateReviewAction,
  });
};

export const useHasUserReportedRealEstateReview = (reviewId: string) => {
  return useQuery({
    queryKey: ['has-user-reported-real-estate-review', reviewId],
    queryFn: () => hasUserReportedRealEstateReview(reviewId),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000,
  });
};
