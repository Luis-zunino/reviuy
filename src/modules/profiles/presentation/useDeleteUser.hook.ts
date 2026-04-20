'use client';

import { deleteAccountAction } from '@/modules/profiles/presentation';
import { useAuthMutation } from '@/shared/auth';

export const useDeleteAccount = () => {
  return useAuthMutation({
    mutationFn: deleteAccountAction,
    errorToastMessage: (error) => error.message || 'Error al eliminar la cuenta',
  });
};
