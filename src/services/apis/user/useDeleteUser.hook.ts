'use client';

import { deleteAccountAction } from '@/app/_actions';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccountAction,
    onError: (error: Error) => {
      if (error.message.includes('NEXT_REDIRECT')) return;
      toast.error(error.message || 'Error al eliminar la cuenta');
    },
  });
};
