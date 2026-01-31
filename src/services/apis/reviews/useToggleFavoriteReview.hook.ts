import { useQueryClient } from '@tanstack/react-query';
import { toggleFavoriteReviewAction } from '@/app/_actions/review-interactions.actions';
import { toast } from 'sonner';
import { useAuthMutation } from '../user';

export const useToggleFavoriteReview = () => {
  const queryClient = useQueryClient();

  return useAuthMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) => toggleFavoriteReviewAction(reviewId),
    onSuccess: (data) => {
      if (data?.success) {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['reviews'] });
        queryClient.invalidateQueries({ queryKey: ['favoriteReviews'] });
        queryClient.invalidateQueries({ queryKey: ['isFavoriteReview'] });
      } else {
        toast.error('Error', {
          description: data?.error || 'No se pudo actualizar favoritos',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description: error.message || 'No se pudo actualizar favoritos',
      });
    },
  });
};
