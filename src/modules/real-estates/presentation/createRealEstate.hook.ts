'use client';

import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { createRealEstateAction } from '@/modules/real-estates/presentation';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';

export const useCreateRealEstateHook = () => {
  return useAuthMutation({
    mutationKey: ['create-real-estate'],
    authErrorMessage: 'Debés iniciar sesión para crear una inmobiliaria',
    mutationFn: createRealEstateAction,
    invalidateQueryKeys: [[REAL_ESTATE_REVIEWS.searchRealEstates], ['realEstates', 'infinite']],
  });
};
