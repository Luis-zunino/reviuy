import { useQueryClient } from '@tanstack/react-query';
import { toggleFavoriteReview } from './toggleFavoriteReview.api';
import { toast } from 'sonner';
import { useAuthMutation } from '../user';

export const useToggleFavoriteReview = () => {
  const queryClient = useQueryClient();

  return useAuthMutation({
    mutationFn: toggleFavoriteReview,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.isFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos', {
          description: data.message,
        });

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
