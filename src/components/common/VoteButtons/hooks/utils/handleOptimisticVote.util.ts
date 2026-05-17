import { VoteType } from '@/types';
import { VoteState } from '../types';

/**
 * Calcula el nuevo estado optimista de los votos de forma absoluta.
 * Garantiza que siempre devuelva un VoteType válido (LIKE, DISLIKE, NONE).
 */
export const handleOptimisticVote = (props: {
  voteType: VoteType;
  currentState: VoteState;
}): VoteState => {
  const { voteType, currentState } = props;
  const { currentVote, likesCount, dislikesCount } = currentState;

  // Caso 1: Quitar el voto (hace clic en el mismo que ya tenía)
  if (currentVote === voteType) {
    return {
      currentVote: VoteType.NONE,
      likesCount: voteType === VoteType.LIKE ? Math.max(0, likesCount - 1) : likesCount,
      dislikesCount: voteType === VoteType.DISLIKE ? Math.max(0, dislikesCount - 1) : dislikesCount,
    };
  }

  // Caso 2: Cambiar de bando (de LIKE a DISLIKE o viceversa)
  if (currentVote !== VoteType.NONE) {
    return {
      currentVote: voteType,
      likesCount: voteType === VoteType.LIKE ? likesCount + 1 : Math.max(0, likesCount - 1),
      dislikesCount:
        voteType === VoteType.DISLIKE ? dislikesCount + 1 : Math.max(0, dislikesCount - 1),
    };
  }

  // Caso 3: Votar por primera vez (estaba en NONE o null originalmente)
  return {
    currentVote: voteType,
    likesCount: voteType === VoteType.LIKE ? likesCount + 1 : likesCount,
    dislikesCount: voteType === VoteType.DISLIKE ? dislikesCount + 1 : dislikesCount,
  };
};
