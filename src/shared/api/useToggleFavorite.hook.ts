import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';

type ToggleFavoriteResponse = {
  success?: boolean | null;
  error?: string | null;
};

export const useToggleFavorite = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<ToggleFavoriteResponse>,
  queryKeys: string[][],
  errorMessage?: string
) => {
  const queryClient = useQueryClient();

  return useAuthMutation({
    mutationFn,
    onSuccess: (data) => {
      if (data.success) {
        queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      } else {
        toast.error('Error', {
          description: data.error || errorMessage || 'No se pudo actualizar favoritos',
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description: error.message || errorMessage || 'No se pudo actualizar favoritos',
      });
    },
  });
};
