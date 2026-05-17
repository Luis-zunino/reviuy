'use client';

import { VoteType } from '@/types';
import { useOptimistic, useCallback, useState, startTransition } from 'react';
import { UseVoteButtonsOptions, UseVoteButtonsReturn, VoteState } from './types';
import { handleOptimisticVote } from './utils';

/**
 * Hook que gestiona la lógica de votación con actualización optimista usando useOptimistic de React.
 *
 * ARQUITECTURA:
 * - Estado Base: Viene directamente de props del servidor (likes, dislikes, userVote)
 * - No hay useEffect residual que sincronice estados antiguos
 * - useOptimistic aplica transformaciones matemáticas inmediatamente
 * - Rollback automático al estado del servidor si la Server Action falla
 * - Animaciones visuales (clickedButton) están separadas de la lógica de contadores
 *
 * FLUJO:
 * 1. Usuario hace clic → setClickedButton inicia animación (300ms)
 * 2. startTransition inicia transición
 * 3. addOptimisticState aplica nueva lógica de negocio inmediatamente
 * 4. onVote (Server Action) ejecuta en el servidor
 * 5. Si tiene éxito → revalidatePath actualiza props del servidor
 * 6. Si falla → useOptimistic rollback automático a props del servidor
 */
export const useVoteButtons = ({
  likes,
  dislikes,
  userVote,
  onVote,
  onError,
}: UseVoteButtonsOptions): UseVoteButtonsReturn => {
  // Normalizar null/undefined a VoteType.NONE
  const normalizedUserVote = userVote ?? VoteType.NONE;

  // Estado para animación visual de clic (300ms, separado del contador)
  const [clickedButton, setClickedButton] = useState<VoteType | null>(null);

  // Estado base inicial desde props del servidor
  const initialState: VoteState = {
    likesCount: likes,
    dislikesCount: dislikes,
    currentVote: normalizedUserVote,
  };

  // useOptimistic: mantiene la UI actualizada mientras la Server Action se ejecuta
  // El reducer (segundo argumento) calcula el nuevo estado optimista basado en la acción
  const [optimisticState, addOptimisticState] = useOptimistic(
    initialState,
    (_currentState: VoteState, newState: VoteState) => newState
  );

  /**
   * Maneja el clic en un botón de voto.
   * Dispara la animación visual, actualiza el estado optimista y ejecuta la Server Action.
   */
  const handleVote = useCallback(
    (voteType: VoteType) => {
      // No permitir votar con VoteType.NONE
      if (voteType === VoteType.NONE) return;

      // Animación visual: pulso durante 300ms
      setClickedButton(voteType);
      const animationTimer = setTimeout(() => setClickedButton(null), 300);

      // Iniciar transición para que React sepa que es una operación asincrónica
      startTransition(async () => {
        try {
          // Calcular el nuevo estado optimista basado en la lógica de negocio
          const nextState = handleOptimisticVote({
            voteType,
            currentState: optimisticState,
          });

          // Aplicar el nuevo estado optimista inmediatamente
          // Si onVote falla, useOptimistic hará rollback automático al initialState
          addOptimisticState(nextState);

          // Ejecutar la Server Action (revalidatePath actualiza props del servidor)
          await onVote(voteType);
        } catch (error) {
          // Limpiar timer si hay error
          clearTimeout(animationTimer);
          // Notificar del error (useOptimistic ya hizo rollback)
          onError?.(error instanceof Error ? error : new Error('Vote failed'));
        }
      });
    },
    [optimisticState, addOptimisticState, onVote, onError]
  );

  return {
    handleVote,
    clickedButton,
    optimisticLikes: optimisticState.likesCount,
    optimisticDislikes: optimisticState.dislikesCount,
    optimisticUserVote: optimisticState.currentVote,
  };
};
