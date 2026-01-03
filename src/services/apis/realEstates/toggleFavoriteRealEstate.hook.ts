import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFavoriteRealEstate } from './toggleFavoriteRealEstate.api';
import { toast } from 'sonner';

export const useToggleFavoriteRealEstate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavoriteRealEstate,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.isFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos', {
          description: data.message,
        });

        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['realEstate'] });
        queryClient.invalidateQueries({ queryKey: ['favoriteRealEstates'] });
        queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
      } else {
        toast.error('Error', {
          description: data.error || 'No se pudo actualizar favoritos',
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
