import { useGetReviewVote, useVoteReview } from '@/services';
import { VoteType } from '@/types';
import { useState } from 'react';
import type { ReviewLikesButtonsProps } from '../types';
import type { AddVoteParams } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

export const useReviewLikesButtons = (props: ReviewLikesButtonsProps) => {
  const { id, likes: initialLikes, dislikes: initialDislikes } = props;
  const { userId } = useAuthContext();

  const { mutateAsync, isPending: isVoting, isError } = useVoteReview();
  const { data, isLoading, refetch } = useGetReviewVote({
    reviewId: id,
    userId: userId || '',
  });
  const [clickedButton, setClickedButton] = useState<VoteType | null>(null);

  const [optimisticLikes, setOptimisticLikes] = useState(initialLikes);
  const [optimisticDislikes, setOptimisticDislikes] = useState(initialDislikes);

  const addVote = async ({ id, voteType }: AddVoteParams) => {
    if (!userId) {
      toast.warning('Necesitas iniciar sesión para votar');
      return;
    }

    setClickedButton(voteType);
    setTimeout(() => setClickedButton(null), 300);

    const previousLikes = optimisticLikes;
    const previousDislikes = optimisticDislikes;

    if (voteType === VoteType.LIKE) {
      if (data === VoteType.LIKE) {
        setOptimisticLikes((prev) => prev - 1);
      } else if (data === VoteType.DISLIKE) {
        setOptimisticDislikes((prev) => prev - 1);
        setOptimisticLikes((prev) => prev + 1);
      } else {
        setOptimisticLikes((prev) => prev + 1);
      }
    } else {
      if (data === VoteType.DISLIKE) {
        setOptimisticDislikes((prev) => prev - 1);
      } else if (data === VoteType.LIKE) {
        setOptimisticLikes((prev) => prev - 1);
        setOptimisticDislikes((prev) => prev + 1);
      } else {
        setOptimisticDislikes((prev) => prev + 1);
      }
    }
    toast.loading('Calificando reseña...', {
      id: 'vote-review',
    });
    await mutateAsync(
      { reviewId: id, voteType },
      {
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
      }
    );

    if (isError) {
      toast.dismiss('vote-review');
      setOptimisticLikes(previousLikes);
      setOptimisticDislikes(previousDislikes);
    }
    refetch();
  };

  const getLikeTooltip = () => {
    if (data === VoteType.LIKE) return 'Ya votaste útil';
    return 'Marcar como útil';
  };

  const getDislikeTooltip = () => {
    if (data === VoteType.DISLIKE) return 'Ya votaste no útil';
    return 'Marcar como no útil';
  };

  return {
    addVote,
    getLikeTooltip,
    getDislikeTooltip,
    isVoting,
    clickedButton,
    optimisticLikes,
    optimisticDislikes,
    userVoteType: data ?? VoteType.NONE,
    userVoteTypeIsLoading: isLoading,
  };
};
