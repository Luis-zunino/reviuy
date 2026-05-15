import { toggleFavoriteRealEstateAction } from '@/modules/real-estates/presentation';
import { useToggleFavorite } from '@/shared/api';
import type { ToggleFavoriteRealEstateRequest } from './types';

export const useToggleFavoriteRealEstate = () =>
  useToggleFavorite<ToggleFavoriteRealEstateRequest>(
    ({ realEstateId }) => toggleFavoriteRealEstateAction(realEstateId),
    [['realEstate'], ['favoriteRealEstates'], ['isFavorite']]
  );
