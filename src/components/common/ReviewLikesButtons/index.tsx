'use client';

import { useReviewLikesButtons } from './hooks';
import type { ReviewLikesButtonsProps } from './types';
import { VoteButtons } from '../VoteButtons';

/**
 * Componente de botones de votación (like/dislike) para reseñas.
 *
 * Permite a los usuarios votar si una reseña les fue útil o no.
 * Incluye optimistic updates para mejor UX.
 *
 * @component
 * @example
 * ```tsx
 * <ReviewLikesButtons
 *   id="review-123"
 *   likes={45}
 *   dislikes={3}
 *   className="my-custom-class"
 * />
 * ```
 *
 * @param {ReviewLikesButtonsProps} props - Propiedades del componente
 * @param {string} props.id - ID único de la reseña
 * @param {number} props.likes - Número inicial de likes
 * @param {number} props.dislikes - Número inicial de dislikes
 * @param {string} [props.className] - Clases CSS adicionales
 *
 * @returns {JSX.Element} Botones de votación renderizados
 *
 * @fires voteReviewAction - Server Action para registrar el voto
 *
 * @remarks
 * - Implementa rate limiting (10 votos cada 10 segundos)
 * - Muestra estado de carga durante la votación
 * - Tooltips dinámicos según el estado del voto del usuario
 */
export const ReviewLikesButtons = (props: ReviewLikesButtonsProps) => {
  const { id, likes, dislikes, className } = props;
  const { addVote, getLikeTooltip, getDislikeTooltip, userVote, isPending } = useReviewLikesButtons(
    { id }
  );

  return (
    <VoteButtons
      likes={likes}
      dislikes={dislikes}
      className={className}
      onVote={addVote}
      disabled={isPending}
      likeTooltip={getLikeTooltip()}
      dislikeTooltip={getDislikeTooltip()}
      userVote={userVote}
    />
  );
};
