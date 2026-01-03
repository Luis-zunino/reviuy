import { useMutation } from '@tanstack/react-query';
import { voteRealEstate } from './voteRealEstate.api';
import { toast } from 'sonner';
import type { VoteRealEstateParams } from './types';

export const useVoteRealEstate = () => {
  return useMutation({
    mutationFn: async (props: VoteRealEstateParams) => {
      return await voteRealEstate(props);
    },

    onMutate: () => {
      toast.loading('Calificando inmobiliaria...', {
        id: 'vote-real-estate',
      });
    },

    onSuccess: () => {
      toast.dismiss('vote-real-estate');
      toast.success('Voto registrado exitosamente');
    },

    onError: () => {
      toast.dismiss('vote-real-estate');
      toast.error('Error inesperado', {
        description: 'No se pudo actualizar la inmobiliaria. Inténtalo de nuevo.',
      });
    },
  });
};
