import { useQueryClient } from '@tanstack/react-query';
import { useGetReviewVote } from '@/modules/property-reviews/presentation';
import { REVIEW_KEYS } from '@/constants';
import { voteAction } from '../../VoteButtons/actions';
import { VoteType } from '@/types';
import { toast } from 'sonner';

export const useReviewLikesButtons = (props: { id: string }) => {
  const { id: reviewId } = props;

  const queryClient = useQueryClient();
  const { data, refetch } = useGetReviewVote({ reviewId });

  const addVote = async (voteType: VoteType) => {
    try {
      // Ejecutar la Server Action (revalidatePath actualiza props)
      await voteAction(reviewId, voteType);

      // Refetch optional: si quieres asegurar que los datos estén sincronizados
      // (useOptimistic + revalidatePath ya manejan la UI)
      await refetch();

      // Invalidar queries relacionadas (opcional, revalidatePath ya lo hace)
      await queryClient.invalidateQueries({ queryKey: [REVIEW_KEYS.getReviewById, reviewId] });
    } catch (error) {
      // Mostrar error (useOptimistic ya hizo rollback automático)
      toast.warning(error instanceof Error ? error.message : 'Vote failed');
    }
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
    userVote: data ?? VoteType.NONE,
  };
};
