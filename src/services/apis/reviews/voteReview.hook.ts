import { useMutation } from '@tanstack/react-query';
import { voteReview } from './voteReview.api';
import { toast } from 'sonner';
import type { VoteReviewParams } from './types';

export const useVoteReview = () => {
  return useMutation({
    mutationFn: async (props: VoteReviewParams) => {
      return await voteReview(props);
    },

    onMutate: () => {
      toast.loading('Calificando reseña...', {
        id: 'vote-review',
      });
    },

    onSuccess: () => {
      toast.dismiss('vote-review');
      toast.success('Voto registrado exitosamente');
    },

    onError: () => {
      toast.dismiss('vote-review');
      toast.error('Error inesperado', {
        description: 'No se pudo actualizar la reseña. Inténtalo de nuevo.',
      });
    },
  });
};
