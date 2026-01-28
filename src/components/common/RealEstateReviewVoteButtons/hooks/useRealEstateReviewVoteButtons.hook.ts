import { useAuthContext } from '@/components/providers/AuthProvider';
import { useVoteRealEstateReview } from '@/services';
import { RealEstateReview, VoteType } from '@/types';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export interface RealEstateReviewVoteButtonsProps {
  reviewId: string;
  userVote?: VoteType | null;
  refetchRealEstateReview:
    | ((
        options?: RefetchOptions | undefined
      ) => Promise<QueryObserverResult<RealEstateReview | null, Error>>)
    | undefined;
}

export const useRealEstateReviewVoteButtons = (props: RealEstateReviewVoteButtonsProps) => {
  const { reviewId, userVote, refetchRealEstateReview } = props;
  const { isAuthenticated } = useAuthContext();
  const { mutateAsync, isPending } = useVoteRealEstateReview();
  const [clickedButton, setClickedButton] = useState<VoteType | null>(null);

  const handleVote = async (voteType: VoteType) => {
    if (!isAuthenticated) {
      toast.warning('Debes estar autenticado para poder votar');
      return;
    }
    setClickedButton(voteType);
    setTimeout(() => setClickedButton(null), 300);
    toast.loading('Calificando reseña...', {
      id: 'vote-real-estate-review',
    });
    await mutateAsync(
      { reviewId, voteType },
      {
        onSuccess: () => {
          toast.dismiss('vote-real-estate-review');
          toast.success('Voto registrado exitosamente');
          return refetchRealEstateReview?.();
        },

        onError: () => {
          toast.dismiss('vote-real-estate-review');
          toast.error('Error inesperado', {
            description: 'No se pudo actualizar la reseña. Inténtalo de nuevo.',
          });
        },
      }
    );
  };

  const getLikeTooltip = () => {
    if (userVote === VoteType.LIKE) return 'Ya votaste útil';
    return 'Marcar como útil';
  };

  const getDislikeTooltip = () => {
    if (userVote === VoteType.DISLIKE) return 'Ya votaste no útil';
    return 'Marcar como no útil';
  };
  return { handleVote, isPending, clickedButton, getLikeTooltip, getDislikeTooltip };
};
