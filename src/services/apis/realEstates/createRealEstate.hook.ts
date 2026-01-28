'use client';

import { createRealEstate } from './createRealEstate.api';
import { useAuthMutation } from '../user';

export const useCreateRealEstateHook = () => {
  return useAuthMutation({
    mutationKey: ['create-real-estate'],
    authErrorMessage: 'Debes iniciar sesión para crear una inmobiliaria',
    mutationFn: createRealEstate,
  });
};
