'use client';

import { deleteAccountAction } from '@/app/_actions';
import { useAuthMutation } from './useAuthMutation.hook';

export const useDeleteAccount = () => {
  return useAuthMutation({
    mutationFn: deleteAccountAction,
    errorToastMessage: (error) => error.message || 'Error al eliminar la cuenta',
  });
};
