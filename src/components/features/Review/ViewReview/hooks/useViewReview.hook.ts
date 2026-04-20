import { useGetReviewById } from '@/modules/property-reviews';
import { useParams } from 'next/navigation';

export const useViewReview = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetReviewById({ id });

  return { data, isLoading, error };
};
