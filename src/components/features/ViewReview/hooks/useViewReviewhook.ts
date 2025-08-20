import { useGetReviewById } from '@/services';
import { reviewMock } from '@/services/mocks/review.mock';

export const useViewReview = ({ id }: { id: string }) => {
  useGetReviewById({ id });
  return { data: reviewMock };
};
