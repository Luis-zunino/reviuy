import { createError } from '@/lib';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import { z } from 'zod';
import type { ToggleFavoriteRealEstateInput, ToggleFavoriteRealEstateOutput } from '../../domain';
import { RealEstateCommandoBase } from './interfaces';

export const createToggleFavoriteRealEstateUseCase = (
  dependencies: RealEstateCommandoBase
): UseCaseHandler<ToggleFavoriteRealEstateInput, ToggleFavoriteRealEstateOutput> => {
  return async (input) => {
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED');
    }

    await dependencies.rateLimit(`favorite-real-estate:${userId}`, 'vote');

    z.string().uuid('El identificador de inmobiliaria no es valido').parse(input.realEstateId);

    return dependencies.repository.toggleFavorite(input);
  };
};
