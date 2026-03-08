import { useVoteRealEstate } from '@/services';
import { VoteType } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';

export interface RealEstateVoteButtonsProps {
  realEstateId: string;
  userVote?: VoteType | null;
  refetchRealEstate: () => Promise<void>;
}

export const useRealEstateVoteButtons = (props: RealEstateVoteButtonsProps) => {
  const { realEstateId, userVote, refetchRealEstate } = props;
  const { mutateAsync, isPending } = useVoteRealEstate();
  const [clickedButton, setClickedButton] = useState<VoteType | null>(null);

  const handleVote = async (voteType: VoteType) => {
    setClickedButton(voteType);
    setTimeout(() => setClickedButton(null), 300);

    return await mutateAsync(
      { realEstateId, voteType },
      {
        onSuccess: async () => {
          return await refetchRealEstate();
        },

        onError: () => {
          toast.error('Error inesperado', {
            description: 'No se pudo actualizar la inmobiliaria. Inténtalo de nuevo.',
          });
        },
      }
    );
  };

  const getLikeTooltip = () => {
    if (userVote === VoteType.LIKE) return 'Ya recomendaste esta inmobiliaria';
    return 'Recomendar esta inmobiliaria';
  };

  const getDislikeTooltip = () => {
    if (userVote === VoteType.DISLIKE) return 'Ya marcaste que no la recomiendas';
    return 'No recomendar esta inmobiliaria';
  };

  return { handleVote, isPending, clickedButton, getLikeTooltip, getDislikeTooltip };
};
