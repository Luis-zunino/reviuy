import { useVoteRealEstate } from '@/modules/real-estates/presentation';
import { VoteType } from '@/types/vote-type';
import { toast } from 'sonner';

export interface UseRealEstateVoteButtonsOptions {
  realEstateId: string;
  refetchRealEstate: () => Promise<void>;
}

export const useRealEstateVoteButtons = (props: UseRealEstateVoteButtonsOptions) => {
  const { realEstateId, refetchRealEstate } = props;
  const { mutateAsync, isPending } = useVoteRealEstate();

  const handleVote = async (voteType: VoteType) => {
    try {
      await mutateAsync({ realEstateId, voteType });
      await refetchRealEstate();
    } catch {
      toast.error('Error inesperado', {
        description: 'No se pudo actualizar la inmobiliaria. Inténtalo de nuevo.',
      });
    }
  };

  return { handleVote, isPending };
};
