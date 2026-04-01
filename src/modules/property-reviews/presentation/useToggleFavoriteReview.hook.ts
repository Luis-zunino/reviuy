import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleFavoriteReviewAction } from '@/modules/property-reviews/presentation';
import { useAuthMutation } from '@/shared/auth';

export const useToggleFavoriteReview = () => {
  const queryClient = useQueryClient();

  return useAuthMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) => toggleFavoriteReviewAction(reviewId),
    onSuccess: (data) => {
      if (data?.success) {
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
