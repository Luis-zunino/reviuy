'use client';

import { useMutation } from '@tanstack/react-query';
import { createRealEstate } from './createRealEstate.api';
import { verifyAuthentication } from '../user/verifyAuthentication.api';
import type { RealEstateInsert } from '@/types/realEstate';

export const useCreateRealEstateHook = () => {
  return useMutation({
    mutationKey: ['create-real-estate'],
    mutationFn: async (realEstateData: RealEstateInsert) => {
      const authCheck = await verifyAuthentication();

      if (authCheck.error) {
        throw new Error('Debes iniciar sesión para crear una inmobiliaria');
      }

      return createRealEstate(realEstateData);
    },
  });
};
