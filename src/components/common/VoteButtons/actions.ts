'use server';

import { revalidatePath } from 'next/cache';
import { VoteType } from '@/types';
import { voteReviewAction } from '@/modules/property-reviews/presentation';

/**
 * Server Action para procesar un voto de reseña.
 *
 * FLUJO:
 * 1. Ejecuta en el servidor de forma segura (datos sensibles, autenticación)
 * 2. Llama a voteReviewAction que persiste el voto en la BD
 * 3. Invalida el caché de Next.js con revalidatePath
 * 4. Las props del componente se refrescan automáticamente
 * 5. useOptimistic del cliente hace rollback si esta función falla
 *
 * @param reviewId - ID de la reseña
 * @param voteType - Tipo de voto (LIKE, DISLIKE)
 * @throws Error si la votación falla
 */
export async function voteAction(reviewId: string, voteType: VoteType): Promise<void> {
  try {
    // Ejecutar la acción de voto en el servidor
    await voteReviewAction(reviewId, voteType);

    // Revalidar el caché de Next.js para que las props se refresquen
    revalidatePath('/');
  } catch (error) {
    // Propagar el error para que el cliente lo capture y haga rollback
    throw error instanceof Error ? error : new Error('Vote action failed');
  }
}
