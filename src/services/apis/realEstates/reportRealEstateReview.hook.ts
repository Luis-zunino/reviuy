import {
  hasUserReportedRealEstateReview,
  reportRealEstateReview,
} from './reportRealEstateReview.api';
import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';

export const useReportRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: reportRealEstateReview,
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
