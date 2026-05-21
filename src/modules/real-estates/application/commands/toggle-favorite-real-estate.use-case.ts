import { assertAuthenticated } from '@/shared/auth/assert-authenticated.util';
import type { UseCaseHandler } from '@/shared/kernel/contracts/use-case.contract';
import { z } from 'zod';
import type { ToggleFavoriteRealEstateInput, ToggleFavoriteRealEstateOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';

/**
 * Creates a Use Case Handler to toggle (add/remove) a real estate agency to the user's favorites.
 * It validates the UUID format of the agency identifier and applies a specific
 * 'vote' rate limit.
 *
 * @param dependencies - Dependencies for managing favorites and user session.
 * @returns A function that handles the favorite toggle logic.
 */
export const createToggleFavoriteRealEstateUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<ToggleFavoriteRealEstateInput, ToggleFavoriteRealEstateOutput> => {
  return async (input) => {
    const userId = await assertAuthenticated(dependencies.getCurrentUserId);

    await dependencies.rateLimit(`favorite-real-estate:${userId}`, 'vote');

    z.string().uuid('El identificador de inmobiliaria no es valido').parse(input.realEstateId);

    return dependencies.repository.toggleFavorite(input);
  };
};
