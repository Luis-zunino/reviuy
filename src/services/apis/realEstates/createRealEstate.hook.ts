'use client';

import { useAuthMutation } from '../user';
import { createRealEstateAction } from '@/app/_actions/create-real-estate.action';

export const useCreateRealEstateHook = () => {
  return useAuthMutation({
    mutationKey: ['create-real-estate'],
    authErrorMessage: 'Debes iniciar sesión para crear una inmobiliaria',
    mutationFn: createRealEstateAction,
  });
};
