import { useMutation } from '@tanstack/react-query';
import { voteRealEstateReview } from './voteRealEstateReview.api';
import { toast } from 'sonner';
import type { VoteRealEstateReviewParams } from './types';

export const useVoteRealEstateReview = () => {
  return useMutation({
    mutationFn: async (props: VoteRealEstateReviewParams) => {
      return await voteRealEstateReview(props);
    },

    onMutate: () => {
      toast.loading('Calificando reseña...', {
        id: 'vote-real-estate-review',
      });
    },

    onSuccess: () => {
      toast.dismiss('vote-real-estate-review');
      toast.success('Voto registrado exitosamente');
    },

    onError: () => {
      toast.dismiss('vote-real-estate-review');
      toast.error('Error inesperado', {
        description: 'No se pudo actualizar la reseña. Inténtalo de nuevo.',
      });
    },
  });
};
