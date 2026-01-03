import { useGetReviewById } from '@/services';
import { useParams } from 'next/navigation';

export const useViewReview = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetReviewById({ id });

  return { data, isLoading, error };
};
