import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleFavoriteRealEstateAction } from '@/modules/real-estates/presentation';
import { useAuthMutation } from '@/shared/auth';
import type { ToggleFavoriteRealEstateRequest } from './types';

export const useToggleFavoriteRealEstate = () => {
  const queryClient = useQueryClient();

  return useAuthMutation({
    mutationFn: ({ realEstateId }: ToggleFavoriteRealEstateRequest) =>
      toggleFavoriteRealEstateAction(realEstateId),
    onSuccess: (data) => {
      if (data.success) {
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
